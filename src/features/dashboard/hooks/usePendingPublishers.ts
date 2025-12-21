import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { statisticsService } from "../services/statistics.service";
import type { IPendingPublisher } from "../types";

export function usePendingPublishers(limit: number = 5) {
  const [publishers, setPublishers] = useState<IPendingPublisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPendingPublishers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getPendingPublishers();
      if (response.success && response.data?.publishers) {
        setPublishers(response.data.publishers as IPendingPublisher[]);
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách nhà xuất bản chờ duyệt.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message ||
        "Có lỗi xảy ra khi tải danh sách nhà xuất bản chờ duyệt.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchPendingPublishers();
  }, [fetchPendingPublishers]);

  return {
    publishers,
    loading,
    error,
    refetch: fetchPendingPublishers,
  };
}
