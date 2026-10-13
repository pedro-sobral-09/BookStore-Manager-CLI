# 📚 BookStore Manager CLI

A terminal-based bookstore management application built with **Node.js**, **TypeScript**, and **PostgreSQL**. It allows full management of authors, books, customers, and loans, along with relational SQL reports.

---

## 🛠️ Tech Stack

- **Runtime & Language**: Node.js, TypeScript
- **Database**: PostgreSQL
- **Database Driver**: `pg` (node-postgres)
- **Migrations**: `node-pg-migrate`
- **Development & Config**: `tsx`, `dotenv`

---

## 🏛️ Architecture

Built with a **Layered Architecture** to separate concerns:

```
Terminal ──> Menu ──> Controller ──> Service ──> Repository ──> PostgreSQL
```

- **Menu**: Interactive CLI navigation loops using Node.js readline.
- **Controller**: Manages user input, presentation, and data formatting.
- **Service**: Executes business rules, validations, and domain logic.
- **Repository**: Handles direct SQL queries, transactions, and data persistence.
- **Models**: Defines TypeScript interfaces and data transfer objects.
- **Container**: Wires dependencies together via dependency injection.

---

## 🗄️ Database Model

```
AUTHORS (id, name, nationality)
   │
   └──< N:M >── BOOK_AUTHORS (book_id, author_id)
                     │
                   BOOKS (id, title, publisher, publication_year, available, ...)
                     │
                     └──< 1:N >── LOANS (id, customer_id, book_id, loan_date, return_date, status)
                                    │
CUSTOMERS (id, name, email, phone) ─┘ 1:N
```

### Key Constraints:

- **`loan_status`**: ENUM (`active`, `returned`).
- **Partial Unique Index**: Only one active loan per book at any given time.
- **Check Constraints**: Active loans must not have a return date; returned loans must have a return date on or after the loan date.
- **Atomic Availability**: Book availability updates automatically within database transactions on loan actions.

---

## ✨ Features

- **Authors**: Create, search (by ID/Name), list, update, and delete (blocked if linked to books).
- **Books**: Create with multiple authors (N:N), search (by ID/Title), list, update, and delete.
- **Customers**: Create with email validation, search (by ID/Email), list, update, and delete.
- **Loans**: Borrow books (sets book unavailable), list (all or filtered by status), update, return (restores availability), and delete.
- **Reports**:
  - Library Summary (totals of books, customers, authors, active/returned loans)
  - Most Borrowed Books (`INNER JOIN`, `GROUP BY`, `ORDER BY DESC`, configurable limit)
  - Customers with Most Loans (aggregated with loan status breakdown)
  - Loans by Period (date range aggregation)

---

## 📂 Project Structure

```
src/
├── controllers/      # CLI input prompts & response formatting
├── db/               # PostgreSQL pool connection, migrations & schema.sql
├── menu/             # Interactive terminal menus
├── models/           # TypeScript interfaces & types
├── repositories/     # Data access layer (SQL queries & transactions)
├── services/         # Business logic & validations
├── utils/            # Readline interface and date parser
├── container.ts      # Dependency injection setup
└── main.ts           # Application entry point
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js** (v18+)
- **PostgreSQL** (v14+)

### 2. Installation & Setup

Clone the repository and install dependencies:

```bash
git clone https://github.com/pedro-sobral-09/BookStore-Manager-CLI.git
cd BookStore-Manager-CLI
npm install
```

Configure your environment file:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/bookstore_manager_cli?schema=public"
```

### 3. Database Migrations

Run database migrations to initialize the schema:

```bash
npm run migrate:up
```

> Alternatively, run `src/db/schema.sql` directly into your PostgreSQL database.

---

## 💻 Running the App

```bash
# Development mode
npm run dev

# Build and start in production
npm run build
npm start
```

---

## 📖 CLI Menus

When launched, the interactive main menu provides the following options:

1. **Author Menu**: Manage authors (CRUD and search).
2. **Book Menu**: Manage books and author associations.
3. **Customer Menu**: Manage customer profiles and email lookups.
4. **Loan Menu**: Register loans, return books, and view loan history.
5. **Report Menu**: Run library statistics and analytical reports.
6. **Exit**: Terminate the CLI application.

---

## 🔀 Git Workflow

Developed following **GitFlow** and **Semantic Commits**:

- `main`: Production-ready code.
- `develop`: Development integration branch.
- `feat/*`: Feature branches (`feat/authors`, `feat/books`, `feat/customers`, `feat/loans`, `feat/reports`).
- `docs/*` & `chore/*`: Documentation and project maintenance branches.

---

## 👤 Author

- **Pedro Sobral** — [GitHub](https://github.com/pedro-sobral-09)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
