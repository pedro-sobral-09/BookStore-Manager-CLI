-- Schema do Banco de Dados - Bookstore Manager CLI (PostgreSQL)

CREATE TYPE loan_status AS ENUM ('active', 'returned');

-- Tabela: Clientes
CREATE TABLE customers (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    birth_date DATE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Tabela: Autores
CREATE TABLE authors (
    id UUID PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    nationality VARCHAR(100)
);

-- Tabela: Livros
CREATE TABLE books (
    id UUID PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    publication_year INT,
    publisher VARCHAR(200) NOT NULL,
    publication_date DATE,
    available BOOLEAN NOT NULL,
    genre VARCHAR(100),
    page_count INT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);

-- Tabela: Relação Livros e Autores (N:N)
CREATE TABLE book_authors (
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    PRIMARY KEY (book_id, author_id)
);

-- Tabela: Empréstimos
CREATE TABLE loans (
    id UUID PRIMARY KEY,
    customer_id UUID NOT NULL REFERENCES customers(id),
    book_id UUID NOT NULL REFERENCES books(id),
    loan_date DATE NOT NULL,
    return_date DATE,
    status loan_status NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP
);