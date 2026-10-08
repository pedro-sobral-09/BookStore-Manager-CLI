import { pool } from './db/pool.js';
import { AuthorRepository } from './repositories/author.repository.js';
import { AuthorService } from './services/author.service.js';
import { AuthorController } from './controllers/author.controller.js';
import { AuthorMenu } from './menu/author.menu.js';

const authorRepository = new AuthorRepository(pool);
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);
const authorMenu = new AuthorMenu(authorController);

export { authorMenu };