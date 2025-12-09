import { Card, Typography, Table, Tag, Row, Col, Segmented } from "antd";
import type { ColumnsType } from "antd/es/table";
import { AnalyticCard, TrendIndicator } from "@/components";
import { formatVND, formatNumber } from "@/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRevenueStatistics } from "./hooks/useRevenueStatistics";
import { useOverviewStatistics } from "./hooks/useOverviewStatistics";
import { useUserStatistics } from "./hooks/useUserStatistics";
import { useRecentOrders } from "./hooks/useRecentOrders";
import { useRevenueChart, type TimeRange } from "./hooks/useRevenueChart";
import { RevenueChart, UserTypePieChart } from "./components";
import type { IRecentOrder } from "./types";
import "./dashboard.scss";

const { Title, Text } = Typography;

// Order columns for the table
const orderColumns: ColumnsType<IRecentOrder> = [
  {
    title: "Mã đơn",
    dataIndex: "id",
    key: "id",
    render: (text: string) => <Text strong>{text.slice(0, 8)}...</Text>,
  },
  {
    title: "Ngày",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date: string) =>
      format(new Date(date), "dd/MM/yyyy", { locale: vi }),
  },
  {
    title: "Khách hàng",
    dataIndex: "user",
    key: "user",
    render: (_: unknown, record: IRecentOrder) =>
      record.user?.username || "N/A",
  },
  {
    title: "Số tiền",
    dataIndex: "totalAmount",
    key: "totalAmount",
    render: (amount: number) => formatVND(amount),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        PAID: { color: "success", text: "Đã thanh toán" },
        PENDING: { color: "warning", text: "Đang chờ" },
        CANCELLED: { color: "default", text: "Đã hủy" },
        REFUNDED: { color: "error", text: "Hoàn tiền" },
        ERROR: { color: "error", text: "Lỗi" },
      };
      const statusInfo = statusMap[status] || {
        color: "default",
        text: status,
      };
      return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
    },
  },
];

// Helper function to get time range label
const getTimeRangeLabel = (timeRange: TimeRange): string => {
  switch (timeRange) {
    case "week":
      return "Tuần";
    case "month":
      return "Tháng";
    case "year":
      return "Năm";
    default:
      return "Tháng";
  }
};

export default function DashboardPage() {
  const {
    chartData,
    timeRange,
    setTimeRange,
    loading: chartLoading,
  } = useRevenueChart();
  const { data: revenueData, loading: revenueLoading } = useRevenueStatistics();
  const { data: overviewData, loading: overviewLoading } =
    useOverviewStatistics();
  const { data: userStatsData, loading: userStatsLoading } =
    useUserStatistics();
  const { orders: recentOrders, loading: ordersLoading } = useRecentOrders(5);

  // Build KPI cards with real data
  const kpiCards = [
    {
      title: "Người dùng mới",
      value: overviewLoading
        ? "..."
        : formatNumber(overviewData?.newUsers ?? 0),
      trend: overviewLoading ? null : (
        <TrendIndicator value={overviewData?.userGrowth ?? 0} />
      ),
      loading: overviewLoading,
    },
    {
      title: "Doanh thu",
      value: revenueLoading ? "..." : formatVND(revenueData?.totalRevenue ?? 0),
      trend: revenueLoading ? null : (
        <TrendIndicator value={revenueData?.revenueGrowth ?? 0} />
      ),
      loading: revenueLoading,
    },
    {
      title: "Sách xuất bản",
      value: overviewLoading
        ? "..."
        : formatNumber(overviewData?.totalBooks ?? 0),
      trend: overviewLoading ? null : (
        <TrendIndicator value={overviewData?.bookGrowth ?? 0} />
      ),
      loading: overviewLoading,
    },
    {
      title: "Đơn hàng",
      value: overviewLoading
        ? "..."
        : formatNumber(overviewData?.totalOrders ?? 0),
      trend: overviewLoading ? null : (
        <TrendIndicator value={overviewData?.orderGrowth ?? 0} />
      ),
      loading: overviewLoading,
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Heading + Description */}
      <div className="dashboard-header">
        <Title level={2} style={{ margin: 0 }}>
          Tổng quan hệ thống
        </Title>
        <Text type="secondary">
          Theo dõi số liệu chính, xu hướng theo thời gian và hoạt động gần đây
          của nền tảng.
        </Text>
      </div>

      {/* Analytic Boxes */}
      <Row gutter={[16, 16]}>
        {kpiCards.map((k) => (
          <Col xs={24} sm={12} lg={6} key={k.title}>
            <AnalyticCard
              title={k.title}
              value={k.value}
              trend={k.trend}
              loading={k.loading}
            />
          </Col>
        ))}
      </Row>

      {/* Chart Sections */}
      <Row gutter={[16, 16]}>
        {/* Revenue Chart */}
        <Col xs={24} lg={16}>
          <Card className="chart-card">
            <div className="chart-header">
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  Hiệu suất {getTimeRangeLabel(timeRange)}
                </Title>
                <Text type="secondary">
                  Doanh thu và đơn hàng theo{" "}
                  {timeRange === "week"
                    ? "ngày"
                    : timeRange === "month"
                    ? "ngày"
                    : "tháng"}
                </Text>
              </div>
              <Segmented
                options={[
                  { label: "Tuần", value: "week" },
                  { label: "Tháng", value: "month" },
                  { label: "Năm", value: "year" },
                ]}
                value={timeRange}
                onChange={(value) => setTimeRange(value as TimeRange)}
              />
            </div>
            <div className="chart-wrapper">
              <RevenueChart
                data={chartData}
                timeRange={timeRange}
                loading={chartLoading}
              />
            </div>
          </Card>
        </Col>

        {/* User Type Pie Chart */}
        <Col xs={24} lg={8}>
          <Card className="pie-chart-card">
            <Title level={4} style={{ margin: "0 0 8px 0" }}>
              Phân loại người dùng
            </Title>
            <Text
              type="secondary"
              style={{ display: "block", marginBottom: 16 }}
            >
              Thống kê theo loại tài khoản
            </Text>
            <UserTypePieChart data={userStatsData} loading={userStatsLoading} />
          </Card>
        </Col>
      </Row>

      {/* Recent Orders Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card title="Đơn hàng gần đây" className="orders-card">
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
              loading={ordersLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
