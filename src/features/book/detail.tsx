import { useEffect, useState } from "react";
import { Button, Result, Skeleton, message } from "antd";
import { useParams } from "@tanstack/react-router";
import { BookDetail } from "./components/BookDetail";
import { router } from "@/app/router.instance";
import { useBookDetail } from "./hooks/useBookDetail";
import { bookService } from "./services/book.service";

export default function BookDetailPage() {
  const { slug } = useParams({ strict: false }) as { slug: string };
  const { book, loading, error, refetch } = useBookDetail(slug);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

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
      onChapterDetail={(chapter) => {
        router.navigate({
          to: "/book/$slug/chapters/$chapterSlug",
          params: { slug: book.slug, chapterSlug: chapter.slug },
        } as never);
      }}
      onPublish={async ({ notes } = {}) => {
        if (!book) {
          return;
        }
        setActionLoading(true);
        try {
          const response = await bookService.approveBook(
            book.id,
            notes ? { notes } : undefined
          );
          if (response.success) {
            message.success("Truyện đã được xuất bản thành công.");
            await refetch();
          } else {
            message.error(response.message || "Không thể xuất bản truyện.");
          }
        } catch (err) {
          message.error(
            (err as Error).message || "Có lỗi xảy ra khi xuất bản truyện."
          );
        } finally {
          setActionLoading(false);
        }
      }}
      onReject={async ({ reason, notes }) => {
        if (!book) {
          return;
        }
        setActionLoading(true);
        try {
          const payload = {
            reason,
            ...(notes?.trim() ? { notes: notes.trim() } : {}),
          };
          const response = await bookService.rejectBook(book.id, payload);
          if (response.success) {
            message.success("Đã từ chối truyện và thông báo cho Publisher.");
            await refetch();
          } else {
            message.error(response.message || "Không thể từ chối truyện.");
          }
        } catch (err) {
          message.error(
            (err as Error).message || "Có lỗi xảy ra khi từ chối truyện."
          );
        } finally {
          setActionLoading(false);
        }
      }}
      onArchive={async ({ notes } = {}) => {
        if (!book) {
          return;
        }
        setActionLoading(true);
        try {
          const response = await bookService.archiveBook(
            book.id,
            notes?.trim() ? { notes: notes.trim() } : undefined
          );
          if (response.success) {
            message.success("Truyện đã được chuyển sang trạng thái lưu trữ.");
            await refetch();
          } else {
            message.error(response.message || "Không thể lưu trữ truyện.");
          }
        } catch (err) {
          message.error(
            (err as Error).message || "Có lỗi xảy ra khi lưu trữ truyện."
          );
        } finally {
          setActionLoading(false);
        }
      }}
      actionLoading={actionLoading}
    />
  );
}
