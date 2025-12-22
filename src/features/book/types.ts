export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "PENDING";
export type ChapterStatus = "PENDING" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface IBookCategory {
  id: string;
  slug: string;
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

export interface IChapterSummary {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  isFree: boolean;
  status: ChapterStatus;
  createdAt: string;
  updatedAt: string;
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

export interface IPurchasedUser {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  purchasedAt: string;
  pricePaid: number;
  orderCode: string;
}

export interface IReviewUser {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface IReview {
  id: string;
  ratePoint: number;
  content: string;
  agreement: number;
  chapterNumberAtReview: number;
  createdAt: string;
  user: IReviewUser;
}

export interface ICommentUser {
  id: string;
  username: string;
  avatar?: string | null;
}

export interface ICommentReply {
  id: string;
  content: string;
  createdAt: string;
  user: ICommentUser;
}

export interface IComment {
  id: string;
  content: string;
  createdAt: string;
  user: ICommentUser;
  replies?: ICommentReply[];
}

export interface IBookDetail extends IBook {
  chapterCount?: number;
  totalRevenue?: number;
  totalReviews?: number;
  averageRating?: number;
  totalPurchases?: number;
  totalComments?: number;
  chapters?: IChapterSummary[];
  purchasedUsers?: IPurchasedUser[];
  reviews?: IReview[];
  comments?: IComment[];
}

export interface IBookFormValues {
  title: string;
  slug?: string;
  thumbnail?: string | null;
  description?: string;
  author: string;
  policy: string;
  isFree: boolean;
  price: number;
  isOnSale: boolean;
  salePercent: number;
  status: BookStatus;
  categoryIds: string[];
}

export interface CreateBookPayload {
  title: string;
  slug?: string;
  thumbnail: string;
  description?: string;
  author: string;
  policy: string;
  isFree: boolean;
  price: number;
  isOnSale: boolean;
  salePercent: number;
  status: BookStatus;
  categoryIds?: string[];
}

export interface UpdateBookPayload extends Partial<CreateBookPayload> {
  categoryIds?: string[];
}

export interface IBookListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  status?: BookStatus;
  sort?:
    | "latest"
    | "top_rated"
    | "most_viewed"
    | "price_asc"
    | "price_desc"
    | "free";
}

export interface IChapterDetail extends IChapterSummary {
  price: number;
  isOnSale: boolean;
  salePercent: number;
  views?: number;
  content?: string[];
}

export interface IChapterFormValues {
  title: string;
  chapterNumber: number;
  isFree: boolean;
  price: number;
  isOnSale: boolean;
  salePercent: number;
  status: ChapterStatus;
  content?: string[];
}

// Book Overview Statistics
export interface IBookOverviewStatistics {
  totalBooks: number;
  publishedBooks: number;
  pendingBooks: number;
  freeBooks: number;
}

// Extended Book List Params with new filters
export interface IBookListFilters extends IBookListParams {
  priceMin?: number;
  priceMax?: number;
  createdFrom?: string;
  createdTo?: string;
  updatedFrom?: string;
  updatedTo?: string;
}
