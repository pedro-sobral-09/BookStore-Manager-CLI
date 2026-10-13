import { type LoanRepositoryInterface } from '../repositories/loan.repository.js';
import { type BookRepositoryInterface } from '../repositories/book.repository.js';
import { type CustomerRepositoryInterface } from '../repositories/customer.repository.js';
import {
  type Loan,
  type LoanInput,
  type LoanUpdateInput,
  type LoanWithDetails,
  type ReturnLoanInput,
  LoanStatus,
} from '../models/loan.models.js';

export interface LoanServiceInterface {
  createLoan(loanInput: LoanInput): Promise<Loan>;
  getLoanById(id: string): Promise<LoanWithDetails>;
  listLoans(status?: LoanStatus): Promise<LoanWithDetails[]>;
  updateLoan(id: string, loanUpdateInput: LoanUpdateInput): Promise<Loan>;
  returnLoan(id: string, returnLoanInput?: ReturnLoanInput): Promise<Loan>;
  deleteLoan(id: string): Promise<boolean>;
}

export class LoanService implements LoanServiceInterface {
  constructor(
    private loanRepository: LoanRepositoryInterface,
    private bookRepository: BookRepositoryInterface,
    private customerRepository: CustomerRepositoryInterface,
  ) {}

  async createLoan(loanInput: LoanInput): Promise<Loan> {
    if (!loanInput.customerId) {
      throw new Error('Customer ID is required');
    }

    if (!loanInput.bookId) {
      throw new Error('Book ID is required');
    }

    const customer = await this.customerRepository.getCustomerById(
      loanInput.customerId,
    );

    if (!customer) {
      throw new Error('Customer not found');
    }

    const book = await this.bookRepository.getBookById(loanInput.bookId);

    if (!book) {
      throw new Error('Book not found');
    }

    if (!book.available) {
      throw new Error('Book is not available');
    }

    const activeLoan = await this.loanRepository.getActiveLoanByBookId(
      loanInput.bookId,
    );

    if (activeLoan) {
      throw new Error('Book already has an active loan');
    }

    const loan = await this.loanRepository.createLoan({
      ...loanInput,
      loanDate: loanInput.loanDate ?? new Date(),
      status: LoanStatus.ACTIVE,
    });

    if (!loan) {
      throw new Error('Failed to create loan');
    }

    return loan;
  }

  async getLoanById(id: string): Promise<LoanWithDetails> {
    const loan = await this.loanRepository.getLoanById(id);

    if (!loan) {
      throw new Error('Loan not found');
    }

    return loan;
  }

  async listLoans(status?: LoanStatus): Promise<LoanWithDetails[]> {
    const loans = await this.loanRepository.listLoans(status);

    if (!loans) {
      throw new Error('Failed to list loans');
    }

    return loans;
  }

  async updateLoan(
    id: string,
    loanUpdateInput: LoanUpdateInput,
  ): Promise<Loan> {
    const existingLoan = await this.loanRepository.getLoanById(id);

    if (!existingLoan) {
      throw new Error('Loan not found');
    }

    if (loanUpdateInput.customerId) {
      const customer = await this.customerRepository.getCustomerById(
        loanUpdateInput.customerId,
      );

      if (!customer) {
        throw new Error('Customer not found');
      }
    }

    const targetBookId = loanUpdateInput.bookId ?? existingLoan.bookId;
    const targetStatus = loanUpdateInput.status ?? existingLoan.status;
    const bookChanged = targetBookId !== existingLoan.bookId;
    const willBeActive = targetStatus === LoanStatus.ACTIVE;

    const needsFreeBook =
      willBeActive &&
      (bookChanged || existingLoan.status !== LoanStatus.ACTIVE);

    if (bookChanged || needsFreeBook) {
      const book = await this.bookRepository.getBookById(targetBookId);

      if (!book) {
        throw new Error('Book not found');
      }

      if (needsFreeBook) {
        if (!book.available) {
          throw new Error('Book is not available');
        }

        const activeLoan =
          await this.loanRepository.getActiveLoanByBookId(targetBookId);

        if (activeLoan && activeLoan.id !== id) {
          throw new Error('Book already has an active loan');
        }
      }
    }

    if (willBeActive && loanUpdateInput.returnDate) {
      throw new Error('Active loan cannot have a return date');
    }

    const loanDate = loanUpdateInput.loanDate ?? existingLoan.loanDate;
    let returnDate: Date | null = null;

    if (!willBeActive) {
      returnDate =
        loanUpdateInput.returnDate ?? existingLoan.returnDate ?? new Date();

      if (new Date(returnDate) < new Date(loanDate)) {
        throw new Error('Return date cannot be earlier than loan date');
      }
    }

    const updatedLoan = await this.loanRepository.updateLoan(id, {
      ...loanUpdateInput,
      returnDate,
    });

    if (!updatedLoan) {
      throw new Error('Failed to update loan');
    }

    return updatedLoan;
  }

  async returnLoan(
    id: string,
    returnLoanInput?: ReturnLoanInput,
  ): Promise<Loan> {
    const loan = await this.loanRepository.getLoanById(id);

    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.status !== LoanStatus.ACTIVE) {
      throw new Error('Only active loans can be returned');
    }

    const returnDate = returnLoanInput?.returnDate ?? new Date();

    if (new Date(returnDate) < new Date(loan.loanDate)) {
      throw new Error('Return date cannot be earlier than loan date');
    }

    const returnedLoan = await this.loanRepository.returnLoan(id, returnDate);

    if (!returnedLoan) {
      throw new Error('Failed to return loan');
    }

    return returnedLoan;
  }

  async deleteLoan(id: string): Promise<boolean> {
    const loan = await this.loanRepository.getLoanById(id);

    if (!loan) {
      throw new Error('Loan not found');
    }

    const deleted = await this.loanRepository.deleteLoan(id);

    if (!deleted) {
      throw new Error('Failed to delete loan');
    }

    return deleted;
  }
}
