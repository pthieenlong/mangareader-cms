import { useState } from "react";
import { Button, Card, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import type {
  IUserPurchasedOrder,
  PurchasedOrderSortBy,
  SortOrder,
} from "../types";
import { OrderStatus, PayingMethod } from "@/features/order/types";
import { formatCurrency, formatDate, getOrderStatusColor } from "@/utils";

const payingMethodText: Record<PayingMethod, string> = {
  [PayingMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PayingMethod.CREDIT_CARD]: "Thẻ tín dụng",
  [PayingMethod.E_WALLET]: "Ví điện tử",
  [PayingMethod.VNPAY]: "VNPay",
};

interface UserPurchasedOrdersTableProps {
  orders: IUserPurchasedOrder[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    totalOrders: number;
  };
  onPageChange: (page: number, pageSize?: number) => void;
  onSortChange: (sortBy: PurchasedOrderSortBy, sortOrder: SortOrder) => void;
  onViewOrder: (order: IUserPurchasedOrder) => void;
}

export function UserPurchasedOrdersTable({
  orders,
  loading,
  pagination,
  onPageChange,
  onSortChange,
  onViewOrder,
}: UserPurchasedOrdersTableProps) {
  const [sortBy, setSortBy] = useState<PurchasedOrderSortBy>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const handleSortChange = (newSortBy: PurchasedOrderSortBy) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange(newSortBy, newSortOrder);
  };

  const columns: ColumnsType<IUserPurchasedOrder> = [
    {
      title: "Mã đơn",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      sorter: true,
      sortOrder: sortBy === "createdAt" ? sortOrder : null,
      render: (value: string) => formatDate(value),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("createdAt"),
      }),
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
      sorter: true,
      sortOrder: sortBy === "totalAmount" ? sortOrder : null,
      render: (value: number) => formatCurrency(value),
      onHeaderCell: () => ({
        onClick: () => handleSortChange("totalAmount"),
      }),
    },
    {
      title: "Thanh toán",
      dataIndex: "payingMethod",
      key: "payingMethod",
      width: 120,
      render: (value: PayingMethod) => payingMethodText[value] || value,
    },
    {
      title: "Số lượng sản phẩm",
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
          onClick={() => onViewOrder(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card title="Lịch sử đơn hàng">
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalOrders,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} đơn hàng`,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
        }}
        locale={{
          emptyText: "Chưa có đơn hàng nào.",
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
}


