import { type Customer } from "./customer.models.js";
import { type Book } from "./book.models.js";

export enum LoanStatus {
    ACTIVE = 'active',
    RETURNED = 'returned',
}

export interface Loan {
    id: string;
    customerId: string;
    bookId: string;
    loanDate: Date;
    returnDate?: Date | null;
    status: LoanStatus;
    createdAt: Date;
    updatedAt?: Date;
}

export interface LoanInput {
    customerId: string;
    bookId: string;
    loanDate?: Date;
    status?: LoanStatus;
}

export interface LoanUpdateInput {
    customerId?: string;
    bookId?: string;
    loanDate?: Date;
    returnDate?: Date | null;
    status?: LoanStatus;
}

export interface ReturnLoanInput {
    returnDate: Date;
}

export interface LoanWithDetails extends Loan {
    customer: Customer;
    book: Book;
}