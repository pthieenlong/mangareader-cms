import { Card, List, Tag } from "antd";
import type { IPublisherBook } from "../../types";
import { formatDate } from "@/utils";
import "./BookGrid.scss";

interface BookGridProps {
  books: IPublisherBook[];
  loading?: boolean;
  onSelect?: (book: IPublisherBook) => void;
}

export function BookGrid({
  books,
  loading = false,
  onSelect,
}: BookGridProps) {
  return (
    <Card title="Danh sách truyện đã đăng tải">
      <List
        className="book-grid"
        grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
        dataSource={books}
        locale={{ emptyText: "Chưa có truyện nào." }}
        loading={loading}
        renderItem={(item: IPublisherBook) => (
          <List.Item key={item.id}>
            <Card
              className="book-grid__card"
              hoverable={Boolean(onSelect)}
              onClick={() => onSelect?.(item)}
              cover={
                item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="book-grid__thumbnail"
                  />
                ) : null
              }
            >
              <Card.Meta
                title={item.title}
                description={
                  <div className="book-grid__meta">
                    <span>Tác giả: {item.author || "Đang cập nhật"}</span>
                    <span>
                      Thể loại: {item.categories.join(", ") || "Chưa có"}
                    </span>
                    <span>
                      Trạng thái:{" "}
                      <Tag
                        color={
                          item.status === "PUBLISHED"
                            ? "success"
                            : item.status === "PENDING"
                            ? "warning"
                            : "default"
                        }
                      >
                        {item.status}
                      </Tag>
                    </span>
                    <span>
                      Lượt xem: {item.view ?? 0} | Lượt thích:{" "}
                      {item.likeCount ?? 0}
                    </span>
                    <span>
                      Ngày tạo:{" "}
                      {item.createdAt ? formatDate(item.createdAt) : "-"}
                    </span>
                  </div>
                }
              />
            </Card>
          </List.Item>
        )}
      />
    </Card>
  );
}

