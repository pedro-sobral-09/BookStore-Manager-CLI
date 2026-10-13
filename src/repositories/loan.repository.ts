import { type Pool, type PoolClient } from "pg";
import {
    type Loan,
    type LoanInput,
    type LoanUpdateInput,
    type LoanWithDetails,
    type LoanStatus,
} from "../models/loan.models.js";

export interface LoanRepositoryInterface {
    createLoan(loanInput: LoanInput): Promise<Loan | undefined>;
    getLoanById(id: string): Promise<LoanWithDetails | undefined>;
    getActiveLoanByBookId(bookId: string): Promise<Loan | undefined>;
    listLoans(status?: LoanStatus): Promise<LoanWithDetails[] | undefined>;
    updateLoan(id: string, loanUpdateInput: LoanUpdateInput): Promise<Loan | undefined>;
    returnLoan(id: string, returnDate?: Date): Promise<Loan | undefined>;
    deleteLoan(id: string): Promise<boolean>;
}

const LOAN_COLUMNS = `
    id,
    customer_id AS "customerId",
    book_id AS "bookId",
    loan_date AS "loanDate",
    return_date AS "returnDate",
    status,
    created_at AS "createdAt",
    updated_at AS "updatedAt"
`;

const LOAN_WITH_DETAILS_SELECT = `
    SELECT
        l.id,
        l.customer_id AS "customerId",
        l.book_id AS "bookId",
        l.loan_date AS "loanDate",
        l.return_date AS "returnDate",
        l.status,
        l.created_at AS "createdAt",
        l.updated_at AS "updatedAt",

        c.name AS "customerName",
        c.email AS "customerEmail",
        c.phone AS "customerPhone",
        c.birth_date AS "customerBirthDate",
        c.created_at AS "customerCreatedAt",
        c.updated_at AS "customerUpdatedAt",

        b.title AS "bookTitle",
        b.publication_year AS "bookPublicationYear",
        b.publisher AS "bookPublisher",
        b.publication_date AS "bookPublicationDate",
        b.available AS "bookAvailable",
        b.genre AS "bookGenre",
        b.page_count AS "bookPageCount",
        b.created_at AS "bookCreatedAt",
        b.updated_at AS "bookUpdatedAt",
        COALESCE(array_agg(ba.author_id) FILTER (WHERE ba.author_id IS NOT NULL), '{}') AS "bookAuthorIds"
    FROM loans l
    INNER JOIN customers c ON c.id = l.customer_id
    INNER JOIN books b ON b.id = l.book_id
    LEFT JOIN book_authors ba ON ba.book_id = b.id
`;

const LOAN_WITH_DETAILS_GROUP_BY = `GROUP BY l.id, c.id, b.id`;

export class LoanRepository implements LoanRepositoryInterface {
    constructor(private pool: Pool) {}

    private mapLoanWithDetails(row: any): LoanWithDetails {
        return {
            id: row.id,
            customerId: row.customerId,
            bookId: row.bookId,
            loanDate: row.loanDate,
            returnDate: row.returnDate ?? null,
            status: row.status,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt ?? undefined,
            customer: {
                id: row.customerId,
                name: row.customerName,
                email: row.customerEmail,
                phone: row.customerPhone ?? undefined,
                birthDate: row.customerBirthDate ?? undefined,
                createdAt: row.customerCreatedAt,
                updatedAt: row.customerUpdatedAt,
            },
            book: {
                id: row.bookId,
                title: row.bookTitle,
                publicationYear: row.bookPublicationYear,
                publisher: row.bookPublisher,
                publicationDate: row.bookPublicationDate ?? undefined,
                available: row.bookAvailable,
                genre: row.bookGenre,
                pageCount: row.bookPageCount,
                createdAt: row.bookCreatedAt,
                updatedAt: row.bookUpdatedAt,
                authorIds: row.bookAuthorIds ?? [],
            },
        };
    }

    private async syncBookAvailability(client: PoolClient, bookIds: string[]): Promise<void> {
        await client.query(
            `
            UPDATE books SET
                available = NOT EXISTS (
                    SELECT 1 FROM loans WHERE loans.book_id = books.id AND loans.status = 'active'
                ),
                updated_at = NOW()
            WHERE id = ANY($1::uuid[])
            `,
            [bookIds],
        );
    }

    private translateError(error: unknown): unknown {
        if ((error as { code?: string }).code === '23505') {
            return new Error('Book already has an active loan');
        }

        return error;
    }

