// Converte uma data digitada (YYYY-MM-DD) para Date à meia-noite no horário local.
// new Date('YYYY-MM-DD') interpreta como UTC e, em fusos negativos (Brasil), o pg grava o dia anterior.
export function parseDateInput(value: string, fieldName: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${fieldName} is invalid (use YYYY-MM-DD)`);
  }

  const parsedDate = new Date(`${value}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`${fieldName} is invalid (use YYYY-MM-DD)`);
  }

  return parsedDate;
}
