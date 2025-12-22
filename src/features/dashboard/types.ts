export interface IRevenueByPeriod {
  period: string;
  revenue: number;
}

export interface ITopCategory {
  categoryId: string;
  categoryName: string;
  revenue: number;
}

export interface ITopPublisher {
  publisherId: string;
  publisherName: string;
  revenue: number;
}

export interface IRevenueStatistics {
  totalRevenue: number;
  currentPeriodRevenue: number;
  previousPeriodRevenue: number;
  revenueGrowth: number;
  revenueByPeriod: IRevenueByPeriod[];
  topCategories: ITopCategory[];
  topPublishers: ITopPublisher[];
}

// Overview Statistics
export interface IOverviewStatistics {
  totalUsers: number;
  totalBooks: number;
  totalOrders: number;
  totalRevenue: number;
  newUsers: number;
  newBooks: number;
  newOrders: number;
  userGrowth: number;
  bookGrowth: number;
  orderGrowth: number;
  revenueGrowth: number;
}

// User Statistics
export interface IUserStatistics {
  totalUsers: number;
  publishers: number;
  users: number;
  subscribers: number;
}

// Book Statistics
export interface IBookStatistics {
  totalBooks: number;
  newBooks: number;
  bookGrowth: number;
  publishedBooks: number;
  pendingBooks: number;
  rejectedBooks: number;
}

// Recent Order for dashboard
export interface IRecentOrder {
  id: string;
  orderCode?: string;
  userId: string;
  user?: {
    username: string;
    email: string;
  };
  totalAmount: number;
  status: string;
  payingMethod: string;
  createdAt: string;
}

// Revenue Chart Data (from API)
export interface IRevenueChartItem {
  period: string;
  ordersCount: number;
  totalRevenue: number;
}

// Pending Publisher for dashboard
export interface IPendingPublisher {
  id: string;
  username: string;
  email: string;
  avatar: string;
  accountStatus: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  waitingDays: number;
}

// Pending Book for dashboard
export interface IPendingBook {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  author: string;
  status: string;
  createdAt: string;
  publisher?: {
    id: string;
    username: string;
    avatar?: string | null;
  };
}
