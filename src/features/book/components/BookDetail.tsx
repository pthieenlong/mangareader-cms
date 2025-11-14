import { useEffect, useMemo, useState } from "react";
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Col, Descriptions, Divider, Image, List, Row, Space, Statistic, Tag, Typography } from "antd";
import type { DescriptionsItemType } from "antd/es/descriptions";
import type { IBookDetail, IBookCategoryRelation, IChapterSummary } from "../types";
import { formatCurrency, formatDate } from "@/lib/utils";
import "./BookDetail.scss";

const { Title, Text, Paragraph } = Typography;

const FALLBACK_IMAGE =
  "data:image/png;base64,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iAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==";

const statusColorMap: Record<string, string> = {
  DRAFT: "default",
  PUBLISHED: "success",
  ARCHIVED: "error",
  PENDING: "warning",
};

const chapterStatusColorMap: Record<string, string> = {
  PENDING: "warning",
  DRAFT: "default",
  PUBLISHED: "success",
  ARCHIVED: "error",
};

const chapterStatusLabelMap: Record<string, string> = {
  PENDING: "Đang chờ",
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã phát hành",
  ARCHIVED: "Đã lưu trữ",
};

export interface BookDetailProps {
  book: IBookDetail;
  onBack: () => void;
  onEdit?: (book: IBookDetail) => void;
  onDelete?: (book: IBookDetail) => void;
  onChapterDetail?: (chapter: IChapterSummary) => void;
}

const getCategories = (bookCategories?: IBookCategoryRelation[]) =>
  bookCategories?.map((bc) => bc.category) ?? [];

const renderPrice = (book: IBookDetail) => {
  if (book.isFree) {
    return <Tag color="success">Miễn phí</Tag>;
  }
  if (book.isOnSale) {
    const salePrice = book.price * (1 - book.salePercent / 100);
    return (
      <Space direction="vertical" size={0} className="book-detail__price">
        <Text delete type="secondary">
          {formatCurrency(book.price)}
        </Text>
        <Text type="danger">{formatCurrency(salePrice)}</Text>
        <Tag color="magenta">Giảm {book.salePercent}%</Tag>
      </Space>
    );
  }
  return <Text strong>{formatCurrency(book.price)}</Text>;
};

