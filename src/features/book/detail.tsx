import { useCallback, useEffect, useState } from "react";
import { Button, Result, Skeleton, message } from "antd";
import { useParams } from "@tanstack/react-router";
import { BookDetail } from "./components/BookDetail";
import type { IBookDetail } from "./types";
import { bookService } from "./services/book.service";
import { router } from "@/app/router.instance";

export default function BookDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const [book, setBook] = useState<IBookDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await bookService.getBookBySlug(slug);
      if (response.success && response.data) {
        setBook(response.data as IBookDetail);
      } else {
        setError(response.message || "Không thể tải chi tiết truyện.");
      }
    } catch (err) {
      setError((err as Error).message || "Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void fetchBookDetail();
  }, [fetchBookDetail]);

  if (loading) {
    return <Skeleton active avatar paragraph={{ rows: 6 }} />;
  }

  if (error || !book) {
    return (
      <Result
        status="error"
        title="Không tìm thấy thông tin truyện"
        subTitle={error ?? "Truyện có thể đã bị xóa hoặc không tồn tại."}
        extra={
          <Button
            type="primary"
            onClick={() => {
              router.navigate({ to: "/book" } as never);
            }}
          >
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  return (
    <BookDetail
      book={book}
      onBack={() => {
        router.navigate({ to: "/book" } as never);
      }}
      onEdit={(currentBook) => {
        router.navigate({
          to: "/book/$slug/edit",
          params: { slug: currentBook.slug },
        } as never);
      }}
      onDelete={() => {
        message.warning("Tính năng xóa sẽ sớm khả dụng. Delete feature coming soon.");
      }}
      onChapterDetail={(chapter) => {
        router.navigate({
          to: "/book/$slug/chapters/$chapterSlug",
          params: { slug: book.slug, chapterSlug: chapter.slug },
        } as never);
      }}
    />
  );
}


