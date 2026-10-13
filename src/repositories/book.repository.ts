import { Pool } from "pg";
import { type Book, type BookInput, type BookUpdateInput } from "../models/book.models.js";

export interface BookRepositoryInterface {
    createBook(bookInput: BookInput): Promise<Book | undefined>;
    getBookById(id: string): Promise<Book | undefined>;
    getBookByTitle(title: string): Promise<Book | undefined>;
    listBooks(): Promise<Book[] | undefined>;
    updateBook(id: string, bookUpdateInput: BookUpdateInput): Promise<Book | undefined>;
    deleteBook(id: string): Promise<boolean>;
}

export class BookRepository implements BookRepositoryInterface {
    constructor(private pool: Pool) {}

    async createBook(bookInput: BookInput): Promise<Book | undefined> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const book = await client.query(`
                INSERT INTO books (title, publication_year, publication_date, genre, available, publisher, page_count)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, title, publication_year AS "publicationYear", publication_date AS "publicationDate", genre, available, publisher, page_count AS "pageCount", created_at AS "createdAt", updated_at AS "updatedAt"
            `, [
                bookInput.title,
                bookInput.publicationYear ?? null,
                bookInput.publicationDate ?? null,
                bookInput.genre ?? null,
                bookInput.available,
                bookInput.publisher,
                bookInput.pageCount ?? null,
            ]);

            const created = book.rows[0];

            if (!created) {
                await client.query('ROLLBACK');
                return undefined;
            }

            for (const authorId of bookInput.authorIds) {
                await client.query(`
                    INSERT INTO book_authors (book_id, author_id)
                    VALUES ($1, $2)
                `, [created.id, authorId]);
            }

            await client.query('COMMIT');

            const bookWithAuthors: Book = {
                ...created,
                authorIds: bookInput.authorIds,
            }

            return bookWithAuthors;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getBookById(id: string): Promise<Book | undefined> {
        const client = await this.pool.connect();
        
        try {
            const bookResult = await client.query(`
                SELECT id, title, publication_year AS "publicationYear", publication_date AS "publicationDate", genre, available, publisher, page_count AS "pageCount", created_at AS "createdAt", updated_at AS "updatedAt"
                FROM books WHERE id = $1
            `, [id]);

            const book = bookResult.rows[0];

            if (!book) {
                return undefined;
            }

            const bookAuthorsResult = await client.query(`
                SELECT author_id FROM book_authors WHERE book_id = $1
            `, [id]);

            const bookWithAuthors: Book = {
                ...book,
                authorIds: bookAuthorsResult.rows.map(row => row.author_id),
            }

            return bookWithAuthors;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async getBookByTitle(title: string): Promise<Book | undefined> {
        const client = await this.pool.connect();

        try {
            const bookResult = await client.query(`
                SELECT id, title, publication_year AS "publicationYear", publication_date AS "publicationDate", genre, available, publisher, page_count AS "pageCount", created_at AS "createdAt", updated_at AS "updatedAt"
                FROM books WHERE title = $1
            `, [title]);

            const book = bookResult.rows[0];

            if (!book) {
                return undefined;
            }

            const bookAuthorsResult = await client.query(`
                SELECT author_id FROM book_authors WHERE book_id = $1
            `, [book.id]);

            const bookWithAuthors: Book = {
                ...book,
                authorIds: bookAuthorsResult.rows.map(row => row.author_id),
            }

            return bookWithAuthors;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async listBooks(): Promise<Book[] | undefined> {
        const client = await this.pool.connect();

        try {
            const booksResult = await client.query(`
                SELECT id, title, publication_year AS "publicationYear", publication_date AS "publicationDate", genre, available, publisher, page_count AS "pageCount", created_at AS "createdAt", updated_at AS "updatedAt"
                FROM books
            `);

            const booksWithAuthors: Book[] = [];

            for (const book of booksResult.rows) {
                const bookAuthorsResult = await client.query(`
                    SELECT author_id FROM book_authors WHERE book_id = $1
                `, [book.id]);

                booksWithAuthors.push({
                    ...book,
                    authorIds: bookAuthorsResult.rows.map(row => row.author_id),
                });
            }

            return booksWithAuthors;
        } catch (error) {
            throw error;
        } finally {
            client.release();
        }
    }

    async updateBook(id: string, bookUpdateInput: BookUpdateInput): Promise<Book | undefined> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            const bookResult = await client.query(`
                UPDATE books SET
                    title = COALESCE($1, title),
                    publication_year = COALESCE($2, publication_year),
                    publication_date = COALESCE($3, publication_date),
                    genre = COALESCE($4, genre),
                    publisher = COALESCE($5, publisher),
                    page_count = COALESCE($6, page_count),
                    updated_at = NOW()
                WHERE id = $7
                RETURNING id, title, publication_year AS "publicationYear", publication_date AS "publicationDate", genre, available, publisher, page_count AS "pageCount", created_at AS "createdAt", updated_at AS "updatedAt"
            `, [
                bookUpdateInput.title ?? null,
                bookUpdateInput.publicationYear ?? null,
                bookUpdateInput.publicationDate ?? null,
                bookUpdateInput.genre ?? null,
                bookUpdateInput.publisher ?? null,
                bookUpdateInput.pageCount ?? null,
                id
            ]);

            const updated = bookResult.rows[0];

            if (!updated) {
                await client.query('ROLLBACK');
                return undefined;
            }

            if (bookUpdateInput.authorIds) {
                await client.query(`
                    DELETE FROM book_authors WHERE book_id = $1
                `, [id]);

                for (const authorId of bookUpdateInput.authorIds) {
                    await client.query(`
                        INSERT INTO book_authors (book_id, author_id)
                        VALUES ($1, $2)
                    `, [id, authorId]);
                }
            }

            const bookAuthorsResult = await client.query(`
                SELECT author_id FROM book_authors WHERE book_id = $1
            `, [id]);

            await client.query('COMMIT');

            const bookWithAuthors: Book = {
                ...updated,
                authorIds: bookAuthorsResult.rows.map(row => row.author_id),
            }

            return bookWithAuthors;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteBook(id: string): Promise<boolean> {
        const client = await this.pool.connect();

        try {
            await client.query('BEGIN');

            await client.query(`
                DELETE FROM book_authors WHERE book_id = $1
            `, [id]);

            const result = await client.query(`
                DELETE FROM books WHERE id = $1
            `, [id]);

            await client.query('COMMIT');

            return (result.rowCount ?? 0) > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
