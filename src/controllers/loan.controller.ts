import { type LoanInput, type LoanUpdateInput, LoanStatus } from '../models/loan.models.js';
import { type LoanServiceInterface } from '../services/loan.service.js';
import { parseDateInput } from '../utils/date.js';
import { rl } from '../utils/readline.js';

export interface LoanControllerInterface {
    createLoan(): Promise<void>;
    getLoanById(): Promise<void>;
    listLoans(): Promise<void>;
    updateLoan(): Promise<void>;
    returnLoan(): Promise<void>;
    deleteLoan(): Promise<void>;
}

export class LoanController implements LoanControllerInterface {
    constructor(private loanService: LoanServiceInterface) {}

    async createLoan(): Promise<void> {
        try {
            const customerId = await rl.question('Enter customer ID: ');
            const bookId = await rl.question('Enter book ID: ');
            const loanDate = await rl.question('Enter loan date YYYY-MM-DD (leave blank for today): ');

            if (!customerId || customerId.trim() === '') {
                throw new Error('Customer ID is required');
            }

            if (!bookId || bookId.trim() === '') {
                throw new Error('Book ID is required');
            }

            const loanInput: LoanInput = {
                customerId: customerId.trim(),
                bookId: bookId.trim(),
            };

            if (loanDate) {
                loanInput.loanDate = parseDateInput(loanDate.trim(), 'Loan date');
            }

            const loan = await this.loanService.createLoan(loanInput);

            console.log('Loan created:', loan);

            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async getLoanById(): Promise<void> {
        try {
            const id = await rl.question('Enter loan ID: ');

            if (!id || id.trim() === '') {
                throw new Error('Loan ID is required');
            }

            const loan = await this.loanService.getLoanById(id.trim());

            console.log('Loan found:', loan);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async listLoans(): Promise<void> {
        try {
            const status = await rl.question('Filter by status active/returned (leave blank for all): ');

            let statusFilter: LoanStatus | undefined;

            if (status) {
                const normalizedStatus = status.trim().toLowerCase();

                if (!Object.values(LoanStatus).includes(normalizedStatus as LoanStatus)) {
                    throw new Error('Loan status is invalid (use active or returned)');
                }

                statusFilter = normalizedStatus as LoanStatus;
            }

            const loans = await this.loanService.listLoans(statusFilter);

            // console.table mostra livro, cliente e datas (RF12); console.log esconderia os objetos aninhados
            console.log('Loans:');
            console.table(
                loans.map((loan) => ({
                    id: loan.id,
                    book: loan.book.title,
                    customer: loan.customer.name,
                    loanDate: loan.loanDate.toLocaleDateString('pt-BR'),
                    returnDate: loan.returnDate ? loan.returnDate.toLocaleDateString('pt-BR') : '-',
                    status: loan.status,
                })),
            );

            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async updateLoan(): Promise<void> {
        try {
            const updateId = await rl.question('Enter loan ID: ');

            if (!updateId || updateId.trim() === '') {
                throw new Error('Loan ID is required');
            }

            const updateCustomerId = await rl.question('Enter new customer ID (leave blank to keep current): ');
            const updateBookId = await rl.question('Enter new book ID (leave blank to keep current): ');
            const updateLoanDate = await rl.question('Enter new loan date YYYY-MM-DD (leave blank to keep current): ');
            const updateStatus = await rl.question('Enter new status active/returned (leave blank to keep current): ');
            const updateReturnDate = await rl.question('Enter new return date YYYY-MM-DD (leave blank to keep current): ');

            const loanUpdateInput: LoanUpdateInput = {};

            if (updateCustomerId) {
                loanUpdateInput.customerId = updateCustomerId.trim();
            }

            if (updateBookId) {
                loanUpdateInput.bookId = updateBookId.trim();
            }

            if (updateLoanDate) {
                loanUpdateInput.loanDate = parseDateInput(updateLoanDate.trim(), 'Loan date');
            }

            if (updateStatus) {
                const normalizedStatus = updateStatus.trim().toLowerCase();

                if (!Object.values(LoanStatus).includes(normalizedStatus as LoanStatus)) {
                    throw new Error('Loan status is invalid (use active or returned)');
                }

                loanUpdateInput.status = normalizedStatus as LoanStatus;
            }

            if (updateReturnDate) {
                loanUpdateInput.returnDate = parseDateInput(updateReturnDate.trim(), 'Return date');
            }

            const updatedLoan = await this.loanService.updateLoan(updateId.trim(), loanUpdateInput);

            console.log('Loan updated:', updatedLoan);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async returnLoan(): Promise<void> {
        try {
            const id = await rl.question('Enter loan ID: ');

            if (!id || id.trim() === '') {
                throw new Error('Loan ID is required');
            }

            const returnDate = await rl.question('Enter return date YYYY-MM-DD (leave blank for today): ');

            const returnedLoan = returnDate
                ? await this.loanService.returnLoan(id.trim(), { returnDate: parseDateInput(returnDate.trim(), 'Return date') })
                : await this.loanService.returnLoan(id.trim());

            console.log('Loan returned:', returnedLoan);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async deleteLoan(): Promise<void> {
        try {
            const deleteId = await rl.question('Enter loan ID: ');

            if (!deleteId || deleteId.trim() === '') {
                throw new Error('Loan ID is required');
            }

            const success = await this.loanService.deleteLoan(deleteId.trim());

            if (success) {
                console.log('Loan deleted successfully.');
                await rl.question('Press Enter to continue.');
            } else {
                console.log('Failed to delete loan.');
                await rl.question('Press Enter to continue.');
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }
}
