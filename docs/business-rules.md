# Regras de Negócio

## Customer

- RN-001 — Nome do Customer é obrigatório
- RN-002 — E-mail do Customer é obrigatório
- RN-003 — Telefone do Customer é opcional
- RN-004 — Data de nascimento do Customer é opcional

---

## Author

- RN-005 — Nome do Author é obrigatório
- RN-006 — Nacionalidade do Author é opcional

---

## Book

- RN-007 — Título do Book é obrigatório
- RN-008 — Editora do Book é obrigatória
- RN-009 — Disponibilidade do Book deve ser controlada pelo sistema
- RN-010 — Book indisponível não pode ser emprestado
- RN-011 — Book fica indisponível após empréstimo
- RN-012 — Book fica disponível após devolução
- RN-013 — Informações de publicação do Book são opcionais
- RN-014 — Gênero do Book é opcional
- RN-015 — Quantidade de páginas do Book é opcional

---

## Relação entre Book e Author

- RN-016 — Um Book pode possuir vários Authors
- RN-017 — Um Author pode possuir vários Books
- RN-018 — A associação entre Book e Author deve ser única
- RN-019 — Book e Author devem existir para criar uma associação

---

## Loan

- RN-020 — Loan deve possuir um Customer
- RN-021 — Loan deve possuir um Book
- RN-022 — Data do Loan é obrigatória
- RN-023 — Novo Loan deve iniciar como ativo
- RN-024 — Somente Books disponíveis podem ser emprestados
- RN-025 — Um Book não pode possuir dois Loans ativos
- RN-026 — Somente Loans ativos podem ser devolvidos
- RN-027 — Data de devolução deve ser registrada
- RN-028 — Loan devolvido não pode ser devolvido novamente
- RN-029 — Status do Loan deve mudar após a devolução
- RN-030 — Loan ativo não possui data de devolução
* RN-031 — Loan devolvido deve possuir data de devolução
* RN-032 — Data de devolução não pode ser anterior à data do Loan

---

## Relação entre Customer e Loan

- RN-033 — Customer deve existir antes de realizar um Loan
- RN-034 — Um Customer pode possuir vários Loans

---

## Integridade dos Dados

- RN-035 — Identificadores devem ser únicos
- RN-036 — Data de criação é obrigatória
- RN-037 — Data de atualização deve representar a última alteração

---

## Operações de Loan

- RN-038 — Operação inválida não deve alterar a disponibilidade do Book