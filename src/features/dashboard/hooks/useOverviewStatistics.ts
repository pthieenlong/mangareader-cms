import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { statisticsService, type StatisticsPeriod } from "../services/statistics.service";
import type { IOverviewStatistics } from "../types";

export function useOverviewStatistics(initialPeriod: StatisticsPeriod = "month") {
  const [data, setData] = useState<IOverviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [period, setPeriod] = useState<StatisticsPeriod>(initialPeriod);

  const fetchOverviewStatistics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getOverviewStatistics(period);
      if (response.success && response.data) {
        setData(response.data as IOverviewStatistics);
      } else {
        const errorMessage =
          response.message || "Không thể tải thống kê tổng quan.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải thống kê tổng quan.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    void fetchOverviewStatistics();
  }, [fetchOverviewStatistics]);

  return {
    data,
    loading,
    error,
    period,
    setPeriod,
    refetch: fetchOverviewStatistics,
  };
}


