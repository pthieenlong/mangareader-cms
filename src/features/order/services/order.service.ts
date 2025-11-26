import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IOrderListParams } from "../types";

export const orderService = {
  async getOrders(params?: IOrderListParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/admin/orders", {
      params,
    });
    return response.data;
  },

  async getOrderById(id: string, userId: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/orders/${userId}/${id}`
    );
    return response.data;
  },
};
