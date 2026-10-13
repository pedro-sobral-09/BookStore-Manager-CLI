import { pool } from './db/pool.js';
import { AuthorRepository } from './repositories/author.repository.js';
import { AuthorService } from './services/author.service.js';
import { AuthorController } from './controllers/author.controller.js';
import { AuthorMenu } from './menu/author.menu.js';
import { BookRepository } from './repositories/book.repository.js';
import { BookService } from './services/book.service.js';
import { BookController } from './controllers/book.controller.js';
import { BookMenu } from './menu/book.menu.js';
import { CustomerRepository } from './repositories/customer.repository.js';
import { CustomerService } from './services/customer.service.js';
import { CustomerController } from './controllers/customer.controller.js';
import { CustomerMenu } from './menu/customer.menu.js';
import { LoanRepository } from './repositories/loan.repository.js';
import { LoanService } from './services/loan.service.js';
import { LoanController } from './controllers/loan.controller.js';
import { LoanMenu } from './menu/loan.menu.js';
import { ReportRepository } from './repositories/report.repository.js';
import { ReportService } from './services/report.service.js';
import { ReportController } from './controllers/report.controller.js';
import { ReportMenu } from './menu/report.menu.js';

const authorRepository = new AuthorRepository(pool);
const authorService = new AuthorService(authorRepository);
const authorController = new AuthorController(authorService);
const authorMenu = new AuthorMenu(authorController);

const bookRepository = new BookRepository(pool);
const bookService = new BookService(bookRepository, authorRepository);
const bookController = new BookController(bookService);
const bookMenu = new BookMenu(bookController);

const customerRepository = new CustomerRepository(pool);
const customerService = new CustomerService(customerRepository);
const customerController = new CustomerController(customerService);
const customerMenu = new CustomerMenu(customerController);

const loanRepository = new LoanRepository(pool);
const loanService = new LoanService(
  loanRepository,
  bookRepository,
  customerRepository,
);
const loanController = new LoanController(loanService);
const loanMenu = new LoanMenu(loanController);

const reportRepository = new ReportRepository(pool);
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);
const reportMenu = new ReportMenu(reportController);

export { authorMenu, bookMenu, customerMenu, loanMenu, reportMenu };
