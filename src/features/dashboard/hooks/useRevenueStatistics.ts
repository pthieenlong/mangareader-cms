import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { statisticsService } from "../services/statistics.service";
import type { IRevenueStatistics } from "../types";

export function useRevenueStatistics() {
  const [data, setData] = useState<IRevenueStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRevenueStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getRevenueStatistics();
      if (response.success && response.data) {
        setData(response.data as IRevenueStatistics);
      } else {
        const errorMessage =
          response.message || "Không thể tải thống kê doanh thu.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải thống kê doanh thu.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRevenueStatistics();
  }, [fetchRevenueStatistics]);

  return {
    data,
    loading,
    error,
    refetch: fetchRevenueStatistics,
  };
}


