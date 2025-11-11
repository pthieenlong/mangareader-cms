import { RouterProvider } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { router } from "@/app/router.instance";

export function AppRouter() {
  const devtools = import.meta.env.DEV ? (
    <TanStackRouterDevtools router={router} position="bottom-right" />
  ) : null;
  return (
    <>
      <RouterProvider router={router} />
      {devtools}
    </>
  );
}


