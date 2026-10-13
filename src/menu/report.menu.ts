import { rl } from '../utils/readline.js';
import { type ReportControllerInterface } from '../controllers/report.controller.js';

export interface ReportMenuInterface {
  showMenu(): Promise<void>;
}

export class ReportMenu implements ReportMenuInterface {
  constructor(private reportController: ReportControllerInterface) {}

  async showMenu(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.clear();
      console.log('\nReport Menu:');
      console.log('1. Library Summary');
      console.log('2. Most Borrowed Books');
      console.log('3. Customers with Most Loans');
      console.log('4. Loans by Period');
      console.log('0. Exit');

      const choice = await rl.question('Select an option: ');

      switch (choice) {
        case '1':
          console.log('\nLibrary Summary:');
          await this.reportController.getLibrarySummary();
          break;
        case '2':
          console.log('\nMost Borrowed Books:');
          await this.reportController.getMostBorrowedBooks();
          break;
        case '3':
          console.log('\nCustomers with Most Loans:');
          await this.reportController.getCustomersWithMostLoans();
          break;
        case '4':
          console.log('\nLoans by Period:');
          await this.reportController.getLoansByPeriod();
          break;
        case '0':
          exit = true;
          break;
        default:
          console.log('Invalid option.');
          await rl.question('Press Enter to continue.');
          break;
      }
    }
  }
}
