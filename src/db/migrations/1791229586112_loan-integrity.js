/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // RN-025: um Book não pode possuir dois Loans ativos (garantido pelo banco, mesmo com concorrência)
  pgm.createIndex('loans', 'book_id', {
    name: 'one_active_loan_per_book',
    unique: true,
    where: "status = 'active'",
  });

  // RN-030 e RN-031: Loan ativo não tem data de devolução; Loan devolvido tem
  pgm.addConstraint('loans', 'loans_return_date_matches_status', {
    check:
      "(status = 'active' AND return_date IS NULL) OR (status = 'returned' AND return_date IS NOT NULL)",
  });

  // RN-032: data de devolução não pode ser anterior à data do Loan
  pgm.addConstraint('loans', 'loans_return_date_after_loan_date', {
    check: 'return_date IS NULL OR return_date >= loan_date',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropConstraint('loans', 'loans_return_date_after_loan_date');
  pgm.dropConstraint('loans', 'loans_return_date_matches_status');
  pgm.dropIndex('loans', 'book_id', { name: 'one_active_loan_per_book' });
};
