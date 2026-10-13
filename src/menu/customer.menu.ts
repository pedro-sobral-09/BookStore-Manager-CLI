import { rl } from '../utils/readline.js';
import { type CustomerControllerInterface } from '../controllers/customer.controller.js';

export interface CustomerMenuInterface {
  showMenu(): Promise<void>;
}

export class CustomerMenu implements CustomerMenuInterface {
  constructor(private customerController: CustomerControllerInterface) {}

  async showMenu(): Promise<void> {
    let exit = false;

    while (!exit) {
      console.clear();
      console.log('\nCustomer Menu:');
      console.log('1. Create Customer');
      console.log('2. Get Customer by ID');
      console.log('3. Get Customer by Email');
      console.log('4. List Customers');
      console.log('5. Update Customer');
      console.log('6. Delete Customer');
      console.log('0. Exit');

      const choice = await rl.question('Select an option: ');

      switch (choice) {
        case '1': {
          console.log('\nCreate Customer:');
          await this.customerController.createCustomer();
          break;
        }

        case '2': {
          console.log('\nGet Customer by ID:');
          await this.customerController.getCustomerById();
          break;
        }

        case '3': {
          console.log('\nGet Customer by Email:');
          await this.customerController.getCustomerByEmail();
          break;
        }

        case '4': {
          console.log('\nList Customers:');
          await this.customerController.listCustomers();
          break;
        }

        case '5': {
          console.log('\nUpdate Customer:');
          await this.customerController.updateCustomer();
          break;
        }

        case '6': {
          console.log('\nDelete Customer:');
          await this.customerController.deleteCustomer();
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
