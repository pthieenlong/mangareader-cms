/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import { userService } from "./user.service";
import {
  AccountStatus,
  UserRole,
  type IPublisherBook,
  type IPublisherOverviewStats,
  type IUserFavorite,
  type IUserOrderHistory,
  type IUserProfileDetail,
  type IUserProfileUpdatePayload,
} from "../types";
import { OrderStatus, PayingMethod } from "@/features/order/types";

const isValidRole = (value: unknown): value is UserRole =>
  Object.values(UserRole).includes(value as UserRole);

const isValidAccountStatus = (value: unknown): value is AccountStatus =>
  Object.values(AccountStatus).includes(value as AccountStatus);

const isValidOrderStatus = (value: unknown): value is OrderStatus =>
  Object.values(OrderStatus).includes(value as OrderStatus);

const isValidPayingMethod = (value: unknown): value is PayingMethod =>
  Object.values(PayingMethod).includes(value as PayingMethod);

const normalizeRole = (role: unknown): UserRole =>
  isValidRole(role) ? role : UserRole.USER;

const normalizeAccountStatus = (status: unknown): AccountStatus =>
  isValidAccountStatus(status) ? status : AccountStatus.NOT_VERIFY;

const normalizeOrderStatus = (status: unknown): OrderStatus =>
  isValidOrderStatus(status) ? status : OrderStatus.PENDING;

const normalizePayingMethod = (method: unknown): PayingMethod =>
  isValidPayingMethod(method) ? method : PayingMethod.BANK_TRANSFER;

const mapUserProfile = (raw: any): IUserProfileDetail => ({
  id: raw?.id ?? "",
  username: raw?.username ?? "",
  email: raw?.email ?? "",
  role: normalizeRole(raw?.role ?? raw?.userRole),
  accountStatus: normalizeAccountStatus(raw?.accountStatus ?? raw?.status),
  activeDevices: raw?.activeDevices ?? 0,
  avatar: raw?.avatar ?? raw?.profileImage ?? undefined,
  createdAt: raw?.createdAt,
  updatedAt: raw?.updatedAt,
});

const mapOrderHistory = (raw: any): IUserOrderHistory => {
  const fallbackId =
    raw?.id ??
    raw?.orderId ??
    raw?.code ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id: String(fallbackId),
    code: String(raw?.code ?? raw?.id ?? fallbackId),
    createdAt: raw?.createdAt ?? raw?.paidAt ?? new Date().toISOString(),
    status: normalizeOrderStatus(raw?.status),
    totalAmount: Number(raw?.totalAmount ?? raw?.defaultPrice ?? 0),
    payingMethod: normalizePayingMethod(raw?.payingMethod),
  };
};

const mapFavorite = (raw: any): IUserFavorite => {
  const book = raw?.book ?? {};
  const baseCategories =
    raw?.categories ??
    book?.categories?.map?.((category: any) => category?.title) ??
    [];
  return {
    id: String(raw?.id ?? raw?.bookId ?? book?.id ?? Math.random()),
    title: raw?.title ?? book?.title ?? "Không xác định",
    author: raw?.author ?? book?.author,
    thumbnail: raw?.thumbnail ?? book?.thumbnail,
    categories: Array.isArray(baseCategories) ? baseCategories : [],
    purchasedAt: raw?.purchasedAt ?? raw?.createdAt ?? book?.createdAt,
  };
};

const mapPublisherBook = (raw: any): IPublisherBook => {
  const baseCategories =
    raw?.categories?.map?.((category: any) => category?.title ?? category) ??
    raw?.bookCategories?.map?.(
      (relation: any) => relation?.category?.title ?? relation?.category
    ) ??
    [];
  return {
    id: String(raw?.id ?? Math.random()),
    title: raw?.title ?? "Không xác định",
    author: raw?.author ?? "",
    thumbnail: raw?.thumbnail ?? undefined,
    categories: Array.isArray(baseCategories) ? baseCategories : [],
    status: raw?.status ?? "DRAFT",
    createdAt: raw?.createdAt,
    view: raw?.view ?? 0,
    likeCount: raw?.likeCount ?? 0,
  };
};

const handleResponseData = (response: CustomResponse, fallback: string) => {
  if (!response.success) {
    throw new Error(response.message || fallback);
  }
  return response.data;
};

export const userProfileService = {
  async getUserProfile(id: string): Promise<IUserProfileDetail> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải thông tin người dùng."
    );
    return mapUserProfile(data);
  },

  async getUserOrders(id: string): Promise<IUserOrderHistory[]> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}/purchased`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải đơn hàng của người dùng."
    );
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map(mapOrderHistory);
  },

  async getUserFavorites(id: string): Promise<IUserFavorite[]> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}/favorite`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải danh sách yêu thích của người dùng."
    );
    const list = Array.isArray(data) ? data : data?.items ?? [];
    return list.map(mapFavorite);
  },

  async updateUserProfile(
    id: string,
    payload: IUserProfileUpdatePayload
  ): Promise<IUserProfileDetail> {
    const response = await userService.updateUser(id, {
      username: payload.username,
      avatar: payload.avatar,
    });

    if (!response.success) {
      throw new Error(response.message || "Cập nhật thông tin thất bại.");
    }

    return this.getUserProfile(id);
  },

  async updateAvatar(id: string, avatar: File): Promise<IUserProfileDetail> {
    const response = await userService.updateUser(id, {
      avatar,
    });

    if (!response.success) {
      throw new Error(response.message || "Cập nhật avatar thất bại.");
    }

    return this.getUserProfile(id);
  },

  async banUser(id: string): Promise<IUserProfileDetail> {
    const response = await userService.banUser(id);

    if (!response.success) {
      throw new Error(response.message || "Không thể ban người dùng.");
    }

    return this.getUserProfile(id);
  },

  async unbanUser(id: string): Promise<IUserProfileDetail> {
    const response = await userService.unbanUser(id);

    if (!response.success) {
      throw new Error(response.message || "Không thể unban người dùng.");
    }

    return this.getUserProfile(id);
  },

  async getPublisherBooks(id: string): Promise<IPublisherBook[]> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/publishers/${id}/books`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải danh sách truyện của publisher."
    );
    const list = Array.isArray(data) ? data : data?.items ?? data?.books ?? [];
    return list.map(mapPublisherBook);
  },

  async getPublisherStats(id: string): Promise<IPublisherOverviewStats> {
    // Calculate from books (since dashboard endpoint is for current publisher only)
    const books = await this.getPublisherBooks(id);
    const publishedBooks = books.filter(
      (book) => book.status === "PUBLISHED"
    );

    // Try to get revenue from revenue endpoint (may not work in admin context)
    let totalRevenue = 0;
    try {
      // Note: This endpoint might require publisher auth, so it may fail in admin context
      // In that case, revenue will be 0
      const revenueResponse = await axiosInstance.get<CustomResponse>(
        `/publisher/revenue`
      );
      const revenueData = handleResponseData(
        revenueResponse.data,
        "Không thể tải doanh thu."
      );
      totalRevenue = Number(revenueData?.totalRevenue ?? revenueData?.total ?? 0);
    } catch (error) {
      // Revenue endpoint may not be accessible in admin context
      // This is expected, so we just set revenue to 0
      console.warn("Could not fetch revenue (may require publisher auth)", error);
    }

    return {
      totalRevenue,
      publishedBookCount: publishedBooks.length,
    };
  },
};
