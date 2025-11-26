import { useCallback, useEffect, useState } from "react";
import type { IBookDetail } from "../types";
import { bookService } from "../services/book.service";

interface UseBookDetailResult {
  book: IBookDetail | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBookDetail(slug?: string): UseBookDetailResult {
  const [book, setBook] = useState<IBookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetail = useCallback(async () => {
    if (!slug) {
      setBook(null);
      setError("Không xác định được truyện cần xem chi tiết.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await bookService.getBookBySlug(slug);
      if (response.success && response.data) {
        setBook(response.data as IBookDetail);
      } else {
        setBook(null);
        setError(response.message || "Không thể tải chi tiết truyện.");
      }
    } catch (err) {
      setBook(null);
      setError((err as Error).message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchBookDetail();
  }, [fetchBookDetail]);

  return {
    book,
    loading,
    error,
    refetch: fetchBookDetail,
  };
}
