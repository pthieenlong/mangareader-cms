import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { notificationService } from "../services/notification.service";
import type { INotification, INotificationFilter } from "../types";
import type { Pagination } from "@/lib/custom";

export function useNotifications(initialFilters?: INotificationFilter) {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<INotificationFilter>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications(filters);
      if (response.success && response.data) {
        const nextNotifications = response.data as INotification[];
        setNotifications(nextNotifications);
        if (response.pagination) {
          setPagination(response.pagination as Pagination);
        }
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách thông báo.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải thông báo.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const updateFilters = useCallback(
    (newFilters: Partial<INotificationFilter>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page ?? 1,
      }));
    },
    []
  );

  return {
    notifications,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchNotifications,
    updateFilters,
  };
}
