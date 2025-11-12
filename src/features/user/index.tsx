import { Card, Typography, Empty } from "antd";
import "./user.scss";

const { Title, Text } = Typography;

export default function UserPage() {
  return (
    <div className="user-container">
      <div className="user-header">
        <Title level={2} style={{ margin: 0 }}>
          Người dùng
        </Title>
        <Text type="secondary">
          Quản lý danh sách người dùng và vai trò.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
