import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IBookListParams } from "../types";

interface ApprovalPayload {
  notes?: string;
}

interface RejectPayload extends ApprovalPayload {
  reason: string;
}

export const bookService = {
  async getBooks(params?: IBookListParams): Promise<CustomResponse> {
    console.log(params);
    const response = await axiosInstance.get<CustomResponse>("/admin/books", {
      params,
    });
    return response.data;
  },

  async getBookOverviewStatistics(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/statistics/books/overview"
    );
    return response.data;
  },

  async getBookBySlug(slug: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/books/${slug}`
    );
    return response.data;
  },

  async getCategories(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/category");
    return response.data;
  },

  async approveBook(
    bookSlug: string,
    payload?: ApprovalPayload
  ): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/admin/books/${bookSlug}/approve`,
      payload ?? {}
    );
    return response.data;
  },

  async rejectBook(
    bookSlug: string,
    payload: RejectPayload
  ): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/admin/books/${bookSlug}/reject`,
      payload
    );
    return response.data;
  },

  async archiveBook(bookSlug: string): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(
      `/admin/books/${bookSlug}`
    );
    return response.data;
  },

  async unarchiveBook(bookSlug: string): Promise<CustomResponse> {
    const response = await axiosInstance.post<CustomResponse>(
      `/admin/books/${bookSlug}`
    );
    return response.data;
  },

  async deleteComment(
    bookSlug: string,
    commentId: string,
    userId: string
  ): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(
      `/admin/books/${bookSlug}/comment/${commentId}/${userId}`
    );
    return response.data;
  },
};
