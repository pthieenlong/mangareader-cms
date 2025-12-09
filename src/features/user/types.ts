import type { OrderStatus, PayingMethod } from "@/features/order/types";

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  PUBLISHER = "PUBLISHER",
  MODERATOR = "MODERATOR",
}

export enum AccountStatus {
  NOT_VERIFY = "NOT_VERIFY",
  VERIFIED = "VERIFIED",
  BANNED = "BANNED",
}

export interface IUser {
  id: string;
  role: UserRole;
  username: string;
  email: string;
  avatar?: string | null;
  accountStatus: AccountStatus;
  activeDevices: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  googleID?: string | null;
  facebookID?: string | null;
  provider?: string | null;
}

export interface IUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: AccountStatus;
}

export interface IUserOverviewStats {
  totalSpend: number;
  purchasedCount: number;
  favoriteCount: number;
  readingCount: number;
}

export interface IUserStatistics {
  totalSpent: number;
  purchaseCount: number;
  favoriteCount: number;
  readingHistoryCount: number;
}

export interface IPublisherOverviewStats {
  totalRevenue: number;
  totalBooks: number;
  totalOrders: number;
  publishedBookCount?: number;
}

export interface IUserProfileDetail extends IUser {
  phoneNumber?: string;
  address?: string;
  bio?: string;
  lastActive?: string;
  readingCount?: number;
}

export interface IUserOrderHistory {
  id: string;
  code: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  payingMethod: PayingMethod;
}

export interface IUserPurchasedOrderItem {
  id: string;
  bookId: string;
  bookTitle?: string;
  defaultPrice: number;
  discountPrice: number;
  book: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
    author?: string;
  };
}

export interface IUserPurchasedOrder {
  id: string;
  orderCode: string;
  userId: string;
  userName?: string;
  totalAmount: number;
  status: OrderStatus;
  payingMethod: PayingMethod;
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  orderItems: IUserPurchasedOrderItem[];
}

export interface IUserPurchasedOrdersResponse {
  orders: IUserPurchasedOrder[];
  totalOrders: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type PurchasedOrderSortBy = "totalAmount" | "createdAt";
export type SortOrder = "asc" | "desc";

export interface IUserPurchasedOrdersParams {
  page?: number;
  limit?: number;
  sortBy?: PurchasedOrderSortBy;
  sortOrder?: SortOrder;
}

export interface IPublisherOrdersParams {
  page?: number;
  limit?: number;
}

export interface IUserFavorite {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string;
  categories: string[];
  purchasedAt?: string;
}

export interface IUserFavoriteBook {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string;
  author?: string;
  price: number;
  publisherId: string;
  isFree: boolean;
  bookCategories: Array<{
    category: {
      title: string;
    };
  }>;
}

export interface IUserFavoriteBookResponse {
  favorites: Array<{
    book: IUserFavoriteBook;
  }>;
}

export interface IPublisherBook {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string;
  categories: string[];
  status: string;
  createdAt?: string;
  view?: number;
  likeCount?: number;
}

export interface IUserProfileUpdatePayload {
  username?: string;
  phoneNumber?: string;
  address?: string;
  bio?: string;
  avatar?: File;
}
