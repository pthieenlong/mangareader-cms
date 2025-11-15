import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IOrderListParams } from "../types";

export const orderService = {
  async getOrders(params?: IOrderListParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/api/orders", {
      params,
    });
    return response.data;
  },

  async getOrderById(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/api/orders/${id}`
    );
    return response.data;
  },

  async cancelOrder(id: string, reason?: string): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/api/orders/${id}/cancel`,
      { reason }
    );
    return response.data;
  },
};



