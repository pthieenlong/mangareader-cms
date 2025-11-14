import { createRootRoute, createRouter, createRoute } from "@tanstack/react-router";
import AppLayout from "@/app/app";
import DashboardPage from "@/features/dashboard";
import BookPage from "@/features/book";
import BookDetailPage from "@/features/book/detail";
import CreateBookPage from "@/features/book/create";
import EditBookPage from "@/features/book/edit";
import ChapterDetailPage from "@/features/book/chapter-detail";
import UserPage from "@/features/user";
import EcommercePage from "@/features/ecommerce";
import ContentPage from "@/features/content";
import NotificationsPage from "@/features/notifications";
import SettingsPage from "@/features/settings";
import BookCategoriesPage from "@/features/book/categories";

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

const bookCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/create",
  component: CreateBookPage,
});

const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$slug",
  component: BookDetailPage,
});

const bookEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/book/$slug/edit",
  component: EditBookPage,
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

const ecommerceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ecommerce",
  component: EcommercePage,
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
  component: BookCategoriesPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

rootRoute.addChildren([
  dashboardRoute,
  bookRoute,
  bookCreateRoute,
  bookDetailRoute,
  bookEditRoute,
  chapterDetailRoute,
  categoriesRoute,
  userRoute,
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


