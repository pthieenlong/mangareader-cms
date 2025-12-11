import { Card, List, Spin, Tag } from "antd";
import type { IUserFavoriteBook } from "../types";
import { formatCurrency } from "@/utils";

interface UserFavoriteBooksListProps {
  books: IUserFavoriteBook[];
  loading: boolean;
}

export function UserFavoriteBooksList({
  books,
  loading,
}: UserFavoriteBooksListProps) {
  return (
    <Card title="Danh sách truyện yêu thích">
      <Spin spinning={loading}>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
          dataSource={books}
          locale={{ emptyText: "Chưa có truyện yêu thích." }}
          renderItem={(item: IUserFavoriteBook) => (
            <List.Item key={item.id}>
              <Card
                cover={
                  item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      style={{
                        height: 180,
                        width: 320,
                        objectFit: "cover",
                      }}
                    />
                  ) : null
                }
                style={{ width: 320, minWidth: 320, maxWidth: 320 }}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <span>Tác giả: {item.author || "Đang cập nhật"}</span>
                      <span>
                        Thể loại:{" "}
                        {item.bookCategories
                          ?.map((cat) => cat.category.title)
                          .join(", ") || "Chưa có"}
                      </span>
                      <span>
                        Giá:{" "}
                        {item.isFree ? (
                          <Tag color="green">Miễn phí</Tag>
                        ) : (
                          formatCurrency(item.price)
                        )}
                      </span>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </Spin>
    </Card>
  );
}
