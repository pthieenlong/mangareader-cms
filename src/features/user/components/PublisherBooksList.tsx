import { Card, List, Tag } from "antd";
import type { IPublisherBook } from "../types";
import { formatDate } from "@/utils";

interface PublisherBooksListProps {
  books: IPublisherBook[];
  loading?: boolean;
}

export function PublisherBooksList({
  books,
  loading = false,
}: PublisherBooksListProps) {
  return (
    <Card title="Danh sách truyện đã đăng tải">
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
        dataSource={books}
        locale={{ emptyText: "Chưa có truyện nào." }}
        loading={loading}
        renderItem={(item: IPublisherBook) => (
          <List.Item key={item.id}>
            <Card
              cover={
                item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    style={{
                      height: 180,
                      width: 180,
                      objectFit: "cover",
                    }}
                  />
                ) : null
              }
            >
              <Card.Meta
                title={item.title}
                description={
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
                      Lượt xem: {item.view ?? 0} | Lượt thích: {item.likeCount ?? 0}
                    </span>
                    <span>
                      Ngày tạo: {item.createdAt ? formatDate(item.createdAt) : "-"}
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


