// Format utilities
export {
  formatVND,
  formatNumber,
  formatCurrency,
  formatDate,
  formatDateTime,
  generateSlug,
} from "./format";

// Status utilities
export {
  // Order status
  getOrderStatusColor,
  getOrderStatusText,
  getPayingMethodText,
  // User status
  getUserRoleColor,
  getUserRoleText,
  getAccountStatusColor,
  getAccountStatusText,
  // Book status
  getBookStatusColor,
  getBookStatusText,
  getChapterStatusColor,
  getChapterStatusText,
  // Role colors for charts
  ROLE_COLORS,
  ROLE_LABELS,
} from "./status";

// Status types (re-export for convenience)
export type {
  OrderStatus,
  PayingMethod,
  UserRole,
  AccountStatus,
  BookStatus,
  ChapterStatus,
} from "./status";

// Constants
export {
  FALLBACK_IMAGE,
  SEARCH_DEBOUNCE_DELAY,
  DEFAULT_PAGINATION,
} from "./constants";
