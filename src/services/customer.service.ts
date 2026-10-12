import { type Customer, type CustomerInput, type CustomerUpdateInput } from '../models/customer.models.js';
import { type CustomerRepositoryInterface } from '../repositories/customer.repository.js';

export interface CustomerServiceInterface {
    createCustomer(customerInput: CustomerInput): Promise<Customer>;
    getCustomerById(id: string): Promise<Customer>;
    getCustomerByEmail(email: string): Promise<Customer>;
    listCustomers(): Promise<Customer[]>;
    updateCustomer(id: string, customerUpdateInput: CustomerUpdateInput): Promise<Customer>;
    deleteCustomer(id: string): Promise<boolean>;
}

export class CustomerService implements CustomerServiceInterface {
    constructor(private customerRepository: CustomerRepositoryInterface) {}

    async createCustomer(customerInput: CustomerInput): Promise<Customer> {
        const customerExisting = await this.customerRepository.getCustomerByEmail(customerInput.email);

        if (customerExisting) {
            throw new Error('Customer already exists');
        }

        const customer = await this.customerRepository.createCustomer(customerInput);

        if (!customer) {
            throw new Error('Failed to create customer');
        }

        return customer;
    }

    async getCustomerById(id: string): Promise<Customer> {
        const customer = await this.customerRepository.getCustomerById(id);

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer;
    }

    async getCustomerByEmail(email: string): Promise<Customer> {
        const customer = await this.customerRepository.getCustomerByEmail(email);

        if (!customer) {
            throw new Error('Customer not found');
        }

        return customer;
    }

    async listCustomers(): Promise<Customer[]> {
        const customers = await this.customerRepository.listCustomers();

        if (!customers) {
            throw new Error('Failed to list customers');
        }

        return customers;
    }

    async updateCustomer(id: string, customerUpdateInput: CustomerUpdateInput): Promise<Customer> {
        if (customerUpdateInput.email) {
            const customerExisting = await this.customerRepository.getCustomerByEmail(customerUpdateInput.email);

            if (customerExisting && customerExisting.id !== id) {
                throw new Error('Customer with this email already exists');
            }
        }

        const customer = await this.customerRepository.updateCustomer(id, customerUpdateInput);

        if (!customer) {
            throw new Error('Failed to update customer');
        }

        return customer;
    }

    async deleteCustomer(id: string): Promise<boolean> {
        const customer = await this.customerRepository.getCustomerById(id);

        if (!customer) {
            throw new Error('Customer not found');
        }

        const deleted = await this.customerRepository.deleteCustomer(id);

        if (!deleted) {
            throw new Error('Failed to delete customer');
        }

        return deleted;
    }
}
