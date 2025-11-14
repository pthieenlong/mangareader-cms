import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { CreateBookPayload, IBookListParams, UpdateBookPayload } from "../types";

export const bookService = {
  async getBooks(params?: IBookListParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/books", {
      params,
    });
    return response.data;
  },

  async getBookBySlug(slug: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(`/books/${slug}`);
    return response.data;
  },

  async createBook(payload: CreateBookPayload): Promise<CustomResponse> {
    const response = await axiosInstance.post<CustomResponse>("/books", payload);
    return response.data;
  },

  async updateBook(slug: string, payload: UpdateBookPayload): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(`/books/${slug}`, payload);
    return response.data;
  },

  async deleteBook(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(`/books/${id}`);
    return response.data;
  },

  async getCategories(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/category");
    return response.data;
  },
};

