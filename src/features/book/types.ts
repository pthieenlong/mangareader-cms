export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IBook {
  id: string;
  publisherId: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  view: number;
  likeCount: number;
  description: string;
  author: string;
  policy: string;
  isFree: boolean;
  status: BookStatus;
  price: number;
  isOnSale: boolean;
  salePercent: number;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
}

export interface IBookListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  categories?: string[];
  sort?: "latest" | "top_rated" | "most_viewed" | "price_asc" | "price_desc" | "free";
}

