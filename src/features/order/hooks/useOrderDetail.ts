import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import type { IOrder } from "../types";
import { orderDetailService } from "../services/order-detail.service";

interface UseOrderDetailResult {
  loading: boolean;
  order: IOrder | null;
  refresh: () => void;
}

export function useOrderDetail(
  userId?: string,
  orderId?: string
): UseOrderDetailResult {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOrder = useCallback(async () => {
    if (!userId || !orderId) return;
    setLoading(true);
    try {
      const data = await orderDetailService.getOrderDetail(userId, orderId);
      setOrder(data);
    } catch (error) {
      console.error(error);
      message.error("Không thể tải thông tin đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [orderId, userId]);

  useEffect(() => {
    void fetchOrder();
  }, [fetchOrder]);

  return {
    loading,
    order,
    refresh: fetchOrder,
  };
}
