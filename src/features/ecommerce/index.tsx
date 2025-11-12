import { Card, Typography, Empty } from "antd";
import "./ecommerce.scss";

const { Title, Text } = Typography;

export default function EcommercePage() {
  return (
    <div className="ecommerce-container">
      <div className="ecommerce-header">
        <Title level={2} style={{ margin: 0 }}>
          E-commerce
        </Title>
        <Text type="secondary">
          Quản lý cửa hàng, đơn hàng và thanh toán.
        </Text>
      </div>
      <Card>
        <Empty description="Nội dung sẽ được bổ sung sau." />
      </Card>
    </div>
  );
}
