import { Empty, Spin } from "antd";
import { useParams, useRouter } from "@tanstack/react-router";
import { useUserProfile } from "./hooks/useUserProfile";
import { useDetailUserStatistics } from "./hooks/useDetailUserStatistics";
import { useUserPurchasedOrders } from "./hooks/useUserPurchasedOrders";
import { usePublisherOrders } from "./hooks/usePublisherOrders";
import { useUserFavoriteBooks } from "./hooks/useUserFavoriteBooks";
import {
  UserDetailHeader,
  UserDetailView,
  PublisherDetailView,
} from "./components";
import type { IUserPurchasedOrder } from "./types";
import { UserRole } from "./types";
import { message } from "antd";
import "./user-detail.scss";

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams({ strict: false }) as { id?: string };
  const userId = params.id;

  const {
    loading,
    saving,
    banning,
    updatingAvatar,
    overview,
    profile,
    publisherBooks,
    updateProfile,
    updateAvatar,
    refresh,
    banUser,
    unbanUser,
  } = useUserProfile(userId);

  // Chỉ fetch statistics khi profile đã được load và user không phải PUBLISHER
  const shouldFetchStatistics = profile && profile.role !== UserRole.PUBLISHER;

  const {
    data: userStatistics,
    loading: statisticsLoading,
    refetch: refetchStatistics,
  } = useDetailUserStatistics(shouldFetchStatistics ? userId : undefined);

  const {
    orders: purchasedOrders,
    loading: purchasedOrdersLoading,
    pagination: purchasedOrdersPagination,
    updateParams: updatePurchasedOrdersParams,
  } = useUserPurchasedOrders(userId);

  const {
    orders: publisherOrders,
    loading: publisherOrdersLoading,
    pagination: publisherOrdersPagination,
    updateParams: updatePublisherOrdersParams,
    refetch: refetchPublisherOrders,
  } = usePublisherOrders(
    profile?.role === UserRole.PUBLISHER ? userId : undefined
  );

  const {
    books: favoriteBooks,
    loading: favoriteBooksLoading,
    refetch: refetchFavoriteBooks,
  } = useUserFavoriteBooks(
    !profile || profile.role !== UserRole.PUBLISHER ? userId : undefined
  );

  const isPublisher = profile?.role === UserRole.PUBLISHER;

  const handleRefresh = () => {
    refresh();
    refetchStatistics();
    refetchFavoriteBooks();
    void refetchPublisherOrders();
  };

  const handleViewOrder = (order: IUserPurchasedOrder) => {
    if (!userId || !order.id) {
      message.warning("Thiếu thông tin để mở chi tiết đơn hàng.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void (router as any).navigate({
      to: "/order/$userId/$orderId",
      params: { userId, orderId: order.id },
    });
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    if (isPublisher) {
      updatePublisherOrdersParams({
        page,
        limit: pageSize,
      });
    } else {
      updatePurchasedOrdersParams({
        page,
        limit: pageSize,
      });
    }
  };

  if (!userId) {
    return (
      <Empty description="Không tìm thấy người dùng, vui lòng quay lại danh sách." />
    );
  }

  return (
    <div className="user-detail-page">
      <UserDetailHeader
        onRefresh={handleRefresh}
        loading={loading || statisticsLoading || favoriteBooksLoading}
      />

      <Spin spinning={loading}>
        {profile ? (
          isPublisher ? (
            <PublisherDetailView
              profile={profile}
              overview={
                overview && "totalRevenue" in overview ? overview : undefined
              }
              overviewLoading={loading}
              books={publisherBooks}
              booksLoading={loading}
              orders={publisherOrders}
              ordersLoading={publisherOrdersLoading}
              ordersPagination={publisherOrdersPagination}
              onOrdersPageChange={handlePageChange}
              onUpdateProfile={updateProfile}
              onUpdateAvatar={updateAvatar}
              onBanUser={banUser}
              onUnbanUser={unbanUser}
              saving={saving}
              banning={banning}
              updatingAvatar={updatingAvatar}
            />
          ) : (
            <UserDetailView
              profile={profile}
              stats={userStatistics}
              statsLoading={statisticsLoading}
              favorites={favoriteBooks}
              favoritesLoading={favoriteBooksLoading}
              orders={purchasedOrders}
              ordersLoading={purchasedOrdersLoading}
              ordersPagination={purchasedOrdersPagination}
              onOrdersPageChange={handlePageChange}
              onUpdateProfile={updateProfile}
              onUpdateAvatar={updateAvatar}
              onBanUser={banUser}
              onUnbanUser={unbanUser}
              onViewOrder={handleViewOrder}
              saving={saving}
              banning={banning}
              updatingAvatar={updatingAvatar}
            />
          )
        ) : (
          <Empty description="Không tìm thấy dữ liệu người dùng." />
        )}
      </Spin>
    </div>
  );
}
