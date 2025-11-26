import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import AppLayout from "@/app/app";
import DashboardPage from "@/features/dashboard";
import BookPage from "@/features/book";
import BookDetailPage from "@/features/book/detail";
import ChapterDetailPage from "@/features/book/chapter-detail";
import UserPage from "@/features/user";
import UserDetailPage from "@/features/user/detail";
import ContentPage from "@/features/content";
import NotificationsPage from "@/features/notifications";
import SettingsPage from "@/features/settings";
import CategoriesPage from "@/features/category";
import CreateCategoryPage from "@/features/category/create";
import EditCategoryPage from "@/features/category/edit";
import OrderPage from "@/features/order";
import OrderDetailPage from "@/features/order/detail";

const rootRoute = createRootRoute({
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const bookRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book",
  component: BookPage,
});

const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$slug",
  component: BookDetailPage,
});

const chapterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$slug/chapters/$chapterSlug",
  component: ChapterDetailPage,
});

const userRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user",
  component: UserPage,
});

const userDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/user/$id",
  component: UserDetailPage,
});

const ecommerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrderPage,
});

const contentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/content",
  component: ContentPage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/notifications",
  component: NotificationsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/settings",
  component: SettingsPage,
});

const categoriesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories",
  component: CategoriesPage,
});

const categoryCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories/create",
  component: CreateCategoryPage,
});

const categoryEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/categories/$slug/edit",
  component: EditCategoryPage,
});

const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order",
  component: OrderPage,
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$userId/$orderId",
  component: OrderDetailPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

rootRoute.addChildren([
  dashboardRoute,
  bookRoute,
  bookDetailRoute,
  chapterDetailRoute,
  categoriesRoute,
  categoryCreateRoute,
  categoryEditRoute,
  userRoute,
  userDetailRoute,
  orderRoute,
  orderDetailRoute,
  ecommerceRoute,
  contentRoute,
  notificationsRoute,
  settingsRoute,
  indexRoute,
]);

export const router = createRouter({
  routeTree: rootRoute,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
