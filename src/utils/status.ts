/**
 * Status helper utilities for the application
 * Provides color and text mappings for various status types
 */

// =============================================================================
// ORDER STATUS HELPERS
// =============================================================================

export type OrderStatus =
  | "PENDING"
  | "COMPLETED"
  | "CANCELLED"
  | "REFUNDED"
  | "FAILED"
  | "PAID"
  | "ERROR";

export type PayingMethod =
  | "BANK_TRANSFER"
  | "CREDIT_CARD"
  | "E_WALLET"
  | "VNPAY";

/**
 * Get Ant Design tag color for order status
 */
export const getOrderStatusColor = (status: OrderStatus): string => {
  const colorMap: Record<OrderStatus, string> = {
    COMPLETED: "success",
    PAID: "success",
    PENDING: "warning",
    CANCELLED: "default",
    FAILED: "error",
    ERROR: "error",
    REFUNDED: "purple",
  };
  return colorMap[status] || "default";
};

/**
 * Get Vietnamese text for order status
 */
export const getOrderStatusText = (status: OrderStatus): string => {
  const textMap: Record<OrderStatus, string> = {
    PENDING: "Đang chờ",
    COMPLETED: "Hoàn thành",
    PAID: "Đã thanh toán",
    CANCELLED: "Đã hủy",
    REFUNDED: "Đã hoàn tiền",
    FAILED: "Thất bại",
    ERROR: "Lỗi",
  };
  return textMap[status] || status;
};

/**
 * Get Vietnamese text for paying method
 */
export const getPayingMethodText = (method: PayingMethod): string => {
  const textMap: Record<PayingMethod, string> = {
    BANK_TRANSFER: "Chuyển khoản",
    CREDIT_CARD: "Thẻ tín dụng",
    E_WALLET: "Ví điện tử",
    VNPAY: "VNPay",
  };
  return textMap[method] || method;
};

// =============================================================================
// USER STATUS HELPERS
// =============================================================================

export type UserRole = "USER" | "ADMIN" | "PUBLISHER" | "MODERATOR";
export type AccountStatus = "NOT_VERIFY" | "VERIFIED" | "BANNED";

/**
 * Get Ant Design tag color for user role
 */
export const getUserRoleColor = (role: UserRole): string => {
  const colorMap: Record<UserRole, string> = {
    ADMIN: "red",
    PUBLISHER: "blue",
    MODERATOR: "purple",
    USER: "default",
  };
  return colorMap[role] || "default";
};

/**
 * Get Vietnamese text for user role
 */
export const getUserRoleText = (role: UserRole): string => {
  const textMap: Record<UserRole, string> = {
    ADMIN: "Quản trị viên",
    PUBLISHER: "Nhà xuất bản",
    MODERATOR: "Kiểm duyệt viên",
    USER: "Người dùng",
  };
  return textMap[role] || role;
};

/**
 * Get Ant Design tag color for account status
 */
export const getAccountStatusColor = (status: AccountStatus): string => {
  const colorMap: Record<AccountStatus, string> = {
    VERIFIED: "success",
    NOT_VERIFY: "warning",
    BANNED: "error",
  };
  return colorMap[status] || "default";
};

/**
 * Get Vietnamese text for account status
 */
export const getAccountStatusText = (status: AccountStatus): string => {
  const textMap: Record<AccountStatus, string> = {
    VERIFIED: "Đã xác thực",
    NOT_VERIFY: "Chưa xác thực",
    BANNED: "Đã khóa",
  };
  return textMap[status] || status;
};

// =============================================================================
// BOOK STATUS HELPERS
// =============================================================================

export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING";
export type ChapterStatus = "PENDING" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * Get Ant Design tag color for book status
 */
export const getBookStatusColor = (status: BookStatus): string => {
  const colorMap: Record<BookStatus, string> = {
    PENDING: "warning",
    DRAFT: "default",
    PUBLISHED: "success",
    ARCHIVED: "error",
  };
  return colorMap[status] || "default";
};

/**
 * Get Vietnamese text for book status
 */
export const getBookStatusText = (status: BookStatus): string => {
  const textMap: Record<BookStatus, string> = {
    PENDING: "Đang chờ",
    DRAFT: "Bản nháp",
    PUBLISHED: "Đã xuất bản",
    ARCHIVED: "Đã lưu trữ",
  };
  return textMap[status] || status;
};

/**
 * Get Ant Design tag color for chapter status
 */
export const getChapterStatusColor = (status: ChapterStatus): string => {
  const colorMap: Record<ChapterStatus, string> = {
    PENDING: "warning",
    DRAFT: "default",
    PUBLISHED: "success",
    ARCHIVED: "error",
  };
  return colorMap[status] || "default";
};

/**
 * Get Vietnamese text for chapter status
 */
export const getChapterStatusText = (status: ChapterStatus): string => {
  const textMap: Record<ChapterStatus, string> = {
    PENDING: "Đang chờ",
    DRAFT: "Bản nháp",
    PUBLISHED: "Đã phát hành",
    ARCHIVED: "Đã lưu trữ",
  };
  return textMap[status] || status;
};

// =============================================================================
// ROLE COLOR CONSTANTS (for charts/pie charts)
// =============================================================================

export const ROLE_COLORS: Record<string, string> = {
  USER: "#4f85d3",
  PUBLISHER: "#52c41a",
  ADMIN: "#faad14",
  MODERATOR: "#eb2f96",
  SUBSCRIBER: "#722ed1",
};

export const ROLE_LABELS: Record<string, string> = {
  USER: "User thường",
  PUBLISHER: "Publisher",
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  SUBSCRIBER: "Subscriber",
};
