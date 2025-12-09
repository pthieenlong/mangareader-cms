/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import { userService } from "./user.service";
import {
  AccountStatus,
  UserRole,
  type IPublisherBook,
  type IPublisherOrdersParams,
  type IPublisherOverviewStats,
  type IUserFavorite,
  type IUserFavoriteBook,
  type IUserOrderHistory,
  type IUserProfileDetail,
  type IUserProfileUpdatePayload,
  type IUserPurchasedOrder,
  type IUserPurchasedOrdersParams,
  type IUserPurchasedOrdersResponse,
  type IUserStatistics,
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
    book?.bookCategories?.map?.(
      (relation: any) => relation?.category?.title ?? relation?.category
    ) ??
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

const mapFavoriteBook = (raw: any): IUserFavoriteBook => {
  const book = raw?.book ?? raw;
  return {
    id: String(book?.id ?? ""),
    title: book?.title ?? "Không xác định",
    slug: book?.slug ?? "",
    thumbnail: book?.thumbnail,
    author: book?.author,
    price: Number(book?.price ?? 0),
    publisherId: String(book?.publisherId ?? ""),
    isFree: Boolean(book?.isFree ?? false),
    bookCategories: Array.isArray(book?.bookCategories)
      ? book.bookCategories
      : [],
  };
};

const mapPurchasedOrder = (raw: any): IUserPurchasedOrder => {
  const orderItems = Array.isArray(raw?.orderItems)
    ? raw.orderItems.map((item: any) => ({
        id: String(item?.id ?? ""),
        bookId: String(item?.bookId ?? ""),
        bookTitle: item?.bookTitle ?? item?.book?.title,
        defaultPrice: Number(item?.defaultPrice ?? 0),
        discountPrice: Number(item?.discountPrice ?? 0),
        book: {
          id: String(item?.book?.id ?? item?.bookId ?? ""),
          title: String(item?.book?.title ?? item?.bookTitle ?? ""),
          slug: String(item?.book?.slug ?? ""),
          thumbnail: item?.book?.thumbnail,
          author: item?.book?.author,
        },
      }))
    : [];

  return {
    id: String(raw?.id ?? ""),
    orderCode: String(raw?.orderCode ?? ""),
    userId: String(raw?.userId ?? ""),
    userName: raw?.userName,
    totalAmount: Number(raw?.totalAmount ?? 0),
    status: normalizeOrderStatus(raw?.status),
    payingMethod: normalizePayingMethod(raw?.payingMethod),
    createdAt:
      raw?.createdAt ??
      raw?.paidAt ??
      raw?.updatedAt ??
      new Date().toISOString(),
    updatedAt: raw?.updatedAt ?? raw?.paidAt ?? new Date().toISOString(),
    paidAt: raw?.paidAt,
    orderItems,
  };
};

const mapPublisherOrder = (raw: any): IUserPurchasedOrder => {
  const fallbackId =
    raw?.id ??
    raw?.orderId ??
    raw?.code ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return mapPurchasedOrder({
    ...raw,
    id: fallbackId,
    orderCode: raw?.orderCode ?? fallbackId,
    orderItems: raw?.orderItems ?? [],
  });
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

  async getUserStatistics(id: string): Promise<IUserStatistics> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}/statistic`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải thống kê người dùng."
    );
    return {
      totalSpent: Number(data?.totalSpent ?? 0),
      purchaseCount: Number(data?.purchaseCount ?? 0),
      favoriteCount: Number(data?.favoriteCount ?? 0),
      readingHistoryCount: Number(data?.readingHistoryCount ?? 0),
    };
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

  async getUserPurchasedOrders(
    id: string,
    params?: IUserPurchasedOrdersParams
  ): Promise<IUserPurchasedOrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", String(params.page));
    }
    if (params?.sortBy) {
      queryParams.append("sortBy", params.sortBy);
    }
    if (params?.sortOrder) {
      queryParams.append("sortOrder", params.sortOrder);
    }

    const queryString = queryParams.toString();
    const url = `/admin/user/${id}/purchased${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await axiosInstance.get<CustomResponse>(url);
    const data = handleResponseData(
      response.data,
      "Không thể tải đơn hàng của người dùng."
    );

    return {
      orders: Array.isArray(data?.orders)
        ? data.orders.map(mapPurchasedOrder)
        : [],
      totalOrders: Number(data?.totalOrders ?? 0),
      pagination: {
        page: Number(data?.pagination?.page ?? params?.page ?? 1),
        limit: Number(data?.pagination?.limit ?? 10),
        totalPages: Number(data?.pagination?.totalPages ?? 1),
      },
    };
  },

  async getPublisherRevenueStats(id: string): Promise<IPublisherOverviewStats> {
    const response = await axiosInstance.get(
      `/admin/user/${id}/publisher/revenue`
    );
    const payload =
      response.data?.data?.data ??
      response.data?.data ??
      response.data?.payload ??
      response.data;

    if (!payload) {
      throw new Error("Không thể tải doanh thu publisher.");
    }

    return {
      totalRevenue: Number(payload.totalRevenue ?? 0),
      totalBooks: Number(payload.totalBooks ?? payload.publishedBookCount ?? 0),
      totalOrders: Number(payload.totalOrders ?? 0),
      publishedBookCount: Number(
        payload.publishedBookCount ?? payload.totalBooks ?? 0
      ),
    };
  },

  async getPublisherOrders(
    id: string,
    params?: IPublisherOrdersParams
  ): Promise<IUserPurchasedOrdersResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append("page", String(params.page));
    }
    if (params?.limit) {
      queryParams.append("limit", String(params.limit));
    }

    const queryString = queryParams.toString();
    const url = `/admin/user/${id}/publisher/orders${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await axiosInstance.get(url);
    const payload =
      response.data?.data?.data ??
      response.data?.data ??
      response.data?.payload ??
      response.data;

    const ordersData = Array.isArray(payload?.orders) ? payload.orders : [];
    const pagination = payload?.pagination ?? {};

    return {
      orders: ordersData.map(mapPublisherOrder),
      totalOrders: Number(pagination?.total ?? ordersData.length ?? 0),
      pagination: {
        page: Number(pagination?.page ?? params?.page ?? 1),
        limit: Number(pagination?.limit ?? params?.limit ?? 10),
        totalPages: Number(pagination?.totalPages ?? 1),
      },
    };
  },

  async getUserFavorites(id: string): Promise<IUserFavorite[]> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}/favorite`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải danh sách yêu thích của người dùng."
    );
    // Handle new API response format: data is array of { favorites: [...] }
    if (Array.isArray(data)) {
      // Check if it's the new format with favorites array
      const favoritesArray = data.find((item: any) => item?.favorites);
      if (favoritesArray?.favorites) {
        return favoritesArray.favorites.map((item: any) => mapFavorite(item));
      }
      // Old format: array of favorites directly
      return data.map(mapFavorite);
    }
    // Handle object with favorites array
    if (data?.favorites && Array.isArray(data.favorites)) {
      return data.favorites.map((item: any) => mapFavorite(item));
    }
    // Fallback to old format
    const list = data?.items ?? [];
    return list.map(mapFavorite);
  },

  async getUserFavoriteBooks(id: string): Promise<IUserFavoriteBook[]> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}/favorite`
    );
    const data = handleResponseData(
      response.data,
      "Không thể tải danh sách yêu thích của người dùng."
    );
    // Handle new API response format: data is array of { favorites: [...] }
    if (Array.isArray(data)) {
      // Check if it's the new format with favorites array
      const favoritesArray = data.find((item: any) => item?.favorites);
      if (favoritesArray?.favorites) {
        return favoritesArray.favorites.map((item: any) =>
          mapFavoriteBook(item)
        );
      }
      // Old format: array of favorites directly
      return data.map((item: any) => mapFavoriteBook(item));
    }
    // Handle object with favorites array
    if (data?.favorites && Array.isArray(data.favorites)) {
      return data.favorites.map((item: any) => mapFavoriteBook(item));
    }
    // Fallback
    return [];
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
    const stats = await this.getPublisherRevenueStats(id);

    // Fallback: if API does not provide book count, derive from published books
    if (!stats.totalBooks) {
      const books = await this.getPublisherBooks(id);
      const publishedBooks = books.filter(
        (book) => book.status === "PUBLISHED"
      );
      return {
        ...stats,
        totalBooks: publishedBooks.length,
        publishedBookCount: publishedBooks.length,
      };
    }

    return stats;
  },
};
