import { Space, Tag, Typography, Image, Avatar, Tooltip, Button } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { IBook, BookStatus } from "../types";
import { PriceTag } from "@/components";
import {
  formatDate,
  getBookStatusColor,
  FALLBACK_IMAGE,
  getBookStatusText,
} from "@/utils";
import { router } from "@/app/router.instance";

const { Text } = Typography;

interface GetColumnsOptions {
  onViewDetail: (book: IBook) => void;
}

export function getBookListColumns(
  options: GetColumnsOptions
): ColumnsType<IBook> {
  const { onViewDetail } = options;

  return [
    {
      title: "#",
      width: 40,
      render: (_: unknown, __: IBook, index: number) => index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      width: 100,
      render: (thumbnail: string | null) => (
        <Image
          src={thumbnail || undefined}
          alt="Book thumbnail"
          width={60}
          height={80}
          style={{ objectFit: "cover" }}
          fallback={FALLBACK_IMAGE}
        />
      ),
    },
    {
      title: "Tên",
      key: "name",
      render: (_: unknown, book: IBook) => (
        <Space direction="vertical" size={4}>
          <Typography.Link
            onClick={() => onViewDetail(book)}
            style={{ cursor: "pointer" }}
          >
            {book.title}
          </Typography.Link>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            ID: {book.id}
          </Text>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "bookCategories",
      render: (bookCategories?: IBook["bookCategories"]) => (
        <Space size={[0, 4]} wrap>
          {bookCategories?.map((categoryRelation) => {
            const category = categoryRelation.category;
            return <Tag key={category.id}>{category.title}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      render: (publisher?: IBook["publisher"]) => (
        <Space>
          <Avatar src={publisher?.avatar || undefined} size="small">
            {publisher?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography.Text>{publisher?.username || "-"}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Giá",
      key: "price",
      width: "120px",
      align: "right",
      render: (_: unknown, book: IBook) => (
        <PriceTag
          price={book.price}
          isFree={book.isFree}
          isOnSale={book.isOnSale}
          salePercent={book.salePercent}
          freeLabel="Free"
          showSaleTag={false}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: BookStatus) => (
        <Tag color={getBookStatusColor(status)}>
          {getBookStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updatedAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      render: (_: unknown, book: IBook) => (
        <Tooltip title="Xem chi tiết truyện">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => onViewDetail(book)}
          >
            Xem
          </Button>
        </Tooltip>
      ),
    },
  ];
}

// Navigation helper
export function navigateToBookDetail(book: IBook) {
  router.navigate({
    to: "/book/$slug",
    params: { slug: book.slug },
  } as never);
}
