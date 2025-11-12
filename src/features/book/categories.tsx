import { Card, Typography, Empty } from "antd";
import "./categories.scss";

const { Title, Text } = Typography;

export default function BookCategoriesPage() {
  return (
    <div className="categories-container">
      <div className="categories-header">
        <Title level={2} style={{ margin: 0 }}>
          Danh mục sách
        </Title>
        <Text type="secondary">
          Quản lý phân loại, thể loại và tag của sách.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
