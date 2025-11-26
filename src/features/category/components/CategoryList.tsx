import { useState, useEffect, useCallback, useRef } from "react";
import {
  SearchOutlined,
  EyeOutlined,
  PlusOutlined,
  DeleteOutlined,
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
import type { ICategory, CategoryQueryParams } from "../types";
import { formatDate } from "@/lib/utils";
import { router } from "@/app/router.instance";
import "./CategoryList.scss";

const { Title, Text } = Typography;

// Debounce delay for search (ms)
const SEARCH_DEBOUNCE_DELAY = 500;

// Fallback image base64
const FALLBACK_IMAGE =
  "data:image/png;base64,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";

export function CategoryList() {
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

  const handleDeleteCategory = async (category: ICategory) => {
    try {
      setLoading(true);
      const response = await categoryService.deleteCategory(category.slug);
      if (response.success) {
        message.success("Xóa danh mục thành công!");

        // If current page has only one item and it's not the first page,
        // go to previous page after deletion
        if (categories.length === 1 && pagination.page > 1) {
          setFilters((prev) => ({
            ...prev,
            page: prev.page! - 1,
          }));
        } else {
          await fetchCategories();
        }
      } else {
        message.error(
          response.message || "Không thể xóa danh mục, vui lòng thử lại"
        );
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      message.error("Có lỗi xảy ra khi xóa danh mục");
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
            src={
              thumbnail
                ? `https://cdn.mangareader.io.vn/${thumbnail}`
                : undefined
            }
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
        return <Tag>{status}</Tag>;
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
      width: 180,
      render: (_: unknown, category: ICategory) => (
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
            title="Xác nhận xóa danh mục"
            description={
              <div>
                <p>
                  Bạn có chắc chắn muốn xóa danh mục "{category.title}" không?
                </p>
                <p style={{ color: "red", fontSize: "12px", marginTop: 8 }}>
                  Hành động này không thể hoàn tác!
                </p>
              </div>
            }
            icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDeleteCategory(category)}
          >
            <Tooltip title="Xóa danh mục">
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
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
