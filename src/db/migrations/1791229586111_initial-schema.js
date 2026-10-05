/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // Criação do tipo ENUM para status do empréstimo
  pgm.createType('loan_status', ['active', 'returned']);

  // Tabela: customers
  pgm.createTable('customers', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(150)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    phone: {
      type: 'varchar(20)',
    },
    birth_date: {
      type: 'date',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
    },
  });

  // Tabela: authors
  pgm.createTable('authors', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    name: {
      type: 'varchar(150)',
      notNull: true,
    },
    nationality: {
      type: 'varchar(100)',
    },
  });

  // Tabela: books
  pgm.createTable('books', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    title: {
      type: 'varchar(200)',
      notNull: true,
    },
    publication_year: {
      type: 'integer',
    },
    publisher: {
      type: 'varchar(200)',
      notNull: true,
    },
    publication_date: {
      type: 'date',
    },
    available: {
      type: 'boolean',
      notNull: true,
      default: true,
    },
    genre: {
      type: 'varchar(100)',
    },
    page_count: {
      type: 'integer',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
    },
  });

  // Tabela: book_authors (Relação N:N entre Books e Authors)
  pgm.createTable(
    'book_authors',
    {
      book_id: {
        type: 'uuid',
        notNull: true,
        references: 'books',
        onDelete: 'CASCADE',
      },
      author_id: {
        type: 'uuid',
        notNull: true,
        references: 'authors',
        onDelete: 'CASCADE',
      },
    },
    {
      constraints: {
        primaryKey: ['book_id', 'author_id'],
      },
    }
  );

  // Tabela: loans
  pgm.createTable('loans', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    customer_id: {
      type: 'uuid',
      notNull: true,
      references: 'customers',
    },
    book_id: {
      type: 'uuid',
      notNull: true,
      references: 'books',
    },
    loan_date: {
      type: 'date',
      notNull: true,
      default: pgm.func('current_date'),
    },
    return_date: {
      type: 'date',
    },
    status: {
      type: 'loan_status',
      notNull: true,
      default: 'active',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Ordem reversa para respeitar as chaves estrangeiras
  pgm.dropTable('loans');
  pgm.dropTable('book_authors');
  pgm.dropTable('books');
  pgm.dropTable('authors');
  pgm.dropTable('customers');
  pgm.dropType('loan_status');
};