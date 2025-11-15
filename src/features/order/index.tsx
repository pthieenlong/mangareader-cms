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
  Modal,
  Form,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CloseCircleOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useOrders } from "./hooks/useOrders";
import type { IOrder, OrderStatus, PayingMethod } from "./types";
import {
  OrderStatus as OrderStatusEnum,
  PayingMethod as PayingMethodEnum,
} from "./types";
import { formatDate, formatCurrency } from "@/lib/utils";
import { orderService } from "./services/order.service";
import "./order.scss";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatusEnum.COMPLETED:
    case OrderStatusEnum.PAID:
      return "success";
    case OrderStatusEnum.PENDING:
      return "warning";
    case OrderStatusEnum.CANCELLED:
    case OrderStatusEnum.FAILED:
    case OrderStatusEnum.ERROR:
      return "error";
    case OrderStatusEnum.REFUNDED:
      return "default";
    default:
      return "default";
  }
};

const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return "Đang chờ";
    case OrderStatusEnum.COMPLETED:
      return "Hoàn thành";
    case OrderStatusEnum.PAID:
      return "Đã thanh toán";
    case OrderStatusEnum.CANCELLED:
      return "Đã hủy";
    case OrderStatusEnum.REFUNDED:
      return "Đã hoàn tiền";
    case OrderStatusEnum.FAILED:
      return "Thất bại";
    case OrderStatusEnum.ERROR:
      return "Lỗi";
    default:
      return status;
  }
};

const getPayingMethodText = (method: PayingMethod): string => {
  switch (method) {
    case PayingMethodEnum.BANK_TRANSFER:
      return "Chuyển khoản";
    case PayingMethodEnum.CREDIT_CARD:
      return "Thẻ tín dụng";
    case PayingMethodEnum.E_WALLET:
      return "Ví điện tử";
    default:
      return method;
  }
};

export default function OrderPage() {
  const {
    orders,
    loading,
    pagination,
    updateFilters,
    handlePageChange,
    refetch,
  } = useOrders();
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<
    OrderStatus | undefined
  >();
  const [selectedPayingMethod, setSelectedPayingMethod] = useState<
    PayingMethod | undefined
  >();
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [form] = Form.useForm();

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
    setSelectedOrder(order);
    setDetailModalVisible(true);
  };

  const handleCancel = (order: IOrder) => {
    setSelectedOrder(order);
    form.resetFields();
    setCancelModalVisible(true);
  };

  const handleCancelSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedOrder) return;

      const response = await orderService.cancelOrder(
        selectedOrder.id,
        values.reason
      );

      if (response.success) {
        message.success("Hủy đơn hàng thành công!");
        setCancelModalVisible(false);
        setSelectedOrder(null);
        form.resetFields();
        void refetch();
      } else {
        message.error(response.message || "Hủy đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      message.error("Có lỗi xảy ra khi hủy đơn hàng!");
    }
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
      title: "Phương thức thanh toán",
      dataIndex: "payingMethod",
      key: "payingMethod",
      width: 150,
      render: (method: PayingMethod) => (
        <Tag>{getPayingMethodText(method)}</Tag>
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
      title: "Ngày thanh toán",
      dataIndex: "paidAt",
      key: "paidAt",
      width: 120,
      render: (date: string | null | undefined) =>
        date ? formatDate(date) : "-",
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
          {record.status === OrderStatusEnum.PENDING && (
            <Tooltip title="Hủy đơn hàng">
              <Button
                type="text"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleCancel(record)}
              />
            </Tooltip>
          )}
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

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đơn hàng"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedOrder(null);
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setDetailModalVisible(false);
              setSelectedOrder(null);
            }}
          >
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedOrder && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <div>
              <Text strong>Mã đơn hàng: </Text>
              <Text code>{selectedOrder.id}</Text>
            </div>
            <div>
              <Text strong>Người dùng: </Text>
              <Text>
                {selectedOrder.user?.username || selectedOrder.userId}
              </Text>
              {selectedOrder.user?.email && (
                <>
                  <br />
                  <Text type="secondary">{selectedOrder.user.email}</Text>
                </>
              )}
            </div>
            <div>
              <Text strong>Tổng tiền: </Text>
              <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
                {formatCurrency(selectedOrder.totalAmount)}
              </Text>
            </div>
            <div>
              <Text strong>Trạng thái: </Text>
              <Tag color={getStatusColor(selectedOrder.status)}>
                {getStatusText(selectedOrder.status)}
              </Tag>
            </div>
            <div>
              <Text strong>Phương thức thanh toán: </Text>
              <Tag>{getPayingMethodText(selectedOrder.payingMethod)}</Tag>
            </div>
            <div>
              <Text strong>Ngày tạo: </Text>
              <Text>
                {selectedOrder.createdAt
                  ? formatDate(selectedOrder.createdAt)
                  : "-"}
              </Text>
            </div>
            {selectedOrder.paidAt && (
              <div>
                <Text strong>Ngày thanh toán: </Text>
                <Text>{formatDate(selectedOrder.paidAt)}</Text>
              </div>
            )}
            {selectedOrder.orderItems &&
              selectedOrder.orderItems.length > 0 && (
                <div>
                  <Text strong>Chi tiết đơn hàng:</Text>
                  <Table
                    dataSource={selectedOrder.orderItems}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    columns={[
                      {
                        title: "Sách/Chương",
                        key: "item",
                        render: (_: unknown, item) => (
                          <Text>
                            {item.bookId
                              ? `Sách: ${item.bookId.slice(0, 8)}...`
                              : ""}
                            {item.chapterId
                              ? `Chương: ${item.chapterId.slice(0, 8)}...`
                              : ""}
                          </Text>
                        ),
                      },
                      {
                        title: "Giá gốc",
                        dataIndex: "defaultPrice",
                        align: "right",
                        render: (price: number) => formatCurrency(price),
                      },
                      {
                        title: "Giảm giá",
                        dataIndex: "discountPrice",
                        align: "right",
                        render: (price: number) => formatCurrency(price),
                      },
                      {
                        title: "Đã đọc",
                        dataIndex: "isRead",
                        render: (isRead: boolean) => (
                          <Tag color={isRead ? "success" : "default"}>
                            {isRead ? "Đã đọc" : "Chưa đọc"}
                          </Tag>
                        ),
                      },
                    ]}
                  />
                </div>
              )}
          </Space>
        )}
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title="Hủy đơn hàng"
        open={cancelModalVisible}
        onOk={handleCancelSubmit}
        onCancel={() => {
          setCancelModalVisible(false);
          setSelectedOrder(null);
          form.resetFields();
        }}
        okText="Xác nhận hủy"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Lý do hủy đơn hàng"
            name="reason"
            rules={[
              { required: true, message: "Vui lòng nhập lý do hủy đơn hàng!" },
            ]}
          >
            <TextArea placeholder="Nhập lý do hủy đơn hàng..." rows={4} />
          </Form.Item>
          {selectedOrder && (
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Bạn đang hủy đơn hàng{" "}
                <Text code>{selectedOrder.id.slice(0, 8)}...</Text> với tổng
                tiền{" "}
                <Text strong>{formatCurrency(selectedOrder.totalAmount)}</Text>
              </Text>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  );
}
