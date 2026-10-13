import { type ReportServiceInterface } from '../services/report.service.js';
import { parseDateInput } from '../utils/date.js';
import { rl } from '../utils/readline.js';

export interface ReportControllerInterface {
  getLibrarySummary(): Promise<void>;
  getMostBorrowedBooks(): Promise<void>;
  getCustomersWithMostLoans(): Promise<void>;
  getLoansByPeriod(): Promise<void>;
}

export class ReportController implements ReportControllerInterface {
  constructor(private reportService: ReportServiceInterface) {}

  async getLibrarySummary(): Promise<void> {
    try {
      const summary = await this.reportService.getLibrarySummary();
      console.log('\n=== Library Summary ===');
      console.table([
        {
          totalBooks: summary.totalBooks,
          availableBooks: summary.availableBooks,
          unavailableBooks: summary.unavailableBooks,
          totalCustomers: summary.totalCustomers,
          totalAuthors: summary.totalAuthors,
          totalLoans: summary.totalLoans,
          activeLoans: summary.activeLoans,
          returnedLoans: summary.returnedLoans,
        },
      ]);
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async getMostBorrowedBooks(): Promise<void> {
    try {
      const limitInput = await rl.question(
        'Enter limit (leave blank for 10): ',
      );
      let limit = 10;
      if (limitInput.trim() !== '') {
        limit = Number(limitInput.trim());
        if (Number.isNaN(limit) || limit <= 0) {
          throw new Error('Limit must be a positive number');
        }
      }
      const books = await this.reportService.getMostBorrowedBooks(limit);
      if (books.length === 0) {
        console.log('No loans found.');
      } else {
        console.log('\n=== Most Borrowed Books ===');
        console.table(
          books.map((book) => ({
            bookId: book.bookId,
            title: book.title,
            publisher: book.publisher,
            totalLoans: book.totalLoans,
          })),
        );
      }
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async getCustomersWithMostLoans(): Promise<void> {
    try {
      const limitInput = await rl.question(
        'Enter limit (leave blank for 10): ',
      );
      let limit = 10;
      if (limitInput.trim() !== '') {
        limit = Number(limitInput.trim());
        if (Number.isNaN(limit) || limit <= 0) {
          throw new Error('Limit must be a positive number');
        }
      }
      const customers =
        await this.reportService.getCustomersWithMostLoans(limit);
      if (customers.length === 0) {
        console.log('No customers with loans found.');
      } else {
        console.log('\n=== Customers with Most Loans ===');
        console.table(
          customers.map((customer) => ({
            customerId: customer.customerId,
            name: customer.name,
            email: customer.email,
            totalLoans: customer.totalLoans,
            activeLoans: customer.activeLoans,
            returnedLoans: customer.returnedLoans,
          })),
        );
      }
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async getLoansByPeriod(): Promise<void> {
    try {
      const startDateInput = await rl.question(
        'Enter start date (YYYY-MM-DD): ',
      );
      const endDateInput = await rl.question('Enter end date (YYYY-MM-DD): ');
      if (!startDateInput || startDateInput.trim() === '') {
        throw new Error('Start date is required');
      }
      if (!endDateInput || endDateInput.trim() === '') {
        throw new Error('End date is required');
      }
      const startDate = parseDateInput(startDateInput.trim(), 'Start date');
      const endDate = parseDateInput(endDateInput.trim(), 'End date');
      const loans = await this.reportService.getLoansByPeriod(
        startDate,
        endDate,
      );
      if (loans.length === 0) {
        console.log('No loans found in the selected period.');
      } else {
        console.log('\n=== Loans by Period ===');
        console.table(
          loans.map((item) => ({
            date:
              item.date instanceof Date
                ? item.date.toLocaleDateString('pt-BR')
                : String(item.date),
            totalLoans: item.totalLoans,
            activeLoans: item.activeLoans,
            returnedLoans: item.returnedLoans,
          })),
        );
      }
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }
}
