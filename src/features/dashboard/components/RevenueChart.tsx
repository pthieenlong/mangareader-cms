import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spin } from "antd";
import { formatVND } from "@/utils";
import type { TimeRange } from "../hooks/useRevenueChart";

// Custom tooltip for the chart
type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: {
      label: string;
      revenue: number;
      orders: number;
    };
  }>;
  timeRange: TimeRange;
};

function CustomTooltip({ active, payload, timeRange }: TooltipProps) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const labelPrefix =
      timeRange === "week" ? "Ngày" : timeRange === "month" ? "Ngày" : "Tháng";
    return (
      <div className="chart-tooltip">
        <p
          style={{ margin: 0, fontWeight: 500 }}
        >{`${labelPrefix} ${data.label}`}</p>
        <p style={{ margin: "4px 0 0 0", color: "#4f85d3" }}>
          Doanh thu: {formatVND(data.revenue)}
        </p>
        <p style={{ margin: "4px 0 0 0", color: "#52c41a" }}>
          Đơn hàng: {data.orders}
        </p>
      </div>
    );
  }
  return null;
}

export type RevenueChartProps = {
  data: Array<{ label: string; revenue: number; orders: number }>;
  timeRange: TimeRange;
  loading?: boolean;
};

export function RevenueChart({ data, timeRange, loading }: RevenueChartProps) {
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 240,
        }}
      >
        <Spin />
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f85d3" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#4f85d3" stopOpacity={0.4} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 12, fill: "#8c8c8c" }}
          tickLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#8c8c8c" }}
          tickLine={{ stroke: "#e5e7eb" }}
        />
        <Tooltip content={<CustomTooltip timeRange={timeRange} />} />
        <Bar
          dataKey="revenue"
          fill="url(#colorRevenue)"
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

