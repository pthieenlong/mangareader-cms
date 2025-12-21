import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IOrderListParams, IOrder } from "../types";

interface OrdersApiResponse {
  orders: IOrder[];
  totalOrders: number;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const orderService = {
  async getOrders(params?: IOrderListParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/admin/orders", {
      params,
    });

    // Transform API response to match expected format
    if (response.data.success && response.data.data) {
      const apiData = response.data.data as OrdersApiResponse;
      return {
        ...response.data,
        data: apiData.orders,
        pagination: {
          page: apiData.pagination.page,
          limit: apiData.pagination.limit,
          totalPage: apiData.pagination.totalPages,
          totalItems: apiData.totalOrders,
        },
      };
    }

    return response.data;
  },

  async getOrderById(id: string, userId: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/orders/${userId}/${id}`
    );
    return response.data;
  },
};
