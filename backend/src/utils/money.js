export const toPaise = (amount) => Math.round(Number(amount) * 100);
export const fromPaise = (amountPaise) => Number(amountPaise) / 100;

export const formatCurrency = (amountPaise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2
  }).format(fromPaise(amountPaise));
