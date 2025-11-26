import { useState } from "react";
import {
  Card,
  Typography,
  Table,
  Space,
  Button,
  Tooltip,
  Tag,
  Input,
  Select,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import { useOrders } from "./hooks/useOrders";
import type { IOrder, OrderStatus, PayingMethod } from "./types";
import {
  OrderStatus as OrderStatusEnum,
  PayingMethod as PayingMethodEnum,
} from "./types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { getStatusColor, getStatusText } from "./utils";
import "./order.scss";

const { Title, Text } = Typography;
const { Option } = Select;

export default function OrderPage() {
  const { orders, loading, pagination, updateFilters, handlePageChange } =
    useOrders();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();
  const [selectedPayingMethod, setSelectedPayingMethod] = useState<
    PayingMethod | undefined
  >();
  const router = useRouter();

  const handleSearch = () => {
    updateFilters({
      search: searchText || undefined,
      status: selectedStatus,
      payingMethod: selectedPayingMethod,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedStatus(undefined);
    setSelectedPayingMethod(undefined);
    updateFilters({
      search: undefined,
      status: undefined,
      payingMethod: undefined,
      page: 1,
    });
  };

  const handleViewDetail = (order: IOrder) => {
    if (!order.userId) {
      // message.warning("Thiếu thông tin người dùng cho đơn hàng này.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void (router as any).navigate({
      to: "/order/$userId/$orderId",
      params: {
        userId: order.userId,
        orderId: order.id,
      },
    });
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: IOrder, index: number) => {
        const currentPage = pagination.page || 1;
        const pageSize = pagination.limit || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (id: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {id.slice(0, 8)}...
        </Text>
      ),
    },
    {
      title: "Người dùng",
      key: "user",
      width: 200,
      render: (_: unknown, record: IOrder) => (
        <Space direction="vertical" size={4}>
          <Text strong>{record.user?.username || "N/A"}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.user?.email || record.userId}
          </Text>
        </Space>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right",
      render: (amount: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: OrderStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: string | undefined) => (date ? formatDate(date) : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_: unknown, record: IOrder) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="order-container">
      <div className="order-header">
        <Title level={2} style={{ margin: 0 }}>
          Đơn hàng
        </Title>
        <Text type="secondary">Quản lý danh sách đơn hàng và thanh toán.</Text>
      </div>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo mã đơn hàng hoặc email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Chọn trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: 150 }}
            >
              <Option value={OrderStatusEnum.PENDING}>Đang chờ</Option>
              <Option value={OrderStatusEnum.COMPLETED}>Hoàn thành</Option>
              <Option value={OrderStatusEnum.PAID}>Đã thanh toán</Option>
              <Option value={OrderStatusEnum.CANCELLED}>Đã hủy</Option>
              <Option value={OrderStatusEnum.REFUNDED}>Đã hoàn tiền</Option>
              <Option value={OrderStatusEnum.FAILED}>Thất bại</Option>
              <Option value={OrderStatusEnum.ERROR}>Lỗi</Option>
            </Select>
            <Select
              placeholder="Chọn phương thức thanh toán"
              value={selectedPayingMethod}
              onChange={setSelectedPayingMethod}
              allowClear
              style={{ width: 180 }}
            >
              <Option value={PayingMethodEnum.BANK_TRANSFER}>
                Chuyển khoản
              </Option>
              <Option value={PayingMethodEnum.CREDIT_CARD}>Thẻ tín dụng</Option>
              <Option value={PayingMethodEnum.E_WALLET}>Ví điện tử</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button onClick={handleResetFilters}>Đặt lại</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.totalItems,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} đơn hàng`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            scroll={{ x: 1400 }}
          />
        </Space>
      </Card>
    </div>
  );
}
