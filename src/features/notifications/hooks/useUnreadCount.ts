import { useState, useEffect, useCallback } from "react";
import { notificationService } from "../services/notification.service";

export function useUnreadCount(refetchInterval = 30000) {
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success && response.data) {
        const count = (response.data as { count: number }).count || 0;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUnreadCount();

    // Auto-refetch every 30 seconds
    const interval = setInterval(() => {
      void fetchUnreadCount();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [fetchUnreadCount, refetchInterval]);

  return {
    unreadCount,
    loading,
    refetch: fetchUnreadCount,
  };
}
