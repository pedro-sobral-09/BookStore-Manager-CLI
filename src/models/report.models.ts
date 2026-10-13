export interface LibrarySummaryReport {
    totalBooks: number;
    availableBooks: number;
    unavailableBooks: number;
    totalCustomers: number;
    totalAuthors: number;
    totalLoans: number;
    activeLoans: number;
    returnedLoans: number;
}

export interface MostBorrowedBookReport {
    bookId: string;
    title: string;
    publisher: string;
    totalLoans: number;
}

export interface CustomerLoanReport {
    customerId: string;
    name: string;
    email: string;
    totalLoans: number;
    activeLoans: number;
    returnedLoans: number;
}

export interface LoansByPeriodReport {
    date: Date;
    totalLoans: number;
    activeLoans: number;
    returnedLoans: number;
}