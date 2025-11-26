import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { CreateCategoryPayload, CategoryQueryParams } from "../types";

export const categoryService = {
  async getCategories(params?: CategoryQueryParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/category",
      {
        params,
      }
    );
    return response.data;
  },

  async createCategory(
    payload: CreateCategoryPayload
  ): Promise<CustomResponse> {
    const response = await axiosInstance.post<CustomResponse>(
      "/admin/category",
      payload
    );
    return response.data;
  },

  async getFeaturedCategories(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/category/feature"
    );
    return response.data;
  },

  async getCategoryBySlug(slug: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/category/${slug}`
    );
    return response.data;
  },

  async updateCategory(
    slug: string,
    payload: { description?: string; thumbnail?: File }
  ): Promise<CustomResponse> {
    const formData = new FormData();

    if (payload.description) {
      formData.append("description", payload.description);
    }

    if (payload.thumbnail && payload.thumbnail instanceof File) {
      formData.append("thumbnail", payload.thumbnail);
    }

    // Debug: Log FormData contents
    console.log("FormData contents:");
    console.log("description:", formData.get("description"));
    console.log("thumbnail:", formData.get("thumbnail"));
    console.log("thumbnail type:", formData.get("thumbnail") instanceof File);
    console.log("payload.thumbnail:", payload.thumbnail);

    const response = await axiosInstance.put<CustomResponse>(
      `/admin/category/${slug}`,
      formData
    );
    return response.data;
  },

  async deleteCategory(slug: string): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(
      `/admin/category/${slug}`
    );
    return response.data;
  },
};
