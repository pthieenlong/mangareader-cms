import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { bookService } from "../services/book.service";
import type { IBookOverviewStatistics } from "../types";

export function useBookOverviewStatistics() {
  const [data, setData] = useState<IBookOverviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBookOverviewStatistics();
      if (response.success && response.data) {
        setData(response.data as IBookOverviewStatistics);
      } else {
        const errorMessage =
          response.message || "Không thể tải thống kê truyện.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải thống kê truyện.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchStatistics();
  }, [fetchStatistics]);

  return {
    data,
    loading,
    error,
    refetch: fetchStatistics,
  };
}
