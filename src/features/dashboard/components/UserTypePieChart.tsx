import { Spin } from "antd";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { ROLE_COLORS, ROLE_LABELS } from "@/utils";
import type { IUserStatistics } from "../types";

// User role type for pie chart
interface IUserRoleData {
  role: string;
  count: number;
}

export type UserTypePieChartProps = {
  data: IUserStatistics | null;
  loading: boolean;
};

export function UserTypePieChart({ data, loading }: UserTypePieChartProps) {
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

  // Transform IUserStatistics to chart data format
  const roleData: IUserRoleData[] = data
    ? [
        { role: "USER", count: data.users },
        { role: "PUBLISHER", count: data.publishers },
        { role: "SUBSCRIBER", count: data.subscribers },
      ]
    : [];

  const chartData = roleData.map((item) => ({
    name: ROLE_LABELS[item.role] || item.role,
    value: item.count,
    color: ROLE_COLORS[item.role] || "#8884d8",
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
