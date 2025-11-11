import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { Bell, ChevronDown, LayoutDashboard, BookOpen, Users, ShoppingCart, FileText, Settings, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import type { ReactNode } from "react";
import { useMemo } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type SectionProps = {
  children: ReactNode;
  className?: string;
};

function Section({ children, className }: SectionProps) {
  return <div className={className}>{children}</div>;
}

export default function AppLayout() {
  const currentYear = new Date().getFullYear();
  const menuLinks = [
    { to: "/dashboard", label: "Trang chủ", icon: LayoutDashboard },
    {
      to: "/book",
      label: "Danh sách truyện",
      icon: BookOpen,
      children: [
        { to: "/book", label: "Tất cả truyện", icon: FolderTree },
        { to: "/book/categories", label: "Danh mục truyện", icon: FolderTree },
      ],
    },
    { to: "/user", label: "Quản lý người dùng", icon: Users },
    { to: "/ecommerce", label: "Quản lý đơn hàng", icon: ShoppingCart },
    { to: "/content", label: "Quản lý nội dung", icon: FileText },
    { to: "/notifications", label: "Thông báo", icon: Bell },
    { to: "/settings", label: "Cài đặt", icon: Settings },
  ];
  const location = useLocation();
  const breadcrumbs = useMemo(() => {
    const path = location.pathname || "/";
    const segments = path.split("/").filter(Boolean);
    const labelMap: Record<string, string> = {
      dashboard: "Dashboard",
      book: "Danh sách truyện",
      categories: "Danh mục",
      user: "Quản lý người dùng",
      ecommerce: "Quản lý đơn hàng",
      content: "Quản lý nội dung",
      notifications: "Thông báo",
      settings: "Cài đặt",
    };
    const crumbs: Array<{ to: string; label: string }> = [];
    let acc = "";
    for (const seg of segments) {
      acc += `/${seg}`;
      crumbs.push({ to: acc, label: labelMap[seg] ?? seg });
    }
    if (crumbs.length === 0) {
      return [{ to: "/dashboard", label: "Dashboard" }];
    }
    return crumbs;
  }, [location.pathname]);

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr] grid-rows-[auto_1fr_auto] bg-background text-foreground">
      {/* Sidebar */}
      <aside className="row-span-3 border-r bg-sidebar text-sidebar-foreground">
        {/* Sidebar Header */}
        <Section className="h-14 flex items-center px-4 border-b">
          <span className="font-semibold tracking-tight">MangaReader CMS</span>
        </Section>

        {/* Sidebar Menu */}
        <Section className="p-2">
          <nav className="flex flex-col gap-1">
            {menuLinks.map((item) => {
              const Icon = item.icon;
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              return (
                <div key={item.to} className="flex flex-col">
                  <Link
                    to={item.to}
                    className="px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors flex items-center gap-2"
                    activeProps={{
                      className:
                        "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                    }}
                  >
                    {Icon ? <Icon size={16} /> : null}
                    <span>{item.label}</span>
                  </Link>
                  {hasChildren ? (
                    <div className="ml-6 mt-1 flex flex-col gap-1">
                      {item.children!.map((child) => {
                        const CIcon = child.icon;
                        return (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="px-3 py-1.5 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-sm flex items-center gap-2"
                            activeProps={{
                              className:
                                "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                            }}
                          >
                            {CIcon ? <CIcon size={14} /> : null}
                            <span>{child.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>
        </Section>

        {/* Sidebar Footer */}
        <Section className="mt-auto p-4 border-t text-xs text-muted-foreground">
          © {currentYear} MangaReader
        </Section>
      </aside>

      {/* Header */}
      <header className="col-start-2 h-14 border-b bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/60 flex items-center justify-between px-4 gap-4">
        {/* Searchbox */}
        <div className="flex-1">
          <div className="max-w-xl">
            <Input placeholder="Search..." aria-label="Search" />
          </div>
        </div>

        {/* Account Tooltips */}
        <div className="flex items-center gap-2">
          {/* Notification button */}
          <Button aria-label="Notifications" variant="outline" size="icon">
            <Bell size={18} />
          </Button>

          {/* Account Menu */}
          <Button aria-haspopup="menu" variant="outline" className="gap-2">
            <span className="inline-flex size-6 items-center justify-center rounded-full bg-muted text-xs">
              U
            </span>
            <span className="text-sm">Account</span>
            <ChevronDown size={16} />
          </Button>
        </div>
      </header>

      {/* Body */}
      <main className="col-start-2 p-4">
        {/* Breadcrumbs */}
        <Breadcrumb className="mb-3 text-sm text-muted-foreground">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbs.map((b, idx) => (
              <BreadcrumbItem key={b.to}>
                <BreadcrumbSeparator />
                {idx === breadcrumbs.length - 1 ? (
                  <BreadcrumbPage>{b.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={b.to}>{b.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="col-start-2 border-t h-12 flex items-center px-4 text-sm text-muted-foreground">
        <span>Built by MangaReader with ❤️ in {currentYear} </span>
      </footer>
    </div>
  );
}


