import { Card, Typography, Table, Space, Avatar, Tag, Image } from "antd";
import type { ColumnsType } from "antd/es/table";
import { usePendingPublishers } from "./hooks/usePendingPublishers";
import type { IPublisherApplication } from "./types";
import { AccountStatus } from "./types";
import { formatDate } from "@/utils";
import "./publisher.scss";

const { Title, Text } = Typography;

const getAccountStatusColor = (status: AccountStatus): string => {
  const colors = {
    [AccountStatus.ACTIVE]: "success",
    [AccountStatus.INACTIVE]: "default",
    [AccountStatus.BANNED]: "error",
    [AccountStatus.PENDING]: "warning",
  };
  return colors[status] || "default";
};

const getAccountStatusText = (status: AccountStatus): string => {
  const texts = {
    [AccountStatus.ACTIVE]: "Hoạt động",
    [AccountStatus.INACTIVE]: "Không hoạt động",
    [AccountStatus.BANNED]: "Bị khóa",
    [AccountStatus.PENDING]: "Đang chờ",
  };
  return texts[status] || status;
};

export default function PendingPublishersPage() {
  const { applications, loading, pagination, handlePageChange } =
    usePendingPublishers();

  const columns: ColumnsType<IPublisherApplication> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: IPublisherApplication, index: number) => {
        const currentPage = pagination.page || 1;
        const pageSize = pagination.limit || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Người dùng",
      key: "user",
      width: 300,
      render: (_: unknown, record: IPublisherApplication) => (
        <Space size={12}>
          <Avatar src={record.user.avatar} size={48}>
            {record.user.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Space direction="vertical" size={2}>
            <Text strong>{record.user.username}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.user.email}
            </Text>
            <Tag
              color={getAccountStatusColor(record.user.accountStatus)}
              style={{ marginTop: 4 }}
            >
              {getAccountStatusText(record.user.accountStatus)}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "CCCD",
      dataIndex: "cccdNumber",
      key: "cccdNumber",
      width: 150,
      render: (text: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
    },
    {
      title: "Quốc tịch",
      dataIndex: "nationality",
      key: "nationality",
      width: 120,
    },
    {
      title: "Quê quán",
      dataIndex: "placeOfOrigin",
      key: "placeOfOrigin",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Nơi cư trú",
      dataIndex: "placeOfResidence",
      key: "placeOfResidence",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Ngày hết hạn CCCD",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 140,
      render: (date: string) => formatDate(date),
    },
    {
      title: "CCCD mặt trước",
      dataIndex: "cccdFrontImage",
      key: "cccdFrontImage",
      width: 150,
      render: (url: string) => (
        <Image
          src={url}
          alt="CCCD mặt trước"
          width={100}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      title: "CCCD mặt sau",
      dataIndex: "cccdBackImage",
      key: "cccdBackImage",
      width: 150,
      render: (url: string) => (
        <Image
          src={url}
          alt="CCCD mặt sau"
          width={100}
          style={{ cursor: "pointer" }}
        />
      ),
    },
    {
      title: "Ngày nộp đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date: Date) => formatDate(date.toString()),
    },
  ];

  return (
    <div className="publisher-container">
      <div className="publisher-header">
        <Title level={2} style={{ margin: 0 }}>
          Publisher đang chờ phê duyệt
        </Title>
        <Text type="secondary">
          Danh sách các đơn đăng ký trở thành publisher đang chờ phê duyệt.
        </Text>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalItems,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} đơn đăng ký`,
            onChange: handlePageChange,
          }}
          scroll={{ x: 2000 }}
        />
      </Card>
    </div>
  );
}
