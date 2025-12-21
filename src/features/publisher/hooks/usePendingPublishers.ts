import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { publisherService } from "../services/publisher.service";
import type { IPublisherApplication, IPendingPublishersParams } from "../types";
import type { Pagination } from "@/lib/custom";

export function usePendingPublishers(initialParams?: IPendingPublishersParams) {
  const [applications, setApplications] = useState<IPublisherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IPendingPublishersParams>({
    page: 1,
    limit: 10,
    ...initialParams,
  });

  const fetchPendingPublishers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await publisherService.getPendingPublishers(filters);
      if (response.success && response.data) {
        setApplications(response.data as IPublisherApplication[]);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        const errorMessage =
          response.message ||
          "Không thể tải danh sách publisher đang chờ phê duyệt, vui lòng thử lại.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message ||
        "Có lỗi xảy ra khi tải danh sách publisher đang chờ phê duyệt.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void fetchPendingPublishers();
  }, [fetchPendingPublishers]);

  const updateFilters = useCallback(
    (newFilters: Partial<IPendingPublishersParams>) => {
      setFilters((prev) => ({
        ...prev,
        ...newFilters,
      }));
    },
    []
  );

  const handlePageChange = useCallback(
    (page: number) => {
      updateFilters({ page });
    },
    [updateFilters]
  );

  return {
    applications,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchPendingPublishers,
    updateFilters,
    handlePageChange,
  };
}
