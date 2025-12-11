import { Table, Tag, Image, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { IPublisherBook } from "../../types";
import { formatDate } from "@/utils";

interface BookTableProps {
  books: IPublisherBook[];
  loading?: boolean;
}

export function BookTable({ books, loading = false }: BookTableProps) {
  const columns: ColumnsType<IPublisherBook> = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 120,
      render: (value: string | undefined, record) =>
        value ? (
          <Image
            src={value}
            alt={record.title}
            width={80}
            height={80}
            style={{ objectFit: "cover", borderRadius: 4 }}
            preview={false}
          />
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 4,
              background: "#f5f5f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              color: "#999",
            }}
          >
            No Image
          </div>
        ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value: string, record) => (
        <Space direction="vertical" size={4}>
          <Typography.Text strong>{value}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.id}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      key: "author",
      render: (value?: string) => value || "Đang cập nhật",
    },
    {
      title: "Thể loại",
      dataIndex: "categories",
      key: "categories",
      render: (value?: string[]) =>
        value && value.length ? value.join(", ") : "Chưa có",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value: string) => (
        <Tag
          color={
            value === "PUBLISHED"
              ? "success"
              : value === "PENDING"
              ? "warning"
              : "default"
          }
        >
          {value}
        </Tag>
      ),
      width: 140,
    },
    {
      title: "Lượt xem",
      dataIndex: "view",
      key: "view",
      width: 120,
      render: (value?: number) => value ?? 0,
    },
    {
      title: "Lượt thích",
      dataIndex: "likeCount",
      key: "likeCount",
      width: 120,
      render: (value?: number) => value ?? 0,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (value?: string) => (value ? formatDate(value) : "-"),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={books}
      rowKey="id"
      loading={loading}
      pagination={false}
      locale={{ emptyText: "Chưa có truyện nào." }}
      scroll={{ x: 900 }}
    />
  );
}
