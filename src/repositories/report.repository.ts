import type { Pool } from 'pg';
import {
  type LibrarySummaryReport,
  type MostBorrowedBookReport,
  type CustomerLoanReport,
  type LoansByPeriodReport,
} from '../models/report.models.js';

export interface ReportRepositoryInterface {
  getLibrarySummary(): Promise<LibrarySummaryReport>;
  getMostBorrowedBooks(limit?: number): Promise<MostBorrowedBookReport[]>;
  getCustomersWithMostLoans(limit?: number): Promise<CustomerLoanReport[]>;
  getLoansByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<LoansByPeriodReport[]>;
}

export class ReportRepository implements ReportRepositoryInterface {
  constructor(private pool: Pool) {}

  async getLibrarySummary(): Promise<LibrarySummaryReport> {
    const result = await this.pool.query(`
            SELECT
                (SELECT COUNT(*) FROM books) AS "totalBooks",

                (SELECT COUNT(*)
                 FROM books
                 WHERE available = TRUE) AS "availableBooks",

                (SELECT COUNT(*)
                 FROM books
                 WHERE available = FALSE) AS "unavailableBooks",

                (SELECT COUNT(*) FROM customers) AS "totalCustomers",

                (SELECT COUNT(*) FROM authors) AS "totalAuthors",

                (SELECT COUNT(*) FROM loans) AS "totalLoans",

                (SELECT COUNT(*)
                 FROM loans
                 WHERE status = 'active') AS "activeLoans",

                (SELECT COUNT(*)
                 FROM loans
                 WHERE status = 'returned') AS "returnedLoans"
        `);

    const row = result.rows[0];

    return {
      totalBooks: Number(row.totalBooks),
      availableBooks: Number(row.availableBooks),
      unavailableBooks: Number(row.unavailableBooks),
      totalCustomers: Number(row.totalCustomers),
      totalAuthors: Number(row.totalAuthors),
      totalLoans: Number(row.totalLoans),
      activeLoans: Number(row.activeLoans),
      returnedLoans: Number(row.returnedLoans),
    };
  }

  async getMostBorrowedBooks(limit = 10): Promise<MostBorrowedBookReport[]> {
    const result = await this.pool.query(
      `
            SELECT
                b.id AS "bookId",
                b.title,
                b.publisher,
                COUNT(l.id) AS "totalLoans"
            FROM books b
            INNER JOIN loans l ON l.book_id = b.id
            GROUP BY b.id, b.title, b.publisher
            ORDER BY COUNT(l.id) DESC, b.title ASC
            LIMIT $1
            `,
      [limit],
    );

    return result.rows.map((row) => ({
      bookId: row.bookId,
      title: row.title,
      publisher: row.publisher,
      totalLoans: Number(row.totalLoans),
    }));
  }

  async getCustomersWithMostLoans(limit = 10): Promise<CustomerLoanReport[]> {
    const result = await this.pool.query(
      `
            SELECT
                c.id AS "customerId",
                c.name,
                c.email,
                COUNT(l.id) AS "totalLoans",

                COUNT(l.id) FILTER (
                    WHERE l.status = 'active'
                ) AS "activeLoans",

                COUNT(l.id) FILTER (
                    WHERE l.status = 'returned'
                ) AS "returnedLoans"

            FROM customers c
            INNER JOIN loans l ON l.customer_id = c.id
            GROUP BY c.id, c.name, c.email
            ORDER BY COUNT(l.id) DESC, c.name ASC
            LIMIT $1
            `,
      [limit],
    );

    return result.rows.map((row) => ({
      customerId: row.customerId,
      name: row.name,
      email: row.email,
      totalLoans: Number(row.totalLoans),
      activeLoans: Number(row.activeLoans),
      returnedLoans: Number(row.returnedLoans),
    }));
  }

  async getLoansByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<LoansByPeriodReport[]> {
    const result = await this.pool.query(
      `
            SELECT
                l.loan_date AS date,
                COUNT(*) AS "totalLoans",

                COUNT(*) FILTER (
                    WHERE l.status = 'active'
                ) AS "activeLoans",

                COUNT(*) FILTER (
                    WHERE l.status = 'returned'
                ) AS "returnedLoans"

            FROM loans l
            WHERE l.loan_date >= $1::date
              AND l.loan_date <= $2::date
            GROUP BY l.loan_date
            ORDER BY l.loan_date ASC
            `,
      [startDate, endDate],
    );

    return result.rows.map((row) => ({
      date: row.date,
      totalLoans: Number(row.totalLoans),
      activeLoans: Number(row.activeLoans),
      returnedLoans: Number(row.returnedLoans),
    }));
  }
}
