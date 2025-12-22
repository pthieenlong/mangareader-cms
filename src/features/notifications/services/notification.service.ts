import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { INotificationFilter } from "../types";

export const notificationService = {
  async getNotifications(
    filters?: INotificationFilter
  ): Promise<CustomResponse> {
    const params = new URLSearchParams();
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.isRead !== undefined)
      params.append("isRead", filters.isRead.toString());
    if (filters?.type) params.append("type", filters.type);
    if (filters?.sortBy) params.append("sortBy", filters.sortBy);
    if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

    const response = await axiosInstance.get<CustomResponse>(
      `/notifications?${params.toString()}`
    );
    return response.data;
  },

  async getUnreadCount(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/notifications/unread-count"
    );
    return response.data;
  },

  async markAsRead(notificationId: string): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  async markAllAsRead(): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      "/notifications/read-all"
    );
    return response.data;
  },

  async deleteNotification(notificationId: string): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(
      `/notifications/${notificationId}`
    );
    return response.data;
  },
};
