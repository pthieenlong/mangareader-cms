export interface ICategory {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  description?: string | null;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateCategoryPayload {
  title: string;
  description?: string | null;
  thumbnail?: string | null;
}

export interface CategoryQueryParams {
  keyword?: string;
  page?: number;
  limit?: number;
}
