import { pool } from './db/pool.js';
import { CreateAuthorRepository } from './repositories/author.repository.js';
import { CreateAuthorService } from './services/author.service.js';
import { CreateAuthorController } from './controllers/author.controller.js';
import { CreateAuthorMenu } from './menu/author.menu.js';

const authorRepository = new CreateAuthorRepository(pool);
const authorService = new CreateAuthorService(authorRepository);
const authorController = new CreateAuthorController(authorService);
const authorMenu = new CreateAuthorMenu(authorController);

export { authorMenu };