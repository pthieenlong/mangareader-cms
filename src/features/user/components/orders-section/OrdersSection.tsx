import { Button, Card, Pagination, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import type { IUserPurchasedOrder } from "../../types";
import { OrderStatus, PayingMethod } from "@/features/order/types";
import { formatCurrency, formatDate, getOrderStatusColor } from "@/utils";

interface OrdersSectionProps {
  title?: string;
  orders: IUserPurchasedOrder[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
  onViewOrder?: (order: IUserPurchasedOrder) => void;
}

const payingMethodText: Record<PayingMethod, string> = {
  [PayingMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PayingMethod.CREDIT_CARD]: "Thẻ tín dụng",
  [PayingMethod.E_WALLET]: "Ví điện tử",
  [PayingMethod.VNPAY]: "VNPay",
};

export function OrdersSection({
  title = "Danh sách đơn hàng",
  orders,
  loading = false,
  pagination,
  onPageChange,
  onViewOrder,
}: OrdersSectionProps) {
  const columns: ColumnsType<IUserPurchasedOrder> = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 150,
    },
    {
      title: "Người mua",
      dataIndex: "userName",
      key: "userName",
      width: 160,
      render: (value: string) => value || "-",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (value: string) => formatDate(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value: OrderStatus) => (
        <Tag color={getOrderStatusColor(value)}>{value}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 120,
      align: "right",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Thanh toán",
      dataIndex: "payingMethod",
      key: "payingMethod",
      width: 120,
      render: (value: PayingMethod) => payingMethodText[value] || value,
    },
    {
      title: "Số sản phẩm",
      key: "itemsCount",
      width: 120,
      render: (_: unknown, record: IUserPurchasedOrder) =>
        record.orderItems?.length || 0,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_: unknown, record: IUserPurchasedOrder) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onViewOrder?.(record)}
          disabled={!onViewOrder}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title={title}>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{
          emptyText: "Chưa có đơn hàng nào.",
        }}
        scroll={{ x: 800 }}
      />
      <Pagination
        style={{ marginTop: 16, textAlign: "right" }}
        current={pagination.page}
        pageSize={pagination.limit}
        total={pagination.totalOrders}
        showSizeChanger
        showTotal={(total) => `Tổng ${total} đơn hàng`}
        onChange={onPageChange}
        onShowSizeChange={onPageChange}
      />
    </Card>
  );
}

