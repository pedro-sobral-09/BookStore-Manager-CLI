import { pool } from './db/pool.js';
import { AuthorRepository } from './repositories/author.repository.js';
import { AuthorService } from './services/author.service.js';
import { AuthorController } from './controllers/author.controller.js';
import { AuthorMenu } from './menu/author.menu.js';
import { BookRepository } from './repositories/book.repository.js';
import { BookService } from './services/book.service.js';
import { BookController } from './controllers/book.controller.js';
import { BookMenu } from './menu/book.menu.js';

const authorRepository = new AuthorRepository(pool);
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);
const authorMenu = new AuthorMenu(authorController);

const bookRepository = new BookRepository(pool);
const bookService = new BookService(bookRepository, authorRepository);
const bookController = new BookController(bookService);
const bookMenu = new BookMenu(bookController);

export { authorMenu, bookMenu };