import { List, Typography, Button, Empty, Spin, Space, Tag } from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  BookOutlined,
  FileTextOutlined,
  CommentOutlined,
  StarOutlined,
  ShoppingCartOutlined,
  CreditCardOutlined,
  UserAddOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useNotifications } from "../hooks/useNotifications";
import { notificationService } from "../services/notification.service";
import type { INotification } from "../types";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const { Text } = Typography;

interface NotificationDropdownProps {
  onClose: () => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "NEW_BOOK":
      return <BookOutlined style={{ color: "#1890ff" }} />;
    case "NEW_CHAPTER":
      return <FileTextOutlined style={{ color: "#52c41a" }} />;
    case "NEW_COMMENT":
      return <CommentOutlined style={{ color: "#fa8c16" }} />;
    case "NEW_REVIEW":
      return <StarOutlined style={{ color: "#faad14" }} />;
    case "NEW_ORDER":
      return <ShoppingCartOutlined style={{ color: "#13c2c2" }} />;
    case "ORDER_CANCELLED":
      return <ShoppingCartOutlined style={{ color: "#f5222d" }} />;
    case "NEW_SUBSCRIPTION":
      return <CreditCardOutlined style={{ color: "#722ed1" }} />;
    case "SUBSCRIPTION_RENEWED":
      return <CreditCardOutlined style={{ color: "#722ed1" }} />;
    case "PUBLISHER_APPLICATION":
      return <UserAddOutlined style={{ color: "#eb2f96" }} />;
    default:
      return <BellOutlined style={{ color: "#8c8c8c" }} />;
  }
};

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const { notifications, loading, refetch } = useNotifications({
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId);
    try {
      await notificationService.markAsRead(notificationId);
      await refetch();
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setMarkingAsRead(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAllAsRead(true);
    try {
      await notificationService.markAllAsRead();
      await refetch();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      await refetch();
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const handleNotificationClick = async (notification: INotification) => {
    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }
    // Admin notifications don't navigate anywhere
    onClose();
  };

  return (
    <div style={{ width: "100%", maxHeight: 500, overflow: "hidden" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text strong>Thông báo</Text>
        {notifications.length > 0 && (
          <Button
            type="link"
            size="small"
            onClick={handleMarkAllAsRead}
            loading={markingAllAsRead}
          >
            Đánh dấu tất cả đã đọc
          </Button>
        )}
      </div>

      <div style={{ maxHeight: 400, overflow: "auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin />
          </div>
        ) : notifications.length === 0 ? (
          <Empty
            description="Không có thông báo"
            style={{ padding: 40 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <List
            dataSource={notifications}
            renderItem={(notification) => (
              <List.Item
                key={notification.id}
                style={{
                  padding: "12px 16px",
                  backgroundColor: notification.isRead ? "white" : "#f6ffed",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                }}
                onClick={() => handleNotificationClick(notification)}
                actions={[
                  !notification.isRead && (
                    <Button
                      type="text"
                      size="small"
                      icon={<CheckOutlined />}
                      loading={markingAsRead === notification.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      title="Đánh dấu đã đọc"
                    />
                  ),
                  <Button
                    type="text"
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    title="Xóa"
                  />,
                ].filter(Boolean)}
              >
                <List.Item.Meta
                  avatar={getNotificationIcon(notification.type)}
                  title={
                    <Space size={4} direction="vertical" style={{ width: "100%" }}>
                      <Text strong={!notification.isRead}>
                        {notification.title}
                      </Text>
                      {!notification.isRead && (
                        <Tag color="green" style={{ marginLeft: 0 }}>
                          Mới
                        </Tag>
                      )}
                    </Space>
                  }
                  description={
                    <Space size={4} direction="vertical" style={{ width: "100%" }}>
                      <Text type="secondary" style={{ fontSize: 13 }}>
                        {notification.body}
                      </Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                          locale: vi,
                        })}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}
