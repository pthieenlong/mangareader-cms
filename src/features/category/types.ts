export interface ICategory {
  id: string;
  title: string;
  slug: string;
  thumbnail?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface CreateCategoryPayload {
  title: string;
  slug: string;
  description?: string | null;
  thumbnail?: string | null;
}


