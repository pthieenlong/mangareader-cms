import { Col, Row, Space } from "antd";
import type {
  IUserFavoriteBook,
  IUserProfileDetail,
  IUserProfileUpdatePayload,
  IUserPurchasedOrder,
  IUserStatistics,
} from "../../types";
import { OrdersSection } from "../orders-section/OrdersSection";
import { ProfileCard } from "../profile-card/ProfileCard";
import { StatsCards } from "../stats-cards/StatsCards";
import { UserFavoriteBooksList } from "../UserFavoriteBooksList";

interface UserDetailViewProps {
  profile: IUserProfileDetail;
  stats?: IUserStatistics | null;
  statsLoading?: boolean;
  overviewLoading?: boolean;
  favorites: IUserFavoriteBook[];
  favoritesLoading?: boolean;
  orders: IUserPurchasedOrder[];
  ordersLoading?: boolean;
  ordersPagination: {
    page: number;
    limit: number;
    totalOrders: number;
  };
  onOrdersPageChange: (page: number, pageSize?: number) => void;
  onUpdateProfile: (payload: IUserProfileUpdatePayload) => Promise<void>;
  onUpdateAvatar: (avatar: File) => Promise<void>;
  onBanUser: () => Promise<void>;
  onUnbanUser: () => Promise<void>;
  onViewOrder: (order: IUserPurchasedOrder) => void;
  saving: boolean;
  banning: boolean;
  updatingAvatar: boolean;
}

export function UserDetailView({
  profile,
  stats,
  statsLoading,
  overviewLoading,
  favorites,
  favoritesLoading = false,
  orders,
  ordersLoading,
  ordersPagination,
  onOrdersPageChange,
  onUpdateAvatar,
  onUpdateProfile,
  onBanUser,
  onUnbanUser,
  onViewOrder,
  saving,
  banning,
  updatingAvatar,
}: UserDetailViewProps) {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <section>
        <StatsCards
          userStatistics={stats}
          statisticsLoading={statsLoading}
          overviewLoading={overviewLoading}
          isPublisher={false}
        />
      </section>

      <section>
        <Row gutter={16}>
          <Col xs={24} md={9}>
            <ProfileCard
              profile={profile}
              saving={saving}
              banning={banning}
              updatingAvatar={updatingAvatar}
              onUpdateProfile={onUpdateProfile}
              onUpdateAvatar={onUpdateAvatar}
              onBanUser={onBanUser}
              onUnbanUser={onUnbanUser}
            />
          </Col>
          <Col xs={24} md={15}>
            <OrdersSection
              title="Lịch sử đơn hàng"
              orders={orders}
              loading={ordersLoading}
              pagination={ordersPagination}
              onPageChange={onOrdersPageChange}
              onViewOrder={onViewOrder}
            />
          </Col>
        </Row>
      </section>

      <section>
        <UserFavoriteBooksList books={favorites} loading={favoritesLoading} />
      </section>
    </Space>
  );
}
