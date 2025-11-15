export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
  FAILED = "FAILED",
  PAID = "PAID",
  ERROR = "ERROR",
}

export enum PayingMethod {
  BANK_TRANSFER = "BANK_TRANSFER",
  CREDIT_CARD = "CREDIT_CARD",
  E_WALLET = "E_WALLET",
}

export interface IOrderItem {
  id: string;
  ordersId: string;
  bookId?: string | null;
  chapterId?: string | null;
  defaultPrice: number;
  discountPrice: number;
  isRead: boolean;
  createdAt?: string;
}

export interface IOrder {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  payingMethod: PayingMethod;
  paidAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  orderItems?: IOrderItem[];
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface IOrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  payingMethod?: PayingMethod;
  sortBy?: "createdAt" | "totalAmount";
  sortOrder?: "asc" | "desc";
  search?: string;
}

