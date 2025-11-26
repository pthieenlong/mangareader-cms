import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type { IUserListParams } from "../types";

export const userService = {
  async getUsers(params?: IUserListParams): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>("/admin/user", {
      params,
    });
    return response.data;
  },

  async getUserById(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      `/admin/user/${id}`
    );
    return response.data;
  },

  async updateUser(
    id: string,
    payload: {
      username?: string;
      avatar?: File;
    }
  ): Promise<CustomResponse> {
    const formData = new FormData();
    if (payload.username) {
      formData.append("username", payload.username);
    }
    if (payload.avatar && payload.avatar instanceof File) {
      formData.append("avatar", payload.avatar);
    }

    const response = await axiosInstance.put<CustomResponse>(
      `/admin/user/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  async deleteUser(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.delete<CustomResponse>(
      `/admin/user/${id}`
    );
    return response.data;
  },

  async banUser(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.patch<CustomResponse>(
      `/admin/user/${id}/ban`
    );
    return response.data;
  },

  async unbanUser(id: string): Promise<CustomResponse> {
    const response = await axiosInstance.patch<CustomResponse>(
      `/admin/user/${id}/unban`
    );
    return response.data;
  },
};
