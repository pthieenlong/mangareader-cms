import { Avatar, Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { IPurchasedUser } from "../types";
import { formatDate, formatCurrency } from "@/utils";

const { Text } = Typography;

export interface BookPurchasersProps {
  purchasedUsers?: IPurchasedUser[];
  totalPurchases?: number;
  loading?: boolean;
}

export function BookPurchasers({
  purchasedUsers = [],
  totalPurchases = 0,
  loading = false,
}: BookPurchasersProps) {
  const columns: ColumnsType<IPurchasedUser> = [
    {
      title: "Người dùng",
      dataIndex: "username",
      key: "username",
      render: (username: string, record: IPurchasedUser) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Avatar size="small" src={record.avatar || undefined}>
            {username?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
          <div>
            <div>
              <Text strong>{username}</Text>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {record.email}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      render: (orderCode: string) => <Text code>{orderCode}</Text>,
    },
    {
      title: "Giá mua",
      dataIndex: "pricePaid",
      key: "pricePaid",
      align: "right",
      render: (pricePaid: number) => (
        <Text strong>{formatCurrency(pricePaid)}</Text>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "purchasedAt",
      key: "purchasedAt",
      render: (purchasedAt: string) => formatDate(purchasedAt),
    },
  ];

  return (
    <Card
      title={`Danh sách người mua (${totalPurchases || purchasedUsers.length})`}
      bordered={false}
    >
      <Table
        columns={columns}
        dataSource={purchasedUsers}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50],
          showTotal: (total, range) =>
            `Hiển thị ${range[0]} - ${range[1]} trên ${total} người`,
        }}
        locale={{
          emptyText: "Chưa có người dùng nào mua truyện này.",
        }}
      />
    </Card>
  );
}
