import { Card, Typography, Empty } from "antd";
import "./notifications.scss";

const { Title, Text } = Typography;

export default function NotificationsPage() {
  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <Title level={2} style={{ margin: 0 }}>
          Thông báo
        </Title>
        <Text type="secondary">
          Quản lý thông báo hệ thống và cài đặt gửi thông báo.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
