import { type ReportRepositoryInterface } from '../repositories/report.repository.js';
import {
  type LibrarySummaryReport,
  type MostBorrowedBookReport,
  type CustomerLoanReport,
  type LoansByPeriodReport,
} from '../models/report.models.js';

export interface ReportServiceInterface {
  getLibrarySummary(): Promise<LibrarySummaryReport>;
  getMostBorrowedBooks(limit?: number): Promise<MostBorrowedBookReport[]>;
  getCustomersWithMostLoans(limit?: number): Promise<CustomerLoanReport[]>;
  getLoansByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<LoansByPeriodReport[]>;
}

export class ReportService implements ReportServiceInterface {
  constructor(private reportRepository: ReportRepositoryInterface) {}

  async getLibrarySummary(): Promise<LibrarySummaryReport> {
    return this.reportRepository.getLibrarySummary();
  }

  async getMostBorrowedBooks(limit = 10): Promise<MostBorrowedBookReport[]> {
    if (limit <= 0) {
      throw new Error('Limit must be greater than zero');
    }
    return this.reportRepository.getMostBorrowedBooks(limit);
  }

  async getCustomersWithMostLoans(limit = 10): Promise<CustomerLoanReport[]> {
    if (limit <= 0) {
      throw new Error('Limit must be greater than zero');
    }
    return this.reportRepository.getCustomersWithMostLoans(limit);
  }

  async getLoansByPeriod(
    startDate: Date,
    endDate: Date,
  ): Promise<LoansByPeriodReport[]> {
    if (startDate > endDate) {
      throw new Error('Start date must be before or equal to end date');
    }
    return this.reportRepository.getLoansByPeriod(startDate, endDate);
  }
}
