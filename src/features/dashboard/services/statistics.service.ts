import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";

export type StatisticsPeriod = "today" | "week" | "month" | "year";

export const statisticsService = {
  async getRevenueStatistics(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/revenue"
    );
    return response.data;
  },

  async getOverviewStatistics(
    period: StatisticsPeriod = "month"
  ): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/overview",
      { params: { period } }
    );
    return response.data;
  },

  async getUserStatistics(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/users/overview"
    );
    return response.data;
  },

  async getBookStatistics(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/books"
    );
    return response.data;
  },

  async getRecentOrders(limit: number = 5): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/admin/orders", {
      params: { limit, sortBy: "createdAt", sortOrder: "desc" },
    });
    return response.data;
  },

  async getRevenueChart(
    period: StatisticsPeriod = "month"
  ): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/revenue/chart",
      { params: { period } }
    );
    return response.data;
  },
};
