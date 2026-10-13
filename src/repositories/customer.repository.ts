import type { Pool } from 'pg';
import {
  type Customer,
  type CustomerInput,
  type CustomerUpdateInput,
} from '../models/customer.models.js';

export interface CustomerRepositoryInterface {
  createCustomer(customerInput: CustomerInput): Promise<Customer | undefined>;
  getCustomerById(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  listCustomers(): Promise<Customer[] | undefined>;
  updateCustomer(
    id: string,
    customerUpdateInput: CustomerUpdateInput,
  ): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;
}

export class CustomerRepository implements CustomerRepositoryInterface {
  constructor(private pool: Pool) {}

  async createCustomer(
    customerInput: CustomerInput,
  ): Promise<Customer | undefined> {
    const result = await this.pool.query(
      `
            INSERT INTO customers (name, email, phone, birth_date, updated_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING id, name, email, phone, birth_date AS "birthDate", created_at AS "createdAt", updated_at AS "updatedAt"
        `,
      [
        customerInput.name,
        customerInput.email,
        customerInput.phone ?? null,
        customerInput.birthDate ?? null,
      ],
    );

    return result.rows[0];
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    const result = await this.pool.query(
      `
            SELECT id, name, email, phone, birth_date AS "birthDate", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM customers WHERE id = $1
        `,
      [id],
    );

    return result.rows[0];
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const result = await this.pool.query(
      `
            SELECT id, name, email, phone, birth_date AS "birthDate", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM customers WHERE email = $1
        `,
      [email],
    );

    return result.rows[0];
  }

  async listCustomers(): Promise<Customer[] | undefined> {
    const result = await this.pool.query(`
            SELECT id, name, email, phone, birth_date AS "birthDate", created_at AS "createdAt", updated_at AS "updatedAt"
            FROM customers
        `);

    return result.rows;
  }

  async updateCustomer(
    id: string,
    customerUpdateInput: CustomerUpdateInput,
  ): Promise<Customer | undefined> {
    const result = await this.pool.query(
      `
            UPDATE customers SET
                name = COALESCE($1, name),
                email = COALESCE($2, email),
                phone = COALESCE($3, phone),
                birth_date = COALESCE($4, birth_date),
                updated_at = NOW()
            WHERE id = $5
            RETURNING id, name, email, phone, birth_date AS "birthDate", created_at AS "createdAt", updated_at AS "updatedAt"
        `,
      [
        customerUpdateInput.name ?? null,
        customerUpdateInput.email ?? null,
        customerUpdateInput.phone ?? null,
        customerUpdateInput.birthDate ?? null,
        id,
      ],
    );

    return result.rows[0];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await this.pool.query(
      `
            DELETE FROM customers WHERE id = $1
        `,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  }
}
