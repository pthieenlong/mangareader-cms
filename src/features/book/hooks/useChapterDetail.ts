import { useCallback, useEffect, useState } from "react";
import type { CustomResponse } from "@/lib/custom";
import { chapterService } from "../services/chapter.service";
import type { IChapterDetail } from "../types";

export interface ChapterUpdatePayload {
  title?: string;
  chapterNumber?: number;
  isFree?: boolean;
  price?: number;
  isOnSale?: boolean;
  salePercent?: number;
  status?: IChapterDetail["status"];
  content?: string[];
}

interface UseChapterDetailResult {
  chapter: IChapterDetail | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateChapter: (payload: ChapterUpdatePayload) => Promise<CustomResponse>;
}

export function useChapterDetail(
  bookSlug?: string,
  chapterSlug?: string
): UseChapterDetailResult {
  const [chapter, setChapter] = useState<IChapterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchChapterDetail = useCallback(async () => {
    if (!bookSlug || !chapterSlug) {
      setError("Không thể xác định chương cần hiển thị.");
      setChapter(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await chapterService.getChapterDetail(
        bookSlug,
        chapterSlug
      );
      if (response.success && response.data) {
        setChapter(response.data as IChapterDetail);
      } else {
        setChapter(null);
        setError(response.message || "Không thể tải thông tin chương.");
      }
    } catch (err) {
      setChapter(null);
      setError(
        (err as Error).message || "Có lỗi xảy ra khi tải dữ liệu chương."
      );
    } finally {
      setLoading(false);
    }
  }, [bookSlug, chapterSlug]);

  const updateChapter = useCallback(
    async (payload: ChapterUpdatePayload) => {
      if (!bookSlug || !chapterSlug) {
        throw new Error("Không xác định được chương cần cập nhật.");
      }

      setUpdating(true);
      try {
        const response = await chapterService.updateChapter(
          bookSlug,
          chapterSlug,
          payload
        );
        if (response.success) {
          await fetchChapterDetail();
        }
        return response;
      } finally {
        setUpdating(false);
      }
    },
    [bookSlug, chapterSlug, fetchChapterDetail]
  );

  useEffect(() => {
    void fetchChapterDetail();
  }, [fetchChapterDetail]);

  return {
    chapter,
    loading,
    updating,
    error,
    refetch: fetchChapterDetail,
    updateChapter,
  };
}
