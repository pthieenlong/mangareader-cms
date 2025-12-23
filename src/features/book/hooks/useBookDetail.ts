import { useCallback, useEffect, useState } from "react";
import { message } from "antd";
import type { IBookDetail } from "../types";
import { bookService } from "../services/book.service";

interface UseBookDetailResult {
  book: IBookDetail | null;
  loading: boolean;
  error: string | null;
  deleting: boolean;
  refetch: () => Promise<void>;
  deleteComment: (commentId: string, userId: string) => Promise<void>;
}

export function useBookDetail(slug?: string): UseBookDetailResult {
  const [book, setBook] = useState<IBookDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
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

  const deleteComment = useCallback(
    async (commentId: string, userId: string) => {
      if (!slug) {
        message.error("Không xác định được truyện.");
        return;
      }

      setDeleting(true);
      try {
        const response = await bookService.deleteComment(slug, commentId, userId);
        if (response.success) {
          message.success("Xóa bình luận thành công.");
          await fetchBookDetail();
        } else {
          message.error(response.message || "Không thể xóa bình luận.");
        }
      } catch (err) {
        message.error((err as Error).message || "Có lỗi xảy ra khi xóa bình luận.");
      } finally {
        setDeleting(false);
      }
    },
    [slug, fetchBookDetail]
  );

  useEffect(() => {
    void fetchBookDetail();
  }, [fetchBookDetail]);

  return {
    book,
    loading,
    error,
    deleting,
    refetch: fetchBookDetail,
    deleteComment,
  };
}
