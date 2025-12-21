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
};
