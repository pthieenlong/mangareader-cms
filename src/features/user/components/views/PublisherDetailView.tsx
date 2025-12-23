import { Col, Row, Space } from "antd";
import type {
  IPublisherBook,
  IPublisherOverviewStats,
  IUserProfileDetail,
} from "../../types";
import { BookTable } from "../book-table";
import { ProfileCard } from "../profile-card/ProfileCard";
import { StatsCards } from "../stats-cards/StatsCards";
import { OrdersSection } from "../orders-section/OrdersSection";
import type { IUserPurchasedOrder } from "../../types";

interface PublisherDetailViewProps {
  profile: IUserProfileDetail;
  overview?: IPublisherOverviewStats | null;
  overviewLoading?: boolean;
  books: IPublisherBook[];
  booksLoading?: boolean;
  orders: IUserPurchasedOrder[];
  ordersLoading?: boolean;
  ordersPagination: {
    page: number;
    limit: number;
    totalOrders: number;
  };
  onOrdersPageChange: (page: number, pageSize?: number) => void;
  onBanUser: () => Promise<void>;
  onUnbanUser: () => Promise<void>;
  banning: boolean;
}

export function PublisherDetailView({
  profile,
  overview,
  overviewLoading,
  books,
  booksLoading,
  orders,
  ordersLoading,
  ordersPagination,
  onOrdersPageChange,
  onBanUser,
  onUnbanUser,
  banning,
}: PublisherDetailViewProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <section>
        <StatsCards
          publisherOverview={overview}
          overviewLoading={overviewLoading}
          isPublisher
        />
      </section>

      <section>
        <Row gutter={16}>
          <Col xs={24} md={9}>
            <ProfileCard
              profile={profile}
              banning={banning}
              onBanUser={onBanUser}
              onUnbanUser={onUnbanUser}
            />
          </Col>
          <Col xs={24} md={15}>
            <OrdersSection
              title="Đơn hàng (Publisher)"
              orders={orders}
              loading={ordersLoading}
              pagination={ordersPagination}
              onPageChange={onOrdersPageChange}
              onViewOrder={undefined}
            />
          </Col>
        </Row>
      </section>

      <section>
        <BookTable books={books} loading={booksLoading} />
      </section>
    </Space>
  );
}