    async createLoan(loanInput: LoanInput): Promise<Loan | undefined> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                `
                INSERT INTO loans (customer_id, book_id, loan_date, status, updated_at)
                VALUES ($1, $2, COALESCE($3, CURRENT_DATE), COALESCE($4::loan_status, 'active'::loan_status), NOW())
                RETURNING ${LOAN_COLUMNS}
                `,
                [
                    loanInput.customerId,
                    loanInput.bookId,
                    loanInput.loanDate ?? null,
                    loanInput.status ?? null,
                ],
            );

            const loan = result.rows[0];

            if (!loan) {
                await client.query('ROLLBACK');
                return undefined;
            }

            await this.syncBookAvailability(client, [loan.bookId]);

            await client.query('COMMIT');

            return loan;
        } catch (error) {
            await client.query('ROLLBACK');
            throw this.translateError(error);
        } finally {
            client.release();
        }
    }

    async getLoanById(id: string): Promise<LoanWithDetails | undefined> {
        const result = await this.pool.query(
            `
            ${LOAN_WITH_DETAILS_SELECT}
            WHERE l.id = $1
            ${LOAN_WITH_DETAILS_GROUP_BY}
            LIMIT 1
            `,
            [id],
        );

        const row = result.rows[0];
        return row ? this.mapLoanWithDetails(row) : undefined;
    }

    async getActiveLoanByBookId(bookId: string): Promise<Loan | undefined> {
        const result = await this.pool.query(
            `
            SELECT ${LOAN_COLUMNS}
            FROM loans
            WHERE book_id = $1 AND status = 'active'
            LIMIT 1
            `,
            [bookId],
        );

        return result.rows[0];
    }

    async listLoans(status?: LoanStatus): Promise<LoanWithDetails[] | undefined> {
        const result = await this.pool.query(
            `
            ${LOAN_WITH_DETAILS_SELECT}
            WHERE ($1::loan_status IS NULL OR l.status = $1::loan_status)
            ${LOAN_WITH_DETAILS_GROUP_BY}
            ORDER BY l.created_at DESC
            `,
            [status ?? null],
        );

        return result.rows.map((row) => this.mapLoanWithDetails(row));
    }

    async updateLoan(id: string, loanUpdateInput: LoanUpdateInput): Promise<Loan | undefined> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const previous = await client.query(
                `SELECT book_id AS "bookId" FROM loans WHERE id = $1 FOR UPDATE`,
                [id],
            );

            const previousBookId: string | undefined = previous.rows[0]?.bookId;

            if (!previousBookId) {
                await client.query('ROLLBACK');
                return undefined;
            }

            const result = await client.query(
                `
                UPDATE loans SET
                    customer_id = COALESCE($1, customer_id),
                    book_id = COALESCE($2, book_id),
                    loan_date = COALESCE($3, loan_date),
                    return_date = CASE WHEN $4::boolean THEN $5::date ELSE return_date END,
                    status = COALESCE($6::loan_status, status),
                    updated_at = NOW()
                WHERE id = $7
                RETURNING ${LOAN_COLUMNS}
                `,
                [
                    loanUpdateInput.customerId ?? null,
                    loanUpdateInput.bookId ?? null,
                    loanUpdateInput.loanDate ?? null,
                    loanUpdateInput.returnDate !== undefined,
                    loanUpdateInput.returnDate ?? null,
                    loanUpdateInput.status ?? null,
                    id,
                ],
            );

            const loan = result.rows[0];

            if (!loan) {
                await client.query('ROLLBACK');
                return undefined;
            }

            await this.syncBookAvailability(client, [...new Set([previousBookId, loan.bookId])]);

            await client.query('COMMIT');

            return loan;
        } catch (error) {
            await client.query('ROLLBACK');
            throw this.translateError(error);
        } finally {
            client.release();
        }
    }

    async returnLoan(id: string, returnDate?: Date): Promise<Loan | undefined> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                `
                UPDATE loans SET
                    return_date = COALESCE($1, CURRENT_DATE),
                    status = 'returned'::loan_status,
                    updated_at = NOW()
                WHERE id = $2
                RETURNING ${LOAN_COLUMNS}
                `,
                [returnDate ?? null, id],
            );

            const loan = result.rows[0];

            if (!loan) {
                await client.query('ROLLBACK');
                return undefined;
            }

            await this.syncBookAvailability(client, [loan.bookId]);

            await client.query('COMMIT');

            return loan;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteLoan(id: string): Promise<boolean> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const result = await client.query(
                `DELETE FROM loans WHERE id = $1 RETURNING book_id AS "bookId"`,
                [id],
            );

            const deleted = result.rows[0];

            if (!deleted) {
                await client.query('ROLLBACK');
                return false;
            }

            await this.syncBookAvailability(client, [deleted.bookId]);

            await client.query('COMMIT');

            return true;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}