import type { Pool } from "pg";
import { type Author, type AuthorInput, type AuthorUpdateInput } from "../models/author.models.js";

export interface AuthorRepositoryInterface {
    createAuthor(authorInput: AuthorInput): Promise<Author | undefined>;
    getAuthorById(id: string): Promise<Author | undefined>;
    getAuthorByName(name: string): Promise<Author | undefined>;
    listAuthors(): Promise<Author[] | undefined>;
    updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author | undefined>;
    deleteAuthor(id: string): Promise<boolean>;
}

export class CreateAuthorRepository implements AuthorRepositoryInterface {
    constructor(private pool: Pool) {}

    async createAuthor(authorInput: AuthorInput): Promise<Author | undefined> {
        const result = await this.pool.query(`
            INSERT INTO authors (name, nationality)
            VALUES ($1, $2)
            RETURNING id, name, nationality
        `, [authorInput.name, authorInput.nationality]);

        return result.rows[0];
    }

    async getAuthorById(id: string): Promise<Author | undefined> {
        const result = await this.pool.query(`
            SELECT id, name, nationality FROM authors WHERE id = $1
        `, [id]);

        return result.rows[0];
    }

    async getAuthorByName(name: string): Promise<Author | undefined> {
        const result = await this.pool.query(`
            SELECT id, name, nationality FROM authors WHERE name = $1
        `, [name]);

        return result.rows[0];
    }

    async listAuthors(): Promise<Author[] | undefined> {
        const result = await this.pool.query(`
            SELECT id, name, nationality FROM authors
        `);

        return result.rows;
    }

    async updateAuthor(id: string, authorUpdateInput: AuthorUpdateInput): Promise<Author | undefined> {
        const result = await this.pool.query(`
            UPDATE authors
            SET name = $1, nationality = $2
            WHERE id = $3
            RETURNING id, name, nationality
        `, [authorUpdateInput.name, authorUpdateInput.nationality, id]);

        return result.rows[0];
    }

    async deleteAuthor(id: string): Promise<boolean> {
        const result = await this.pool.query(`
            DELETE FROM authors WHERE id = $1
        `, [id]);
        
        console.log(`Deleted ${result.rowCount} author(s) with id: ${id} ${result}`);
        return (result.rowCount ?? 0) > 0;
    }
}