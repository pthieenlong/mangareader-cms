import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { userProfileService } from "../services/user-profile.service";
import type {
  IPublisherOrdersParams,
  IUserPurchasedOrder,
  IUserPurchasedOrdersResponse,
} from "../types";

interface UsePublisherOrdersResult {
  orders: IUserPurchasedOrder[];
  loading: boolean;
  error: Error | null;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalOrders: number;
  };
  updateParams: (params: Partial<IPublisherOrdersParams>) => void;
  refetch: () => Promise<void>;
}

export function usePublisherOrders(
  publisherId?: string,
  initialParams?: IPublisherOrdersParams
): UsePublisherOrdersResult {
  const [orders, setOrders] = useState<IUserPurchasedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<IPublisherOrdersParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalOrders: 0,
  });

  const fetchOrders = useCallback(async () => {
    if (!publisherId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response: IUserPurchasedOrdersResponse =
        await userProfileService.getPublisherOrders(publisherId, params);
      setOrders(response.orders);
      setPagination({
        page: response.pagination.page,
        limit: response.pagination.limit,
        totalPages: response.pagination.totalPages,
        totalOrders: response.totalOrders,
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Không thể tải đơn hàng publisher.");
      setError(error);
      message.error("Không thể tải danh sách đơn hàng của publisher.");
    } finally {
      setLoading(false);
    }
  }, [publisherId, params]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateParams = useCallback((newParams: Partial<IPublisherOrdersParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return useMemo(
    () => ({
      orders,
      loading,
      error,
      pagination,
      updateParams,
      refetch: fetchOrders,
    }),
    [fetchOrders, loading, orders, pagination, error, updateParams]
  );
}

