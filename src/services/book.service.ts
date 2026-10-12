import { type BookRepositoryInterface } from "../repositories/book.repository.js";
import { type AuthorRepositoryInterface } from "../repositories/author.repository.js";
import { type Book, type BookInput, type BookUpdateInput } from "../models/book.models.js";

export interface BookServiceInterface {
    createBook(bookInput: BookInput): Promise<Book>;
    getBookById(id: string): Promise<Book>;
    getBookByTitle(title: string): Promise<Book>;
    listBooks(): Promise<Book[]>;
    updateBook(id: string, bookUpdateInput: BookUpdateInput): Promise<Book>;
    deleteBook(id: string): Promise<boolean>;
}

export class BookService implements BookServiceInterface {
    constructor(private bookRepository: BookRepositoryInterface, private authorRepository: AuthorRepositoryInterface) {}

    async createBook(bookInput: BookInput): Promise<Book> {
        const bookExisting = await this.bookRepository.getBookByTitle(bookInput.title);

        if (bookExisting) {
            throw new Error('Book already exists');
        }

        for (const id of bookInput.authorIds) {
            const author = await this.authorRepository.getAuthorById(id);

            if (!author) {
                throw new Error("Author not found");
            }
        }
        
        const book = await this.bookRepository.createBook(bookInput);

        if (!book) {
            throw new Error('Failed to create book');
        }

        return book;
    }

    async getBookById(id: string): Promise<Book> {
        const book = await this.bookRepository.getBookById(id);

        if (!book) {
            throw new Error('Book not found');
        }

        return book;
    }

    async getBookByTitle(title: string): Promise<Book> {
        const book = await this.bookRepository.getBookByTitle(title);

        if (!book) {
            throw new Error('Book not found');
        }

        return book;
    }

    async listBooks(): Promise<Book[]> {
        const books = await this.bookRepository.listBooks();

        if (!books) {
            throw new Error('Failed to list books');
        }

        return books;
    }

    async updateBook(id: string, bookUpdateInput: BookUpdateInput): Promise<Book> {
        if (bookUpdateInput.title) {
            const bookExisting = await this.bookRepository.getBookByTitle(bookUpdateInput.title);

            if (bookExisting && bookExisting.id !== id) {
                throw new Error('Book with this title already exists');
            }
        }

        if (bookUpdateInput.authorIds) {
            for (const authorId of bookUpdateInput.authorIds) {
                const author = await this.authorRepository.getAuthorById(authorId);

                if (!author) {
                    throw new Error('Author not found');
                }
            }
        }

        const book = await this.bookRepository.updateBook(id, bookUpdateInput);

        if (!book) {
            throw new Error('Failed to update book');
        }

        return book;
    }

    async deleteBook(id: string): Promise<boolean> {
        const book = await this.bookRepository.getBookById(id);

        if (!book) {
            throw new Error('Book not found');
        }

        const deleted = await this.bookRepository.deleteBook(id);

        if (!deleted) {
            throw new Error('Failed to delete book');
        }

        return deleted;
    }
}
