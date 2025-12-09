/**
 * Format utilities for the application
 */

/**
 * Format number as Vietnamese currency (VND)
 * @param amount - The amount to format
 * @returns Formatted currency string
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

/**
 * Format number with Vietnamese locale
 * @param num - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("vi-VN").format(num);
};

/**
 * Format number as currency with custom suffix
 * @param amount - The amount to format
 * @param suffix - Currency suffix (default: "đ")
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  suffix: string = "đ"
): string => {
  return `${amount.toLocaleString("vi-VN")}${suffix}`;
};

/**
 * Format date to Vietnamese locale string
 * @param date - Date object or date string
 * @returns Formatted date string (dd/MM/yyyy)
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("vi-VN");
};

/**
 * Format datetime to Vietnamese locale string with time
 * @param date - Date object or date string
 * @returns Formatted datetime string
 */
export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("vi-VN");
};

/**
 * Generate URL-friendly slug from a string
 * @param value - String to convert to slug
 * @returns URL-friendly slug
 */
export const generateSlug = (value: string): string => {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
};
