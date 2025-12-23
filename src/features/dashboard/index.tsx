import {
  Card,
  Typography,
  Table,
  Tag,
  Row,
  Col,
  Segmented,
  Avatar,
  Button,
  Space,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AnalyticCard, TrendIndicator } from "@/components";
import { formatVND, formatNumber } from "@/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useRevenueStatistics } from "./hooks/useRevenueStatistics";
import { useOverviewStatistics } from "./hooks/useOverviewStatistics";
import { useUserStatistics } from "./hooks/useUserStatistics";
import { useRecentOrders } from "./hooks/useRecentOrders";
import { usePendingPublishers } from "./hooks/usePendingPublishers";
import { usePendingBooks } from "./hooks/usePendingBooks";
import { useRevenueChart, type TimeRange } from "./hooks/useRevenueChart";
import { RevenueChart, UserTypePieChart } from "./components";
import type { IRecentOrder, IPendingPublisher } from "./types";
import type { IBook } from "@/features/book/types";
import { statisticsService } from "./services/statistics.service";
import { router } from "@/app/router.instance";
import "./dashboard.scss";

const { Title, Text } = Typography;

// Order columns for the table
const orderColumns: ColumnsType<IRecentOrder> = [
  {
    title: "Mã đơn",
    dataIndex: "orderCode",
    key: "id",
    width: 220,
    render: (text: string) => <Text strong>{text}</Text>,
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
  const { orders: recentOrders, loading: ordersLoading } = useRecentOrders();
  const {
    publishers: pendingPublishers,
    loading: publishersLoading,
    refetch: refetchPublishers,
  } = usePendingPublishers();
  const { books: pendingBooks, loading: booksLoading } = usePendingBooks(5);

  // Handle approve publisher
  const handleApprovePublisher = async (publisherId: string) => {
    try {
      const response = await statisticsService.approvePublisher(publisherId);
      if (response.success) {
        message.success(response.message || "Duyệt nhà xuất bản thành công");
        refetchPublishers();
      } else {
        message.error(
          response.message || "Có lỗi xảy ra khi duyệt nhà xuất bản"
        );
      }
    } catch (error) {
      message.error(
        (error as Error).message || "Có lỗi xảy ra khi duyệt nhà xuất bản"
      );
    }
  };

  // Handle reject publisher
  const handleRejectPublisher = async (publisherId: string) => {
    try {
      const response = await statisticsService.rejectPublisher(publisherId);
      if (response.success) {
        message.success(response.message || "Từ chối nhà xuất bản thành công");
        refetchPublishers();
      } else {
        message.error(
          response.message || "Có lỗi xảy ra khi từ chối nhà xuất bản"
        );
      }
    } catch (error) {
      message.error(
        (error as Error).message || "Có lỗi xảy ra khi từ chối nhà xuất bản"
      );
    }
  };

  // Pending Books columns for the table
  const bookColumns: ColumnsType<IBook> = [
    {
      title: "Truyện",
      dataIndex: "title",
      key: "title",
      render: (_: unknown, record: IBook) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={record.thumbnail} size={32} shape="square">
            {record.title.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Typography.Link
              strong
              onClick={() => {
                router.navigate({
                  to: "/book/$slug",
                  params: { slug: record.slug },
                } as never);
              }}
            >
              {record.title.substring(0, 8)}...
            </Typography.Link>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.author.substring(0, 8)}...
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Nhà xuất bản",
      dataIndex: "publisher",
      key: "publisher",
      render: (_: unknown, record: IBook) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={record.publisher?.avatar} size={24}>
            {record.publisher?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Text>{record.publisher?.username || "N/A"}</Text>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        format(new Date(date), "dd/MM/yyyy", { locale: vi }),
    },
  ];

  // Pending Publishers columns for the table
  const publisherColumns: ColumnsType<IPendingPublisher> = [
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (_: unknown, record: IPendingPublisher) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar src={record.avatar} size={32}>
            {record.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{record.username}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.email}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        format(new Date(date), "dd/MM/yyyy", { locale: vi }),
    },
    {
      title: "Chờ duyệt",
      dataIndex: "waitingDays",
      key: "waitingDays",
      render: (days: number) => <Text>{days} ngày</Text>,
    },
    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      key: "accountStatus",
      render: (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
          NOT_VERIFY: { color: "warning", text: "Chưa xác thực" },
          VERIFIED: { color: "success", text: "Đã xác thực" },
          BANNED: { color: "error", text: "Đã cấm" },
        };
        const statusInfo = statusMap[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: unknown, record: IPendingPublisher) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleApprovePublisher(record.id)}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleRejectPublisher(record.id)}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

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

      {/* Pending Books & Publishers Section */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Truyện chờ duyệt" className="books-card">
            <Table
              columns={bookColumns}
              dataSource={pendingBooks}
              rowKey="id"
              pagination={false}
              size="small"
              loading={booksLoading}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Nhà xuất bản chờ duyệt" className="publishers-card">
            <Table
              columns={publisherColumns}
              dataSource={pendingPublishers}
              rowKey="id"
              pagination={false}
              size="small"
              loading={publishersLoading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
