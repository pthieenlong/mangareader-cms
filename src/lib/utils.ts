// Utility functions
// This file can be used for general utility functions

export function formatCurrency(amount: number, currency: string = "đ"): string {
  return `${amount.toLocaleString("vi-VN")}${currency}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN");
}

export function generateSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
