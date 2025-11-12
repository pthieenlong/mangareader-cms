import { Card, Typography, Empty } from "antd";
import "./content.scss";

const { Title, Text } = Typography;

export default function ContentPage() {
  return (
    <div className="content-container">
      <div className="content-header">
        <Title level={2} style={{ margin: 0 }}>
          Quản lý nội dung
        </Title>
        <Text type="secondary">
          Quản lý bài viết, trang, media và thẻ.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
