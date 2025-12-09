import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import {
  statisticsService,
  type StatisticsPeriod,
} from "../services/statistics.service";
import type { IRevenueChartItem } from "../types";

export type TimeRange = "week" | "month" | "year";

export function useRevenueChart() {
  const [data, setData] = useState<IRevenueChartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const fetchRevenueChart = useCallback(async (period: StatisticsPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const response = await statisticsService.getRevenueChart(period);
      if (response.success && response.data) {
        setData(response.data as IRevenueChartItem[]);
      } else {
        const errorMessage =
          response.message || "Không thể tải dữ liệu biểu đồ.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Có lỗi xảy ra khi tải dữ liệu biểu đồ.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRevenueChart(timeRange);
  }, [fetchRevenueChart, timeRange]);

  // Transform data for chart component
  const chartData = data.map((item) => ({
    label: item.period.replace("Ngày ", "").replace("Tháng ", "T"),
    revenue: item.totalRevenue,
    orders: item.ordersCount,
  }));

  return {
    chartData,
    rawData: data,
    loading,
    error,
    timeRange,
    setTimeRange,
    refetch: () => fetchRevenueChart(timeRange),
  };
}


