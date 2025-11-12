import { useState, useMemo } from "react";

export type TimeRange = "week" | "month" | "year";

export type ChartDataPoint = {
  label: string;
  revenue: number;
  orders: number;
};

// Mock data generators
const generateWeekData = (): ChartDataPoint[] => {
  const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
  return days.map((day) => ({
    label: day,
    revenue: Math.floor(Math.random() * 500) + 200,
    orders: Math.floor(Math.random() * 100) + 30,
  }));
};

const generateMonthData = (): ChartDataPoint[] => {
  return Array.from({ length: 30 }, (_, i) => ({
    label: `${i + 1}`,
    revenue: Math.floor(Math.random() * 500) + 100,
    orders: Math.floor(Math.random() * 150) + 20,
  }));
};

const generateYearData = (): ChartDataPoint[] => {
  const months = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];
  return months.map((month) => ({
    label: month,
    revenue: Math.floor(Math.random() * 5000) + 2000,
    orders: Math.floor(Math.random() * 1000) + 500,
  }));
};

export function useChartData() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const chartData = useMemo(() => {
    switch (timeRange) {
      case "week":
        return generateWeekData();
      case "month":
        return generateMonthData();
      case "year":
        return generateYearData();
      default:
        return generateMonthData();
    }
  }, [timeRange]);

  return {
    chartData,
    timeRange,
    setTimeRange,
  };
}

