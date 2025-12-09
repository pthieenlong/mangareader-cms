import { useCallback, useEffect, useMemo, useState } from "react";
import { message } from "antd";
import { userProfileService } from "../services/user-profile.service";
import type {
  IPublisherBook,
  IPublisherOverviewStats,
  IUserFavorite,
  IUserOrderHistory,
  IUserOverviewStats,
  IUserProfileDetail,
  IUserProfileUpdatePayload,
} from "../types";
import { UserRole } from "../types";

interface UseUserProfileResult {
  loading: boolean;
  saving: boolean;
  banning: boolean;
  updatingAvatar: boolean;
  overview: IUserOverviewStats | IPublisherOverviewStats | null;
  profile: IUserProfileDetail | null;
  orders: IUserOrderHistory[];
  favorites: IUserFavorite[];
  publisherBooks: IPublisherBook[];
  refresh: () => Promise<void>;
  updateProfile: (payload: IUserProfileUpdatePayload) => Promise<void>;
  updateAvatar: (avatar: File) => Promise<void>;
  banUser: () => Promise<void>;
  unbanUser: () => Promise<void>;
}

export function useUserProfile(userId?: string): UseUserProfileResult {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [banning, setBanning] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [overview, setOverview] = useState<
    IUserOverviewStats | IPublisherOverviewStats | null
  >(null);
  const [profile, setProfile] = useState<IUserProfileDetail | null>(null);
  const [orders, setOrders] = useState<IUserOrderHistory[]>([]);
  const [favorites, setFavorites] = useState<IUserFavorite[]>([]);
  const [publisherBooks, setPublisherBooks] = useState<IPublisherBook[]>([]);

  const fetchData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const profileData = await userProfileService.getUserProfile(userId);
      setProfile(profileData);

      // If user is publisher, fetch publisher-specific data
      if (profileData.role === UserRole.PUBLISHER) {
        const [publisherBooksData, publisherStatsData] = await Promise.all([
          userProfileService.getPublisherBooks(userId),
          userProfileService.getPublisherRevenueStats(userId),
        ]);
        setPublisherBooks(publisherBooksData);
        setOverview(publisherStatsData);
        setOrders([]);
        setFavorites([]);
      } else {
        // For regular users and admins, fetch normal data
        const [ordersData, favoritesData] = await Promise.all([
          userProfileService.getUserOrders(userId),
          userProfileService.getUserFavorites(userId),
        ]);
        setOrders(ordersData);
        setFavorites(favoritesData);
        setPublisherBooks([]);
        setOverview({
          totalSpend: ordersData.reduce(
            (sum, order) => sum + (order.totalAmount ?? 0),
            0
          ),
          purchasedCount: ordersData.length,
          favoriteCount: favoritesData.length,
          readingCount: profileData.readingCount ?? 0,
        });
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải dữ liệu người dùng, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const updateProfile = useCallback(
    async (payload: IUserProfileUpdatePayload) => {
      if (!userId) return;
      setSaving(true);
      try {
        const updatedProfile = await userProfileService.updateUserProfile(
          userId,
          payload
        );
        setProfile(updatedProfile);
        setOverview((prev) => {
          if (!prev) return null;
          // Only update readingCount if it's a user overview, not publisher
          if ("readingCount" in prev) {
            return {
              ...prev,
              readingCount:
                updatedProfile.readingCount ??
                (prev as IUserOverviewStats).readingCount,
            };
          }
          return prev;
        });
        message.success("Cập nhật thông tin người dùng thành công.");
      } catch (error) {
        console.error(error);
        message.error("Cập nhật thông tin người dùng thất bại.");
      } finally {
        setSaving(false);
      }
    },
    [userId]
  );

  const updateAvatar = useCallback(
    async (avatar: File) => {
      if (!userId) return;
      setUpdatingAvatar(true);
      try {
        const updatedProfile = await userProfileService.updateAvatar(
          userId,
          avatar
        );
        setProfile(updatedProfile);
        message.success("Cập nhật avatar thành công.");
      } catch (error) {
        console.error(error);
        message.error("Cập nhật avatar thất bại.");
      } finally {
        setUpdatingAvatar(false);
      }
    },
    [userId]
  );

  const banUser = useCallback(async () => {
    if (!userId) return;
    setBanning(true);
    try {
      const updatedProfile = await userProfileService.banUser(userId);
      setProfile(updatedProfile);
      message.success("Đã ban người dùng thành công.");
    } catch (error) {
      console.error(error);
      message.error("Không thể ban người dùng, vui lòng thử lại.");
    } finally {
      setBanning(false);
    }
  }, [userId]);

  const unbanUser = useCallback(async () => {
    if (!userId) return;
    setBanning(true);
    try {
      const updatedProfile = await userProfileService.unbanUser(userId);
      setProfile(updatedProfile);
      message.success("Đã unban người dùng thành công.");
    } catch (error) {
      console.error(error);
      message.error("Không thể unban người dùng, vui lòng thử lại.");
    } finally {
      setBanning(false);
    }
  }, [userId]);

  return useMemo(
    () => ({
      loading,
      saving,
      banning,
      updatingAvatar,
      overview,
      profile,
      orders,
      favorites,
      publisherBooks,
      refresh: fetchData,
      updateProfile,
      updateAvatar,
      banUser,
      unbanUser,
    }),
    [
      banUser,
      banning,
      favorites,
      fetchData,
      loading,
      orders,
      overview,
      profile,
      publisherBooks,
      saving,
      unbanUser,
      updateAvatar,
      updateProfile,
      updatingAvatar,
    ]
  );
}
