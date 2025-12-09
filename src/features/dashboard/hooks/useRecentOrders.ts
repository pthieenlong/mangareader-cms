import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { statisticsService } from "../services/statistics.service";
import type { IRecentOrder } from "../types";

export function useRecentOrders(limit: number = 5) {
  const [orders, setOrders] = useState<IRecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecentOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getRecentOrders(limit);
      if (response.success && response.data) {
        setOrders(response.data as IRecentOrder[]);
      } else {
        const errorMessage =
          response.message || "Không thể tải đơn hàng gần đây.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải đơn hàng gần đây.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchRecentOrders();
  }, [fetchRecentOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchRecentOrders,
  };
}


