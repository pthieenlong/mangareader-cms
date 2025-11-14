import { Outlet, useLocation, useRouter } from "@tanstack/react-router";
import {
  BellOutlined,
  DownOutlined,
  DashboardOutlined,
  BookOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Input, Button, Breadcrumb, Space, Avatar, Dropdown } from "antd";
import type { ReactNode } from "react";
import { useMemo } from "react";
import "./app.scss";

const { Header, Sider, Content, Footer } = Layout;
const { Search } = Input;

type MenuItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  children?: MenuItem[];
};

export default function AppLayout() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      key: "/dashboard",
      label: "Trang chủ",
      icon: <DashboardOutlined />,
    },
    {
      key: "/book",
      label: "Quản lý truyện",
      icon: <BookOutlined />,
    },
    {
      key: "/categories",
      label: "Quản lý danh mục",
      icon: <AppstoreOutlined />,
    },
    {
      key: "/user",
      label: "Quản lý người dùng",
      icon: <UserOutlined />,
    },
    {
      key: "/ecommerce",
      label: "Quản lý đơn hàng",
      icon: <ShoppingCartOutlined />,
    },
    {
      key: "/content",
      label: "Quản lý nội dung",
      icon: <FileTextOutlined />,
    },
    {
      key: "/notifications",
      label: "Thông báo",
      icon: <BellOutlined />,
    },
    {
      key: "/settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
  ];

  const breadcrumbs = useMemo(() => {
    const path = location.pathname || "/";
    const segments = path.split("/").filter(Boolean);
    const labelMap: Record<string, string> = {
      dashboard: "Dashboard",
      book: "Quản lý truyện",
      create: "Tạo truyện",
      edit: "Chỉnh sửa truyện",
      chapters: "Quản lý chương",
      categories: "Quản lý danh mục",
      user: "Quản lý người dùng",
      ecommerce: "Quản lý đơn hàng",
      content: "Quản lý nội dung",
      notifications: "Thông báo",
      settings: "Cài đặt",
    };
    const crumbs: Array<{ href: string; title: string }> = [];
    let acc = "";
    for (const seg of segments) {
      acc += `/${seg}`;
      crumbs.push({ href: acc, title: labelMap[seg] ?? seg });
    }
    if (crumbs.length === 0) {
      return [{ href: "/dashboard", title: "Dashboard" }];
    }
    return crumbs;
  }, [location.pathname]);

  const selectedKeys = useMemo(() => {
    const path = location.pathname;
    const segments = path.split("/").filter(Boolean);
    if (segments.length > 0) {
      return [`/${segments[0]}`];
    }
    return ["/dashboard"];
  }, [location.pathname]);

  const accountMenuItems = [
    {
      key: "profile",
      label: "Thông tin tài khoản",
    },
    {
      key: "settings",
      label: "Cài đặt",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <Layout className="app-layout">
      <Sider width={260} className="app-sidebar">
        <div className="sidebar-header">
          <span className="sidebar-title">MangaReader CMS</span>
        </div>
        <Menu
          mode="inline"
          selectedKeys={selectedKeys}
          items={menuItems.map((item) => ({
            key: item.key,
            label: item.label,
            icon: item.icon,
            children: item.children?.map((child) => ({
              key: child.key,
              label: child.label,
              icon: child.icon,
            })),
          }))}
          onClick={({ key }) => {
            const path = key as string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.navigate({ to: path as any });
          }}
          className="sidebar-menu"
        />
        <div className="sidebar-footer">
          © {currentYear} MangaReader
        </div>
      </Sider>
      <Layout>
        <Header className="app-header">
          <div className="header-search">
            <Search
              placeholder="Search..."
              allowClear
              style={{ maxWidth: 500 }}
            />
          </div>
          <Space>
            <Button
              type="text"
              icon={<BellOutlined />}
              aria-label="Notifications"
            />
            <Dropdown menu={{ items: accountMenuItems }} trigger={["click"]}>
              <Button type="text" className="account-button">
                <Space>
                  <Avatar size="small" className="account-avatar">
                    U
                  </Avatar>
                  <span>Account</span>
                  <DownOutlined />
                </Space>
              </Button>
            </Dropdown>
          </Space>
        </Header>
        <Content className="app-content">
          <Breadcrumb
            items={[
              {
                title: (
                  <a
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      router.navigate({ to: "/dashboard" as any });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    Dashboard
                  </a>
                ),
              },
              ...breadcrumbs.map((b, idx) => ({
                title:
                  idx === breadcrumbs.length - 1 ? (
                    b.title
                  ) : (
                    <a
                      onClick={() => {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        router.navigate({ to: b.href as any });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {b.title}
                    </a>
                  ),
              })),
            ]}
            style={{ marginBottom: 16 }}
          />
          <Outlet />
        </Content>
        <Footer className="app-footer">
          Built by MangaReader with ❤️ in {currentYear}
        </Footer>
      </Layout>
    </Layout>
  );
}
