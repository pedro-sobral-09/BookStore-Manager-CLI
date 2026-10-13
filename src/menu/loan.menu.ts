import { rl } from '../utils/readline.js';
import { type LoanControllerInterface } from '../controllers/loan.controller.js';

export interface LoanMenuInterface {
  showMenu(): Promise<void>;
}

export class LoanMenu implements LoanMenuInterface {
  constructor(private loanController: LoanControllerInterface) {}

  async showMenu(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.clear();
      console.log('\nLoan Menu:');
      console.log('1. Create Loan');
      console.log('2. Get Loan by ID');
      console.log('3. List Loans');
      console.log('4. Update Loan');
      console.log('5. Return Loan');
      console.log('6. Delete Loan');
      console.log('0. Exit');

      const choice = await rl.question('Select an option: ');

      switch (choice) {
        case '1': {
          console.log('\nCreate Loan:');
          await this.loanController.createLoan();
          break;
        }

        case '2': {
          console.log('\nGet Loan by ID:');
          await this.loanController.getLoanById();
          break;
        }

        case '3': {
          console.log('\nList Loans:');
          await this.loanController.listLoans();
          break;
        }

        case '4': {
          console.log('\nUpdate Loan:');
          await this.loanController.updateLoan();
          break;
        }

        case '5': {
          console.log('\nReturn Loan:');
          await this.loanController.returnLoan();
          break;
        }

        case '6': {
          console.log('\nDelete Loan:');
          await this.loanController.deleteLoan();
          break;
        }

        case '0': {
          exit = true;
          break;
        }

        default: {
          console.log('Invalid option.');
          await rl.question('Press Enter to continue.');
          break;
        }
      }
    }
  }
}
