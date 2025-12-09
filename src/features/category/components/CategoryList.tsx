import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Table,
  Tag,
  Space,
  Typography,
  Card,
  Image,
  Tooltip,
  message,
  Popconfirm,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { categoryService } from "../services/category.service";
import { useCategories } from "../hooks/useCategories";
import type { ICategory, CategoryQueryParams } from "../types";
import { formatDate, FALLBACK_IMAGE, SEARCH_DEBOUNCE_DELAY } from "@/utils";
import { router } from "@/app/router.instance";
import "./CategoryList.scss";

const { Title, Text } = Typography;
export function CategoryList() {
  const { activeCategory, deleteCategory: unactiveCategory } = useCategories();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<CategoryQueryParams>({
    page: 1,
    limit: 10,
    keyword: "",
  });

  // Ref for debounce timer
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Clean up empty keyword
      const queryParams: CategoryQueryParams = {
        ...filters,
        keyword: filters.keyword?.trim() || undefined,
      };
      // Remove undefined values
      Object.keys(queryParams).forEach(
        (key) =>
          queryParams[key as keyof CategoryQueryParams] === undefined &&
          delete queryParams[key as keyof CategoryQueryParams]
      );

      const response = await categoryService.getCategories(queryParams);
      if (response.success && response.data) {
        const data = Array.isArray(response.data) ? response.data : [];
        setCategories(data);

        // Handle pagination
        if (response.pagination) {
          setPagination({
            page: response.pagination.page || 1,
            pageSize: response.pagination.limit || 10,
            totalPage: response.pagination.totalPage || 1,
            totalItems: response.pagination.totalItems || data.length,
          });
        } else {
          // Fallback: if no pagination info, assume all data is loaded
          setPagination((prev) => ({
            ...prev,
            totalItems: data.length,
          }));
        }
      } else {
        message.error(response.message || "Không thể tải danh sách danh mục");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Có lỗi xảy ra khi tải danh sách danh mục");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Debounced search handler
  const handleSearchChange = (value: string) => {
    setSearchValue(value);

    // Clear previous timer
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    // Set new timer
    searchDebounceRef.current = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        keyword: value.trim() || undefined,
        page: 1, // Reset to first page when searching
      }));
    }, SEARCH_DEBOUNCE_DELAY);
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  const handleTableChange = (page: number, pageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
      limit: pageSize,
    }));
  };

  const isCategoryActive = (status?: string) => {
    return status?.toUpperCase() === "ACTIVE";
  };

  const handleToggleStatus = async (category: ICategory, checked: boolean) => {
    try {
      setLoading(true);
      if (checked) {
        await activeCategory(category.slug);
      } else {
        await unactiveCategory(category.slug);
      }
      await fetchCategories();
    } catch (error) {
      console.error("Error toggling category status:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnsType<ICategory> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: ICategory, index: number) =>
        (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      width: 100,
      render: (thumbnail: string | null) => {
        return (
          <Image
            src={thumbnail ? `${thumbnail}` : undefined}
            alt="Category thumbnail"
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: "4px" }}
            fallback={FALLBACK_IMAGE}
          />
        );
      },
    },
    {
      title: "Tên danh mục",
      key: "title",
      render: (_: unknown, category: ICategory) => (
        <Space direction="vertical" size={4}>
          <Typography.Link
            onClick={() => {
              router.navigate({
                to: "/categories/$slug/edit",
                params: { slug: category.slug },
              } as never);
            }}
            style={{ cursor: "pointer" }}
          >
            {category.title}
          </Typography.Link>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Slug: {category.slug}
          </Text>
        </Space>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      render: (description: string | null | undefined) => (
        <Text ellipsis style={{ maxWidth: 300 }}>
          {description || "-"}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string | undefined) => {
        if (!status) return <Tag>-</Tag>;
        const isActive = isCategoryActive(status);
        return (
          <Tag color={isActive ? "success" : "error"}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updatedAt",
      render: (date: string | undefined) => (date ? formatDate(date) : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 250,
      render: (_: unknown, category: ICategory) => {
        const isActive = isCategoryActive(category.status);
        return (
          <Space size="small">
            <Tooltip title="Chỉnh sửa danh mục">
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => {
                  router.navigate({
                    to: "/categories/$slug/edit",
                    params: { slug: category.slug },
                  } as never);
                }}
              >
                Sửa
              </Button>
            </Tooltip>
            <Popconfirm
              title={isActive ? "Vô hiệu hóa danh mục" : "Kích hoạt danh mục"}
              description={
                <div>
                  <p>
                    Bạn có chắc chắn muốn {isActive ? "vô hiệu hóa" : "kích hoạt"} danh mục "{category.title}" không?
                  </p>
                </div>
              }
              icon={<ExclamationCircleOutlined style={{ color: isActive ? "orange" : "green" }} />}
              okText={isActive ? "Vô hiệu hóa" : "Kích hoạt"}
              cancelText="Hủy"
              okButtonProps={{ danger: isActive }}
              onConfirm={() => handleToggleStatus(category, !isActive)}
            >
              <Tooltip title={isActive ? "Vô hiệu hóa danh mục" : "Kích hoạt danh mục"}>
                <Button 
                  type="link" 
                  danger={isActive}
                  icon={isActive ? <StopOutlined /> : <CheckCircleOutlined />}
                >
                  {isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                </Button>
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="category-list-container">
      {/* Header */}
      <div className="category-list-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Danh sách danh mục
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.navigate({
              to: "/categories/create",
            } as never);
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      {/* Filters */}
      <Card className="category-list-filters">
        <Space size="middle" style={{ width: "100%" }} wrap>
          <Input
            placeholder="Tìm kiếm theo tên danh mục..."
            prefix={<SearchOutlined />}
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearchChange(e.target.value)
            }
            onPressEnter={(e) => {
              const value = (e.target as HTMLInputElement).value;
              if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current);
              }
              setFilters((prev) => ({
                ...prev,
                keyword: value.trim() || undefined,
                page: 1,
              }));
            }}
            style={{ flex: 1, minWidth: 200 }}
            allowClear
          />
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total: number, range: [number, number]) =>
              `${range[0]}-${range[1]} của ${total} danh mục`,
            onChange: handleTableChange,
            onShowSizeChange: handleTableChange,
          }}
          locale={{
            emptyText: "Không có dữ liệu",
          }}
        />
      </Card>
    </div>
  );
}
