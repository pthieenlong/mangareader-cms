import { Avatar, Card, Empty, List, Space, Typography } from "antd";
import { ClockCircleOutlined, MessageOutlined } from "@ant-design/icons";
import type { IComment } from "../types";
import { formatDate } from "@/utils";

const { Text, Paragraph } = Typography;

export interface BookCommentsProps {
  comments?: IComment[];
  totalComments?: number;
  loading?: boolean;
}

export function BookComments({
  comments = [],
  totalComments = 0,
  loading = false,
}: BookCommentsProps) {
  return (
    <Card
      title={`Bình luận (${totalComments || comments.length})`}
      bordered={false}
    >
      {comments.length === 0 ? (
        <Empty description="Chưa có bình luận nào cho truyện này." />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={comments}
          loading={loading}
          pagination={{
            pageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: [5, 10, 20],
            showTotal: (total, range) =>
              `Hiển thị ${range[0]} - ${range[1]} trên ${total} bình luận`,
          }}
          renderItem={(comment) => (
            <List.Item key={comment.id}>
              <List.Item.Meta
                avatar={
                  <Avatar src={comment.user.avatar || undefined}>
                    {comment.user.username?.[0]?.toUpperCase() ?? "U"}
                  </Avatar>
                }
                title={
                  <Space>
                    <Text strong>{comment.user.username}</Text>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <ClockCircleOutlined /> {formatDate(comment.createdAt)}
                    </Text>
                  </Space>
                }
              />
              <Paragraph
                style={{
                  marginTop: 8,
                  marginLeft: 48,
                  whiteSpace: "pre-wrap",
                }}
              >
                {comment.content}
              </Paragraph>

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div style={{ marginLeft: 48, marginTop: 12 }}>
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      <MessageOutlined /> {comment.replies.length} phản hồi
                    </Text>
                    <List
                      dataSource={comment.replies}
                      renderItem={(reply) => (
                        <List.Item
                          key={reply.id}
                          style={{
                            padding: "12px 0",
                            borderBottom: "1px solid #f0f0f0",
                          }}
                        >
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                size="small"
                                src={reply.user.avatar || undefined}
                              >
                                {reply.user.username?.[0]?.toUpperCase() ?? "U"}
                              </Avatar>
                            }
                            title={
                              <Space>
                                <Text strong style={{ fontSize: 13 }}>
                                  {reply.user.username}
                                </Text>
                                <Text type="secondary" style={{ fontSize: 11 }}>
                                  <ClockCircleOutlined />{" "}
                                  {formatDate(reply.createdAt)}
                                </Text>
                              </Space>
                            }
                            description={
                              <Paragraph
                                style={{
                                  marginTop: 4,
                                  marginBottom: 0,
                                  fontSize: 13,
                                  whiteSpace: "pre-wrap",
                                }}
                              >
                                {reply.content}
                              </Paragraph>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Space>
                </div>
              )}
            </List.Item>
          )}
        />
      )}
    </Card>
  );
}
