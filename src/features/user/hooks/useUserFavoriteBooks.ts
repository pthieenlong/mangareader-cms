import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { userProfileService } from "../services/user-profile.service";
import type { IUserFavoriteBook } from "../types";

interface UseUserFavoriteBooksResult {
  books: IUserFavoriteBook[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useUserFavoriteBooks(
  userId?: string
): UseUserFavoriteBooksResult {
  const [books, setBooks] = useState<IUserFavoriteBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchFavoriteBooks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const favoriteBooks =
        await userProfileService.getUserFavoriteBooks(userId);
      setBooks(favoriteBooks);
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Không thể tải danh sách yêu thích.");
      setError(error);
      message.error("Không thể tải danh sách truyện yêu thích.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void fetchFavoriteBooks();
  }, [fetchFavoriteBooks]);

  return {
    books,
    loading,
    error,
    refetch: fetchFavoriteBooks,
  };
}


