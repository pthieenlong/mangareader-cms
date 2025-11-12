// Utility functions
// This file can be used for general utility functions

export function formatCurrency(amount: number, currency: string = "đ"): string {
  return `${amount.toLocaleString("vi-VN")}${currency}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN");
}
