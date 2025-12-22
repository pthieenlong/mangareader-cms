import { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import { bookService } from "@/features/book/services/book.service";
import type { IBook } from "@/features/book/types";

export function usePendingBooks(limit: number = 5) {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPendingBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBooks({
        status: "PENDING",
        page: 1,
        pageSize: limit,
        sort: "latest",
      });
      if (response.success && response.data) {
        setBooks(response.data as IBook[]);
      } else {
        const errorMessage =
          response.message || "Không thể tải danh sách truyện chờ duyệt.";
        message.warning(errorMessage);
        setError(new Error(errorMessage));
      }
    } catch (err) {
      const errorMessage =
        (err as Error).message ||
        "Có lỗi xảy ra khi tải danh sách truyện chờ duyệt.";
      message.error(errorMessage);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void fetchPendingBooks();
  }, [fetchPendingBooks]);

  return {
    books,
    loading,
    error,
    refetch: fetchPendingBooks,
  };
}
