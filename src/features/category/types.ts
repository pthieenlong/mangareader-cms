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


