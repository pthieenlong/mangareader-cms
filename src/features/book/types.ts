export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING";

export interface IBookCategory {
  id: string;
  title: string;
}

export interface IBookCategoryRelation {
  category: IBookCategory;
}

export interface IPublisher {
  id: string;
  username: string;
  avatar?: string | null;
}

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
  bookCategories?: IBookCategoryRelation[];
  publisher?: IPublisher;
}

export interface IBookListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  categories?: string[];
  status?: BookStatus;
  sort?: "latest" | "top_rated" | "most_viewed" | "price_asc" | "price_desc" | "free";
}

