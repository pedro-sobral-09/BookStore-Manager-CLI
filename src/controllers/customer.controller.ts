import {
  type CustomerInput,
  type CustomerUpdateInput,
} from '../models/customer.models.js';
import { type CustomerServiceInterface } from '../services/customer.service.js';
import { rl } from '../utils/readline.js';

export interface CustomerControllerInterface {
  createCustomer(): Promise<void>;
  getCustomerById(): Promise<void>;
  getCustomerByEmail(): Promise<void>;
  listCustomers(): Promise<void>;
  updateCustomer(): Promise<void>;
  deleteCustomer(): Promise<void>;
}

export class CustomerController implements CustomerControllerInterface {
  constructor(private customerService: CustomerServiceInterface) {}

  async createCustomer(): Promise<void> {
    try {
      const name = await rl.question('Enter customer name: ');
      const email = await rl.question('Enter customer email: ');
      const phone = await rl.question('Enter customer phone (optional): ');
      const birthDate = await rl.question(
        'Enter birth date YYYY-MM-DD (optional): ',
      );

      if (!name || name.trim() === '') {
        throw new Error('Customer name is required');
      }

      if (!email || email.trim() === '') {
        throw new Error('Customer email is required');
      }

      if (!email.includes('@')) {
        throw new Error('Customer email is invalid');
      }

      const customerInput: CustomerInput = {
        name,
        email,
      };

      if (phone) {
        customerInput.phone = phone;
      }

      if (birthDate) {
        const parsedBirthDate = new Date(birthDate);

        if (Number.isNaN(parsedBirthDate.getTime())) {
          throw new Error('Customer birth date is invalid');
        }

        customerInput.birthDate = parsedBirthDate;
      }

      const customer = await this.customerService.createCustomer(customerInput);

      console.log('Customer created:', customer);

      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async getCustomerById(): Promise<void> {
    try {
      const id = await rl.question('Enter customer ID: ');

      if (!id) {
        throw new Error('Customer ID is required');
      }

      const customer = await this.customerService.getCustomerById(id);

      console.log('Customer found:', customer);
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async getCustomerByEmail(): Promise<void> {
    try {
      const email = await rl.question('Enter customer email: ');

      if (!email || email.trim() === '') {
        throw new Error('Customer email is required');
      }

      const customer = await this.customerService.getCustomerByEmail(email);

      console.log('Customer found:', customer);
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async listCustomers(): Promise<void> {
    try {
      const customers = await this.customerService.listCustomers();

      console.log('Customers:', customers);
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async updateCustomer(): Promise<void> {
    try {
      const updateId = await rl.question('Enter customer ID: ');

      if (!updateId) {
        throw new Error('Customer ID is required');
      }

      const updateName = await rl.question(
        'Enter new customer name (leave blank to keep current): ',
      );
      const updateEmail = await rl.question(
        'Enter new customer email (leave blank to keep current): ',
      );
      const updatePhone = await rl.question(
        'Enter new customer phone (leave blank to keep current): ',
      );
      const updateBirthDate = await rl.question(
        'Enter new birth date YYYY-MM-DD (leave blank to keep current): ',
      );

      const customerUpdateInput: CustomerUpdateInput = {};

      if (updateName) {
        customerUpdateInput.name = updateName;
      }

      if (updateEmail) {
        if (!updateEmail.includes('@')) {
          throw new Error('Customer email is invalid');
        }

        customerUpdateInput.email = updateEmail;
      }

      if (updatePhone) {
        customerUpdateInput.phone = updatePhone;
      }

      if (updateBirthDate) {
        const parsedBirthDate = new Date(updateBirthDate);

        if (Number.isNaN(parsedBirthDate.getTime())) {
          throw new Error('Customer birth date is invalid');
        }

        customerUpdateInput.birthDate = parsedBirthDate;
      }

      const updatedCustomer = await this.customerService.updateCustomer(
        updateId,
        customerUpdateInput,
      );

      console.log('Customer updated:', updatedCustomer);
      await rl.question('Press Enter to continue.');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
        await rl.question('Press Enter to continue.');
      }
    }
  }

  async deleteCustomer(): Promise<void> {
    try {
      const deleteId = await rl.question('Enter customer ID: ');

      if (!deleteId) {
        throw new Error('Customer ID is required');
      }

      const success = await this.customerService.deleteCustomer(deleteId);

      if (success) {
        console.log('Customer deleted successfully.');
        await rl.question('Press Enter to continue.');
      } else {
        console.log('Failed to delete customer.');
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
