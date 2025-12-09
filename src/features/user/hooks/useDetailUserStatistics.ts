import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { userProfileService } from "../services/user-profile.service";
import type { IUserStatistics } from "../types";

interface UseDetailUserStatisticsResult {
  data: IUserStatistics | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDetailUserStatistics(
  userId?: string
): UseDetailUserStatisticsResult {
  const [data, setData] = useState<IUserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStatistics = useCallback(async () => {
    if (!userId) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const statistics = await userProfileService.getUserStatistics(userId);
      setData(statistics);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Không thể tải thống kê.");
      setError(error);
      message.error("Không thể tải thống kê người dùng.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

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

