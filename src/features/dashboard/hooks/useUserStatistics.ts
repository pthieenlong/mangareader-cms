import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { statisticsService } from "../services/statistics.service";
import type { IUserStatistics } from "../types";

export function useUserStatistics() {
  const [data, setData] = useState<IUserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getUserStatistics();
      if (response.success && response.data) {
        setData(response.data as IUserStatistics);
      } else {
        const errorMessage =
          response.message || "Không thể tải thống kê người dùng.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải thống kê người dùng.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUserStatistics();
  }, [fetchUserStatistics]);

  return {
    data,
    loading,
    error,
    refetch: fetchUserStatistics,
  };
}


