import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { userProfileService } from "../services/user-profile.service";
import type {
  IUserPurchasedOrder,
  IUserPurchasedOrdersParams,
  IUserPurchasedOrdersResponse,
} from "../types";

interface UseUserPurchasedOrdersResult {
  orders: IUserPurchasedOrder[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalOrders: number;
  };
  updateParams: (params: Partial<IUserPurchasedOrdersParams>) => void;
  refetch: () => Promise<void>;
}

export function useUserPurchasedOrders(
  userId?: string,
  initialParams?: IUserPurchasedOrdersParams
): UseUserPurchasedOrdersResult {
  const [orders, setOrders] = useState<IUserPurchasedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<IUserPurchasedOrdersParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalOrders: 0,
  });

  const fetchOrders = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response: IUserPurchasedOrdersResponse =
        await userProfileService.getUserPurchasedOrders(userId, params);
      setOrders(response.orders);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
        totalOrders: response.totalOrders,
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Không thể tải đơn hàng.");
      setError(error);
      message.error("Không thể tải lịch sử đơn hàng.");
    } finally {
      setLoading(false);
    }
  }, [userId, params]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateParams = useCallback(
    (newParams: Partial<IUserPurchasedOrdersParams>) => {
      setParams((prev) => ({ ...prev, ...newParams }));
    },
    []
  );

  return {
    orders,
    loading,
    error,
    pagination,
    updateParams,
    refetch: fetchOrders,
  };
}




