import axiosInstance from "@/lib/axios";
import type { CustomResponse } from "@/lib/custom";
import type {
  IPendingPublishersParams,
  IPublisherApplication,
} from "../types";

interface PendingPublishersApiResponse {
  applications: IPublisherApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const publisherService = {
  async getPendingPublishers(
    params?: IPendingPublishersParams
  ): Promise<CustomResponse> {
    const response = await axiosInstance.get<CustomResponse>(
      "/admin/publishers/pending-approval",
      {
        params,
      }
    );

    // Transform API response to match expected format
    if (response.data.success && response.data.data) {
      const apiData = response.data.data as PendingPublishersApiResponse;
      return {
        ...response.data,
        data: apiData.applications,
        pagination: {
          page: apiData.pagination.page,
          limit: apiData.pagination.limit,
          totalPage: apiData.pagination.totalPages,
          totalItems: apiData.pagination.total,
        },
      };
    }

    return response.data;
  },

  async approvePublisher(id: string, notes?: string): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/admin/publishers/${id}/approve`,
      { notes }
    );
    return response.data;
  },

  async rejectPublisher(
    id: string,
    reason: string,
    notes?: string
  ): Promise<CustomResponse> {
    const response = await axiosInstance.put<CustomResponse>(
      `/admin/publishers/${id}/reject`,
      { reason, notes }
    );
    return response.data;
  },
};
