import { Card, Typography, Empty } from "antd";
import "./settings.scss";

const { Title, Text } = Typography;

export default function SettingsPage() {
  return (
    <div className="settings-container">
      <div className="settings-header">
        <Title level={2} style={{ margin: 0 }}>
          Cài đặt
        </Title>
        <Text type="secondary">
          Cấu hình hệ thống, tài khoản và quyền riêng tư.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
