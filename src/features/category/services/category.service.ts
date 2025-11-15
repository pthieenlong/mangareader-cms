import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";

export const categoryService = {
  async getCategories(): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/admin/category");
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
    payload: { title?: string; description?: string; thumbnail?: File | string }
  ): Promise<CustomResponse> {
    const formData = new FormData();
    if (payload.title) {
      formData.append("title", payload.title);
    }
    if (payload.description) {
      formData.append("description", payload.description);
    }
    if (payload.thumbnail) {
      if (payload.thumbnail instanceof File) {
        formData.append("thumbnail", payload.thumbnail);
      } else {
        formData.append("thumbnail", payload.thumbnail);
      }
    }

    const response = await axiosInstance.put<CustomResponse>(
      `/admin/category/${slug}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
