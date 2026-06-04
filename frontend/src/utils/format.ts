export const formatInr = (amountPaise = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amountPaise / 100);

export const formatDate = (date?: string | null) => {
  if (!date) return '-';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const paiseToRupees = (amountPaise = 0) => amountPaise / 100;

export const toDateTimeIso = (date: string) => new Date(`${date}T00:00:00`).toISOString();
