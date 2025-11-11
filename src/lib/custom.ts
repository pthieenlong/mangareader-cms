/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Pagination {
  limit: number;
  page: number;
  totalPage: number;
  totalItems?: number;
}

export interface CustomResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data?: any;
  error?: unknown;
  pagination?: Pagination;
}
