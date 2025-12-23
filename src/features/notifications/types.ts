export interface INotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: NotificationType;
  isRead: boolean;
  relatedItemType?: string | null;
  relatedItemId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | "NEW_BOOK"
  | "NEW_CHAPTER"
  | "NEW_COMMENT"
  | "NEW_REVIEW"
  | "NEW_ORDER"
  | "ORDER_CANCELLED"
  | "NEW_SUBSCRIPTION"
  | "SUBSCRIPTION_RENEWED"
  | "PUBLISHER_APPLICATION"
  | "SYSTEM";

export interface INotificationFilter {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
