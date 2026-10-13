import { type BookUpdateInput, type BookInput  } from '../models/book.models.js';
import { type BookServiceInterface } from '../services/book.service.js';
import { rl } from '../utils/readline.js';

export interface BookControllerInterface {
    createBook(): Promise<void>;
    getBookById(): Promise<void>;
    getBookByTitle(): Promise<void>;
    listBooks(): Promise<void>;
    updateBook(): Promise<void>;
    deleteBook(): Promise<void>;
}

export class BookController implements BookControllerInterface {
    constructor(private bookService: BookServiceInterface) {}

    async createBook(): Promise<void> {
        try {
            const title = await rl.question('Enter book title: ');
            const publisher = await rl.question('Enter book publisher: ');
            const publicationYear = await rl.question('Enter publication year: ');
            const publicationDate = await rl.question('Enter publication date (YYYY-MM-DD): ');
            const genre = await rl.question('Enter genre: ');
            const available = await rl.question('Is the book available? (true/false): ');
            const pageCount = await rl.question('Enter page count: ');
            let authorIds: string[] = [];
            let continueLoop = 'y';
            do {
                const authorId = await rl.question('Enter author ID: ');
                if (!authorId) {
                    throw new Error('Author ID is required');
                }
                authorIds.push(authorId);
                continueLoop = await rl.question('Do you want to add another author? (y/n): ');
            } while (continueLoop === 'y');

            if (!title || title.trim() === '') {
                throw new Error('Book title is required');
            }

            if (!publisher || publisher.trim() === '') {
                throw new Error('Book publisher is required');
            }

            let bookInput: BookInput = {
                title,
                publisher,
                available: available.toLowerCase() !== 'false',
                authorIds: authorIds,
            };

            if (publicationYear) {
                bookInput.publicationYear = Number(publicationYear);
            }
            if (publicationDate) {
                bookInput.publicationDate = new Date(publicationDate);
            }
            if (genre) {
                bookInput.genre = genre;
            }
            if (pageCount) {
                bookInput.pageCount = Number(pageCount);
            }
            
            const book = await this.bookService.createBook(bookInput);

            console.log('Book created:', book);

            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async getBookById(): Promise<void> {
        try {
            const id = await rl.question('Enter book ID: ');

            if (!id) {
                throw new Error('Book ID is required');
            }

            const book = await this.bookService.getBookById(id);

            console.log('Book found:', book);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async getBookByTitle(): Promise<void> {
        try {
            const title = await rl.question('Enter book title: ');

            if (!title || title.trim() === '') {
                throw new Error('Book title is required');
            }

            const book = await this.bookService.getBookByTitle(title);

            console.log('Book found:', book);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async listBooks(): Promise<void> {
        try {
            const books = await this.bookService.listBooks();

            console.log('Books:', books);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async updateBook(): Promise<void> {
        try {
            const updateId = await rl.question('Enter book ID: ');

            if (!updateId) {
                throw new Error('Book ID is required');
            }

            const updateTitle = await rl.question('Enter new book title (leave blank to keep current): ');
            const updatePublisher = await rl.question('Enter new publisher (leave blank to keep current): ');
            const updatePublicationYear = await rl.question('Enter new publication year (leave blank to keep current): ');
            const updatePublicationDate = await rl.question('Enter new publication date YYYY-MM-DD (leave blank to keep current): ');
            const updateGenre = await rl.question('Enter new genre (leave blank to keep current): ');
            const updatePageCount = await rl.question('Enter new page count (leave blank to keep current): ');
            const updateAuthorIds = await rl.question('Enter new author IDs comma-separated (leave blank to keep current): ');

            const bookUpdateInput: BookUpdateInput = {};

            if (updateTitle) {
                bookUpdateInput.title = updateTitle;
            }

            if (updatePublisher) {
                bookUpdateInput.publisher = updatePublisher;
            }

            if (updatePublicationYear) {
                bookUpdateInput.publicationYear = Number(updatePublicationYear);
            }

            if (updatePublicationDate) {
                bookUpdateInput.publicationDate = new Date(updatePublicationDate);
            }

            if (updateGenre) {
                bookUpdateInput.genre = updateGenre;
            }

            if (updatePageCount) {
                bookUpdateInput.pageCount = Number(updatePageCount);
            }

            if (updateAuthorIds) {
                bookUpdateInput.authorIds = updateAuthorIds.split(',').map((id) => id.trim()).filter(Boolean);
            }

            const updatedBook = await this.bookService.updateBook(updateId, bookUpdateInput);

            console.log('Book updated:', updatedBook);
            await rl.question('Press Enter to continue.');
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                await rl.question('Press Enter to continue.');
            }
        }
    }

    async deleteBook(): Promise<void> {
        try {
            const deleteId = await rl.question('Enter book ID: ');

            if (!deleteId) {
                throw new Error('Book ID is required');
            }

            const success = await this.bookService.deleteBook(deleteId);

            if (success) {
                console.log('Book deleted successfully.');
                await rl.question('Press Enter to continue.');
            } else {
                console.log('Failed to delete book.');
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
