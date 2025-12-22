import { Avatar, Card, Empty, List, Rate, Space, Tag, Typography } from "antd";
import {
  LikeOutlined,
  BookOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import type { IReview } from "../types";
import { formatDate } from "@/utils";

const { Text, Paragraph } = Typography;

export interface BookReviewsProps {
  reviews?: IReview[];
  totalReviews?: number;
  averageRating?: number;
  loading?: boolean;
}

export function BookReviews({
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  loading = false,
}: BookReviewsProps) {
  return (
    <Card
      title={
        <Space>
          <span>Đánh giá ({totalReviews || reviews.length})</span>
          {averageRating > 0 && (
            <Tag color="gold">
              <Rate disabled value={averageRating} allowHalf /> (
              {averageRating.toFixed(1)}/5)
            </Tag>
          )}
        </Space>
      }
      bordered={false}
    >
      {reviews.length === 0 ? (
        <Empty description="Chưa có đánh giá nào cho truyện này." />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={reviews}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            showTotal: (total, range) =>
              `Hiển thị ${range[0]} - ${range[1]} trên ${total} đánh giá`,
          }}
          renderItem={(review) => (
            <List.Item
              key={review.id}
              extra={
                <Space direction="vertical" align="end" size="small">
                  <Rate disabled value={review.ratePoint} allowHalf />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {review.ratePoint}/5
                  </Text>
                </Space>
              }
            >
              <List.Item.Meta
                avatar={
                  <Avatar src={review.user.avatar || undefined}>
                    {review.user.username?.[0]?.toUpperCase() ?? "U"}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong>{review.user.username}</Text>
                  </Space>
                }
                description={
                  <Space split="|" size="small" wrap>
                    <Space size={4}>
                      <ClockCircleOutlined />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDate(review.createdAt)}
                      </Text>
                    </Space>
                    <Space size={4}>
                      <BookOutlined />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Đọc đến chương {review.chapterNumberAtReview}
                      </Text>
                    </Space>
                    <Space size={4}>
                      <LikeOutlined />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {review.agreement} đồng ý
                      </Text>
                    </Space>
                  </Space>
                }
              />
              <Paragraph
                style={{
                  marginTop: 12,
                  marginLeft: 48,
                  whiteSpace: "pre-wrap",
                }}
              >
                {review.content}
              </Paragraph>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
