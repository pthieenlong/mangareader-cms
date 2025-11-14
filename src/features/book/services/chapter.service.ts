import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { ChapterStatus } from "../types";

interface UpdateChapterPayload {
  title?: string;
  chapterNumber?: number;
  isFree?: boolean;
  price?: number;
  isOnSale?: boolean;
  salePercent?: number;
  status?: ChapterStatus;
  content?: string[];
}

export const chapterService = {
  async getChapterDetail(bookSlug: string, chapterSlug: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(`/chapters/${bookSlug}/${chapterSlug}`);
    return response.data;
  },

  async updateChapter(
    bookSlug: string,
    chapterSlug: string,
    payload: UpdateChapterPayload,
  ): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/chapters/${bookSlug}/${chapterSlug}`,
      payload,
    );
    return response.data;
  },
};

