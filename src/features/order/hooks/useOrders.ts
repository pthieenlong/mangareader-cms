import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { orderService } from "../services/order.service";
import type { IOrder, IOrderListParams } from "../types";
import type { Pagination } from "@/lib/custom";

export function useOrders(initialParams?: IOrderListParams) {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IOrderListParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
    ...initialParams,
  });

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderService.getOrders(filters);
      if (response.success && response.data) {
        setOrders(response.data as IOrder[]);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách đơn hàng, vui lòng thử lại.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải danh sách đơn hàng.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const updateFilters = useCallback((newFilters: Partial<IOrderListParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    updateFilters({ page, limit: pageSize });
  }, [updateFilters]);

  return {
    orders,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchOrders,
    updateFilters,
    handlePageChange,
  };
}



