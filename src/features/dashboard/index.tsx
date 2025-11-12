import { Card, Statistic, Typography, Table, Tag, Button, Space, Row, Col, Checkbox, List, Segmented } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useChartData, type TimeRange } from "@/hooks/useChartData";
import "./dashboard.scss";

const { Title, Text } = Typography;

type AnalyticCardProps = {
  title: string;
  value: string;
  trend?: React.ReactNode;
};

function AnalyticCard({ title, value, trend }: AnalyticCardProps) {
  return (
    <Card className="analytic-card">
      <Statistic
        title={<Text type="secondary">{title}</Text>}
        value={value}
        valueStyle={{ fontSize: 24, fontWeight: 600 }}
      />
      {trend && <div className="trend-text">{trend}</div>}
    </Card>
  );
}

// Pie chart data for user types
const userTypeData = [
  { name: "User thường", value: 1250, color: "#4f85d3" },
  { name: "Publisher", value: 320, color: "#52c41a" },
  { name: "Subscriber", value: 580, color: "#faad14" },
];

function UserTypePieChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={userTypeData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {userTypeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

// Mock data
const kpiCards: Array<{ title: string; value: string; trend: React.ReactNode }> = [
  {
    title: "Người dùng mới",
    value: "1,248",
    trend: (
      <Text type="secondary" style={{ fontSize: 12 }}>
        <ArrowUpOutlined style={{ color: "#52c41a" }} /> +8.2% so với tuần trước
      </Text>
    ),
  },
  {
    title: "Doanh thu",
    value: "$12,480",
    trend: (
      <Text type="secondary" style={{ fontSize: 12 }}>
        <ArrowUpOutlined style={{ color: "#52c41a" }} /> +12.6% trong 30 ngày
      </Text>
    ),
  },
  {
    title: "Sách xuất bản",
    value: "342",
    trend: (
      <Text type="secondary" style={{ fontSize: 12 }}>
        <ArrowUpOutlined style={{ color: "#52c41a" }} /> +14 sách trong tuần
      </Text>
    ),
  },
  {
    title: "Đơn hàng",
    value: "1,902",
    trend: (
      <Text type="secondary" style={{ fontSize: 12 }}>
        <ArrowDownOutlined style={{ color: "#ff4d4f" }} /> -2.1% so với hôm qua
      </Text>
    ),
  },
];

type OrderRecord = {
  id: string;
  date: string;
  customer: string;
  amount: string;
  status: string;
};

const recentOrders: OrderRecord[] = [
  { id: "ORD-92341", date: "11/03", customer: "Nguyễn An", amount: "$49.90", status: "PAID" },
  { id: "ORD-92340", date: "11/03", customer: "Trần Bình", amount: "$19.00", status: "PENDING" },
  { id: "ORD-92339", date: "11/02", customer: "Lê Chi", amount: "$120.00", status: "PAID" },
  { id: "ORD-92338", date: "11/02", customer: "Phạm Duy", amount: "$9.99", status: "REFUNDED" },
];

const topBooks: Array<{ title: string; sales: number }> = [
  { title: "Kiếm Sĩ Bất Bại", sales: 340 },
  { title: "Học Viện Phép Thuật", sales: 295 },
  { title: "Hành Tinh Đỏ", sales: 210 },
  { title: "Lữ Khách Thời Gian", sales: 190 },
  { title: "Bí Ẩn Rừng Sâu", sales: 175 },
];

const notificationsList: string[] = [
  "Sách 'Học Viện Phép Thuật' đã được phê duyệt.",
  "Có 12 đơn hàng mới trong hôm nay.",
  "Báo cáo doanh thu tháng đã sẵn sàng.",
  "2 chương mới vừa được đăng tải.",
];

const todoTasks: Array<{ label: string; done: boolean }> = [
  { label: "Cập nhật mô tả 3 sách", done: false },
  { label: "Phê duyệt yêu cầu publisher", done: false },
  { label: "Kiểm tra đơn hàng hoàn tiền", done: true },
  { label: "Xem thống kê người dùng", done: false },
];

const orderColumns: ColumnsType<OrderRecord> = [
  {
    title: "Mã",
    dataIndex: "id",
    key: "id",
    render: (text: string) => <Text strong>{text}</Text>,
  },
  {
    title: "Ngày",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Khách hàng",
    dataIndex: "customer",
    key: "customer",
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status: string) => {
      const statusMap: Record<string, { color: string; text: string }> = {
        PAID: { color: "success", text: "Đã thanh toán" },
        PENDING: { color: "warning", text: "Đang chờ" },
        REFUNDED: { color: "error", text: "Hoàn tiền" },
      };
      const statusInfo = statusMap[status] || { color: "default", text: status };
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

const CustomTooltip = ({ active, payload, timeRange }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const labelPrefix = timeRange === "week" ? "Ngày" : timeRange === "month" ? "Ngày" : "Tháng";
    return (
      <div className="chart-tooltip">
        <p style={{ margin: 0, fontWeight: 500 }}>{`${labelPrefix} ${data.label}`}</p>
        <p style={{ margin: "4px 0 0 0", color: "#4f85d3" }}>
          Doanh thu: ${data.revenue.toLocaleString("vi-VN")}
        </p>
        <p style={{ margin: "4px 0 0 0", color: "#52c41a" }}>
          Đơn hàng: {data.orders}
        </p>
      </div>
    );
  }
  return null;
};

type RevenueChartProps = {
  data: Array<{ label: string; revenue: number; orders: number }>;
  timeRange: TimeRange;
};

function RevenueChart({ data, timeRange }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4f85d3" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4f85d3" stopOpacity={0} />
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
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#4f85d3"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default function DashboardPage() {
  const { chartData, timeRange, setTimeRange } = useChartData();

  return (
    <div className="dashboard-container">
      {/* Heading + Description */}
      <div className="dashboard-header">
        <Title level={2} style={{ margin: 0 }}>
          Tổng quan hệ thống
        </Title>
        <Text type="secondary">
          Theo dõi số liệu chính, xu hướng theo thời gian và hoạt động gần đây của nền tảng.
        </Text>
      </div>

      {/* Analytic Boxes */}
      <Row gutter={[16, 16]}>
        {kpiCards.map((k) => (
          <Col xs={24} sm={12} lg={6} key={k.title}>
            <AnalyticCard title={k.title} value={k.value} trend={k.trend} />
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
                  Doanh thu và đơn hàng theo {timeRange === "week" ? "ngày" : timeRange === "month" ? "ngày" : "tháng"}
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
              <RevenueChart data={chartData} timeRange={timeRange} />
            </div>
          </Card>
        </Col>

        {/* User Type Pie Chart */}
        <Col xs={24} lg={8}>
          <Card className="pie-chart-card">
            <Title level={4} style={{ margin: "0 0 8px 0" }}>
              Phân loại người dùng
            </Title>
            <Text type="secondary" style={{ display: "block", marginBottom: 16 }}>
              Thống kê theo loại tài khoản
            </Text>
            <UserTypePieChart />
          </Card>
        </Col>
      </Row>

      {/* Extra sections */}
      <Row gutter={[16, 16]}>
        {/* Recent Orders */}
        <Col xs={24} lg={16}>
          <Card
            title="Đơn hàng gần đây"
            extra={<a>Xem tất cả</a>}
            className="orders-card"
          >
            <Table
              columns={orderColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Hành động nhanh" className="actions-card">
            <Space direction="vertical" style={{ width: "100%" }} size="small">
              <Button block style={{ textAlign: "left" }}>
                Tạo sách mới
              </Button>
              <Button block style={{ textAlign: "left" }}>
                Thêm chương mới
              </Button>
              <Button block style={{ textAlign: "left" }}>
                Xem báo cáo doanh thu
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Top Books */}
        <Col xs={24} lg={8}>
          <Card title="Sách nổi bật" className="top-books-card">
            <List
              dataSource={topBooks}
              renderItem={(item) => (
                <List.Item>
                  <div className="book-item">
                    <Text ellipsis style={{ flex: 1 }}>
                      {item.title}
                    </Text>
                    <Text type="secondary">{item.sales} bán</Text>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Notifications */}
        <Col xs={24} lg={8}>
          <Card title="Thông báo" className="notifications-card">
            <List
              dataSource={notificationsList}
              renderItem={(item) => (
                <List.Item>
                  <Card size="small" className="notification-item">
                    {item}
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Tasks */}
        <Col xs={24} lg={8}>
          <Card title="Việc cần làm" className="tasks-card">
            <List
              dataSource={todoTasks}
              renderItem={(item) => (
                <List.Item>
                  <Checkbox checked={item.done} disabled>
                    <Text delete={item.done} type={item.done ? "secondary" : undefined}>
                      {item.label}
                    </Text>
                  </Checkbox>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
