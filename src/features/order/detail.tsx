import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useRouter, useParams } from "@tanstack/react-router";
import {
  formatCurrency,
  formatDate,
  getPayingMethodText,
  getOrderStatusColor,
  getOrderStatusText,
} from "@/utils";
import { useOrderDetail } from "./hooks/useOrderDetail";
import type { IOrderItem } from "./types";
import "./order-detail.scss";

const { Title, Text } = Typography;

const itemColumns: ColumnsType<IOrderItem> = [
  {
    title: "Sách/Chương",
    key: "resource",
    render: (_: unknown, record) => (
      <Space direction="vertical" size={0}>
        {record.bookId ? (
          <Text>Kèm sách: {record.bookId}</Text>
        ) : (
          <Text type="secondary">Không có sách</Text>
        )}
        {record.chapterId && (
          <Text type="secondary">Chương: {record.chapterId}</Text>
        )}
      </Space>
    ),
  },
  {
    title: "Giá gốc",
    dataIndex: "defaultPrice",
    align: "right",
    render: (value: number) => formatCurrency(value),
  },
  {
    title: "Giảm giá",
    dataIndex: "discountPrice",
    align: "right",
    render: (value: number) => formatCurrency(value),
  },
  {
    title: "Đã đọc",
    dataIndex: "isRead",
    align: "center",
    render: (isRead: boolean) => (
      <Tag color={isRead ? "success" : "default"}>
        {isRead ? "Đã đọc" : "Chưa đọc"}
      </Tag>
    ),
  },
];

export default function OrderDetailPage() {
  const { userId, orderId } = useParams({ strict: false }) as {
    userId?: string;
    orderId?: string;
  };
  const router = useRouter();
  const { order, loading, refresh } = useOrderDetail(userId, orderId);

  if (!userId || !orderId) {
    return (
      <Empty description="Thiếu thông tin đơn hàng. Vui lòng quay lại danh sách." />
    );
  }

  return (
    <div className="order-detail-page">
      <div className="order-detail-page__header">
        <Space size="middle">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => router.navigate({ to: "/order" as never })}
          >
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết đơn hàng
          </Title>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={refresh} disabled={loading}>
          Tải lại
        </Button>
      </div>
      <Spin spinning={loading}>
        {order ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Descriptions
                    bordered
                    size="small"
                    column={1}
                    title="Thông tin đơn hàng"
                  >
                    <Descriptions.Item label="Mã đơn">
                      <Text code>{order.id}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={getOrderStatusColor(order.status)}>
                        {getOrderStatusText(order.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                      <Text strong>{formatCurrency(order.totalAmount)}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức">
                      {getPayingMethodText(order.payingMethod)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {order.createdAt ? formatDate(order.createdAt) : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày thanh toán">
                      {order.paidAt ? formatDate(order.paidAt) : "-"}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                <Col xs={24} md={12}>
                  <Descriptions
                    bordered
                    size="small"
                    column={1}
                    title="Người mua"
                  >
                    <Descriptions.Item label="Tên">
                      {order.user?.username || order.userId}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {order.user?.email || "Không có"}
                    </Descriptions.Item>
                    <Descriptions.Item label="ID người dùng">
                      <Text code>{order.userId}</Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
              </Row>
            </Card>

            <Card title="Danh sách sản phẩm">
              <Table<IOrderItem>
                columns={itemColumns}
                dataSource={order.orderItems || []}
                pagination={false}
                rowKey="id"
                locale={{
                  emptyText: "Không có sản phẩm trong đơn hàng.",
                }}
              />
            </Card>
          </Space>
        ) : (
          <Empty description="Không tìm thấy đơn hàng." />
        )}
      </Spin>
    </div>
  );
}
