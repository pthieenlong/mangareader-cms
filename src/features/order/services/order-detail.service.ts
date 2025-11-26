import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IOrder } from "../types";

export const orderDetailService = {
  async getOrderDetail(userId: string, orderId: string): Promise<IOrder> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/orders/${userId}/${orderId}`
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(
        response.data.message || "Không thể tải thông tin đơn hàng."
      );
    }

    return response.data.data as IOrder;
  },
};