const buildMetaItems = (book: IBookDetail): DescriptionsItemType[] => [
  {
    key: "author",
    label: "Tác giả",
    children: book.author || "Đang cập nhật",
  },
  {
    key: "publisher",
    label: "Nhà xuất bản",
    children: (
      <Space>
        <Avatar size="small" src={book.publisher?.avatar || undefined}>
          {book.publisher?.username?.[0]?.toUpperCase() ?? "U"}
        </Avatar>
        <Text>{book.publisher?.username ?? "Không xác định"}</Text>
      </Space>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    children: formatDate(book.createdAt),
  },
  {
    key: "updatedAt",
    label: "Cập nhật gần nhất",
    children: formatDate(book.updatedAt),
  },
  {
    key: "view",
    label: "Lượt xem",
    children: book.view.toLocaleString("vi-VN"),
  },
  {
    key: "like",
    label: "Lượt yêu thích",
    children: book.likeCount.toLocaleString("vi-VN"),
  },
  {
    key: "policy",
    label: "Chính sách",
    children: book.policy || "Đang cập nhật",
    span: 2,
  },
];

export function BookDetail({ book, onBack, onEdit, onDelete, onChapterDetail }: BookDetailProps) {
  const categories = getCategories(book.bookCategories);
  const [chapterPage, setChapterPage] = useState(1);
  const [chapterPageSize, setChapterPageSize] = useState(10);

  useEffect(() => {
    setChapterPage(1);
  }, [book.id]);

  const totalChapters = book.chapterCount ?? book.chapters?.length ?? 0;

  const paginatedChapters = useMemo(() => {
    if (!book.chapters) {
      return [];
    }
    const startIndex = (chapterPage - 1) * chapterPageSize;
    return book.chapters.slice(startIndex, startIndex + chapterPageSize);
  }, [book.chapters, chapterPage, chapterPageSize]);
  const renderChapterItem = (chapter: IChapterSummary) => (
    <List.Item
      key={chapter.id}
      actions={[
        <Button
          key="detail"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => onChapterDetail?.(chapter)}
        >
          Quản lý chương
        </Button>,
      ]}
    >
      <List.Item.Meta
        title={
          <Space>
            <Tag color="blue">#{chapter.chapterNumber}</Tag>
            <Text strong>{chapter.title}</Text>
            {chapter.isFree ? <Tag color="green">Miễn phí</Tag> : null}
            <Tag color={chapterStatusColorMap[chapter.status]}>
              {chapterStatusLabelMap[chapter.status]}
            </Tag>
          </Space>
        }
        description={
          <Space split={<Divider type="vertical" />} wrap>
            <Text type="secondary">Slug: {chapter.slug}</Text>
            <Text type="secondary">Tạo: {formatDate(chapter.createdAt)}</Text>
            <Text type="secondary">Cập nhật: {formatDate(chapter.updatedAt)}</Text>
          </Space>
        }
      />
    </List.Item>
  );

  return (
    <div className="book-detail">
      <div className="book-detail__actions">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            Quay lại
          </Button>
          <Title level={3} style={{ margin: 0 }}>
            Chi tiết truyện
          </Title>
        </Space>
        <Space>
          <Button icon={<EditOutlined />} onClick={() => onEdit?.(book)}>
            Chỉnh sửa
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={() => onDelete?.(book)}>
            Xóa truyện
          </Button>
        </Space>
      </div>

      <Card className="book-detail__header" bordered={false}>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} lg={6}>
            <Image
              src={book.thumbnail || undefined}
              alt={`Ảnh bìa ${book.title}`}
              width="100%"
              style={{ objectFit: "cover", borderRadius: 8 }}
              fallback={FALLBACK_IMAGE}
            />
          </Col>
          <Col xs={24} md={16} lg={18}>
            <Space direction="vertical" size={16} style={{ width: "100%" }}>
              <Space className="book-detail__title" wrap>
                <Title level={2} style={{ margin: 0 }}>
                  {book.title}
                </Title>
                <Tag color={statusColorMap[book.status]}>{book.status}</Tag>
              </Space>
              <div className="book-detail__price">
                <Text type="secondary">Giá bán:</Text>
                {renderPrice(book)}
              </div>
              <div className="book-detail__categories">
                <Text type="secondary">Thể loại:</Text>
                {categories.length ? (
                  categories.map((category) => <Tag key={category.id}>{category.title}</Tag>)
                ) : (
                  <Tag>Chưa phân loại</Tag>
                )}
              </div>
              <Descriptions
                items={buildMetaItems(book)}
                column={{ xs: 1, sm: 1, md: 2, lg: 3 }}
                layout="vertical"
                bordered
              />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} className="book-detail__stats">
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Tổng chương"
              value={book.chapterCount ?? book.chapters?.length ?? 0}
              suffix="chương"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Doanh thu"
              value={book.totalRevenue ?? 0}
              formatter={(value) => formatCurrency(Number(value))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Số lượt đánh giá"
              value={book.totalReviews ?? 0}
              suffix="đánh giá"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false}>
            <Statistic
              title="Điểm trung bình"
              value={book.averageRating ?? 0}
              precision={1}
              suffix="/5"
            />
          </Card>
        </Col>
      </Row>

      <Card title="Mô tả truyện" className="book-detail__section" bordered={false}>
        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
          {book.description || "Chưa có mô tả cho truyện này."}
        </Paragraph>
      </Card>

      <Card
        title="Danh sách chương"
        className="book-detail__section"
        bordered={false}
        extra={
          <Tag color="geekblue">
            {totalChapters} chương
          </Tag>
        }
      >
        <List
          dataSource={paginatedChapters}
          renderItem={renderChapterItem}
          locale={{ emptyText: "Chưa có chương nào được tạo." }}
          pagination={
            totalChapters > 0
              ? {
                  current: chapterPage,
                  pageSize: chapterPageSize,
                  total: totalChapters,
                  showSizeChanger: true,
                  pageSizeOptions: [5, 10, 20, 50],
                  showTotal: (total, range) =>
                    `Hiển thị ${range[0]} - ${range[1]} trên ${total} chương`,
                  onChange: (page, pageSize) => {
                    setChapterPage(page);
                    setChapterPageSize(pageSize);
                  },
                  onShowSizeChange: (page, pageSize) => {
                    setChapterPage(page);
                    setChapterPageSize(pageSize);
                  },
                  size: "small",
                }
              : false
          }
        />
      </Card>
    </div>
  );
}


