import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  InboxOutlined,
  StopOutlined,
  UndoOutlined,
  ShoppingOutlined,
  StarOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Image,
  Input,
  List,
  Modal,
  Row,
  Space,
  Statistic,
  Tabs,
  Tag,
  Typography,
} from "antd";
import type { DescriptionsItemType } from "antd/es/descriptions";
import type {
  IBookDetail,
  IBookCategoryRelation,
  IChapterSummary,
} from "../types";
import { formatDate, FALLBACK_IMAGE, formatCurrency } from "@/utils";
import { BookPurchasers } from "./BookPurchasers";
import { BookReviews } from "./BookReviews";
import { BookComments } from "./BookComments";
import "./BookDetail.scss";

const { Title, Text, Paragraph } = Typography;

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
  onChapterDetail?: (chapter: IChapterSummary) => void;
  onPublish?: (payload?: { notes?: string }) => Promise<void> | void;
  onReject?: (payload: {
    reason: string;
    notes?: string;
  }) => Promise<void> | void;
  onArchive?: () => Promise<void> | void;
  onUnarchive?: () => Promise<void> | void;
  onDeleteComment?: (commentId: string, userId: string) => Promise<void>;
  actionLoading?: boolean;
  deleting?: boolean;
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

export function BookDetail({
  book,
  onBack,
  onChapterDetail,
  onPublish,
  onReject,
  onArchive,
  onUnarchive,
  onDeleteComment,
  actionLoading = false,
  deleting = false,
}: BookDetailProps) {
  const categories = getCategories(book.bookCategories);
  const [chapterPage, setChapterPage] = useState(1);
  const [chapterPageSize, setChapterPageSize] = useState(10);
  const [modalType, setModalType] = useState<
    "publish" | "reject" | "archive" | "unarchive" | null
  >(null);
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");

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
          Xem chương
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
            <Text type="secondary">
              Cập nhật: {formatDate(chapter.updatedAt)}
            </Text>
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
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            // disabled={book.status !== "PENDING"}
            onClick={() => {
              setModalType("publish");
              setNotes("");
            }}
          >
            Duyệt & xuất bản
          </Button>
          <Button
            danger
            icon={<StopOutlined />}
            disabled={book.status !== "PENDING"}
            onClick={() => {
              setModalType("reject");
              setRejectReason("");
              setNotes("");
            }}
          >
            Từ chối
          </Button>
          {book.status === "ARCHIVED" ? (
            <Button
              type="primary"
              icon={<UndoOutlined />}
              onClick={() => setModalType("unarchive")}
            >
              Khôi phục
            </Button>
          ) : (
            <Button
              icon={<InboxOutlined />}
              onClick={() => setModalType("archive")}
            >
              Lưu trữ
            </Button>
          )}
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
                  categories.map((category) => (
                    <Tag key={category.id}>{category.title}</Tag>
                  ))
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

      <Card
        title="Mô tả truyện"
        className="book-detail__section"
        bordered={false}
      >
        <Paragraph style={{ whiteSpace: "pre-wrap" }}>
          {book.description || "Chưa có mô tả cho truyện này."}
        </Paragraph>
      </Card>

      <Row gutter={[16, 16]} className="book-detail__content">
        <Col xs={24} lg={12}>
          <Tabs
            defaultActiveKey="purchasers"
            items={[
              {
                key: "purchasers",
                label: (
                  <span>
                    <ShoppingOutlined /> Người mua
                  </span>
                ),
                children: (
                  <BookPurchasers
                    purchasedUsers={book.purchasedUsers}
                    totalPurchases={book.totalPurchases}
                  />
                ),
              },
              {
                key: "reviews",
                label: (
                  <span>
                    <StarOutlined /> Đánh giá
                  </span>
                ),
                children: (
                  <BookReviews
                    reviews={book.reviews}
                    totalReviews={book.totalReviews}
                    averageRating={book.averageRating}
                  />
                ),
              },
              {
                key: "comments",
                label: (
                  <span>
                    <MessageOutlined /> Bình luận
                  </span>
                ),
                children: (
                  <BookComments
                    comments={book.comments}
                    totalComments={book.totalComments}
                    onDeleteComment={onDeleteComment}
                    deleting={deleting}
                  />
                ),
              },
            ]}
          />
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Danh sách chương"
            bordered={false}
            extra={<Tag color="geekblue">{totalChapters} chương</Tag>}
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
        </Col>
      </Row>

      <Modal
        open={modalType !== null}
        title={
          modalType === "publish"
            ? "Xác nhận xuất bản"
            : modalType === "reject"
            ? "Từ chối truyện"
            : modalType === "archive"
            ? "Lưu trữ truyện"
            : "Khôi phục truyện"
        }
        onCancel={() => {
          setModalType(null);
          setNotes("");
          setRejectReason("");
        }}
        onOk={async () => {
          if (!modalType) {
            return;
          }
          const trimmedNotes = notes.trim();
          if (modalType === "publish") {
            await onPublish?.({
              notes: trimmedNotes ? trimmedNotes : undefined,
            });
          } else if (modalType === "reject") {
            await onReject?.({
              reason: rejectReason.trim(),
              notes: trimmedNotes ? trimmedNotes : undefined,
            });
          } else if (modalType === "archive") {
            await onArchive?.();
          } else if (modalType === "unarchive") {
            await onUnarchive?.();
          }
          setModalType(null);
          setNotes("");
          setRejectReason("");
        }}
        okText={
          modalType === "publish"
            ? "Xuất bản"
            : modalType === "reject"
            ? "Từ chối"
            : modalType === "archive"
            ? "Lưu trữ"
            : "Khôi phục"
        }
        okButtonProps={{
          disabled: modalType === "reject" && !rejectReason.trim(),
        }}
        confirmLoading={actionLoading}
      >
        {modalType === "reject" ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input.TextArea
              placeholder="Lý do từ chối *"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              rows={3}
              required
            />
            <Input.TextArea
              placeholder="Ghi chú gửi Publisher (tùy chọn)"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              rows={3}
            />
          </Space>
        ) : modalType === "archive" || modalType === "unarchive" ? (
          <Paragraph>
            {modalType === "archive"
              ? "Bạn có chắc chắn muốn lưu trữ truyện này? Truyện sẽ không còn hiển thị cho người dùng."
              : "Bạn có chắc chắn muốn khôi phục truyện này? Truyện sẽ được hiển thị trở lại cho người dùng."}
          </Paragraph>
        ) : (
          <Input.TextArea
            placeholder="Ghi chú (tùy chọn)"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
          />
        )}
      </Modal>
    </div>
  );
}
