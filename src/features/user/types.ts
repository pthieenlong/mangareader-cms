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

export interface IPublisherOverviewStats {
  totalRevenue: number;
  publishedBookCount: number;
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

export interface IUserFavorite {
  id: string;
  title: string;
  author?: string;
  thumbnail?: string;
  categories: string[];
  purchasedAt?: string;
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
