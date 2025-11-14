import { useState, useEffect, useCallback } from "react";
import { SearchOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, Select, Table, Tag, Space, Typography, Card, Image, Avatar, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { bookService } from "../services/book.service";
import type { IBook, IBookListParams, BookStatus, IBookCategory } from "../types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { router } from "@/app/router.instance";
import "./BookList.scss";

const { Title, Text } = Typography;
const { Option } = Select;

// Fallback image base64
const FALLBACK_IMAGE = "data:image/png;base64,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";

const statusColors: Record<BookStatus, string> = {
  PENDING: "warning",
  DRAFT: "default",
  PUBLISHED: "success",
  ARCHIVED: "error",
};

export function BookList() {
  const [books, setBooks] = useState<IBook[]>([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<IBookCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    totalPage: 1,
    totalItems: 0,
  });
  const [filters, setFilters] = useState<IBookListParams>({
    page: 1,
    pageSize: 10,
    keyword: "",
    sort: "latest",
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookService.getBooks(filters);
      if (response.success && response.data) {
        setBooks(response.data as IBook[]);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            pageSize: response.pagination.limit,
            totalPage: response.pagination.totalPage,
            totalItems: response.pagination.totalItems || 0,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const response = await bookService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data as IBookCategory[]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      keyword: value,
      page: 1,
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sort: value as IBookListParams["sort"],
      page: 1,
    }));
  };

  const handleCategoryChange = (value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
      page: 1,
    }));
  };

  const handleStatusChange = (value: BookStatus | undefined) => {
    setFilters((prev) => ({
      ...prev,
      status: value,
      page: 1,
    }));
  };

  const handleTableChange = (page: number, pageSize: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
      pageSize,
    }));
  };

  const renderPrice = (book: IBook) => {
    if (book.isFree) {
      return <Tag color="success">Free</Tag>;
    }
    if (book.isOnSale) {
      const salePrice = book.price * (1 - book.salePercent / 100);
      return (
        <Space direction="vertical" size={0}>
          <Text delete type="secondary">
            {formatCurrency(book.price)}
          </Text>
          <Text type="danger">
            {formatCurrency(salePrice)}
          </Text>
        </Space>
      );
    }
    return <Text>{formatCurrency(book.price)}</Text>;
  };

  const columns: ColumnsType<IBook> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: IBook, index: number) => index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "thumbnail",
      width: 100,
      render: (thumbnail: string | null) => (
        <Image
          src={thumbnail || undefined}
          alt="Book thumbnail"
          width={60}
          height={80}
          style={{ objectFit: "cover" }}
          fallback={FALLBACK_IMAGE}
        />
      ),
    },
    {
      title: "Tên",
      key: "name",
      render: (_: unknown, book: IBook) => (
        <Space direction="vertical" size={4}>
          <Typography.Link
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.navigate({ to: "/book/$slug", params: { slug: book.slug } } as any);
            }}
            style={{ cursor: "pointer" }}
          >
            {book.title}
          </Typography.Link>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            ID: {book.id}
          </Text>
        </Space>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "bookCategories",
      render: (bookCategories?: IBook["bookCategories"]) => (
        <Space size={[0, 4]} wrap>
          {bookCategories?.map((categoryRelation) => {
            const category = categoryRelation.category;
            return <Tag key={category.id}>{category.title}</Tag>;
          })}
        </Space>
      ),
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      render: (publisher?: IBook["publisher"]) => (
        <Space>
          <Avatar src={publisher?.avatar || undefined} size="small">
            {publisher?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Typography.Text>{publisher?.username || "-"}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "Giá",
      key: "price",
      align: "right",
      render: (_: unknown, book: IBook) => renderPrice(book),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: BookStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Cập nhật lúc",
      dataIndex: "updatedAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 100,
      render: (_: unknown, book: IBook) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                router.navigate({
                  to: "/book/$slug/edit",
                  params: { slug: book.slug },
                } as never);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                // TODO: Implement delete handler
                console.log("Delete book:", book);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="book-list-container">
      {/* Header */}
      <div className="book-list-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>Danh sách truyện</Title>
          <Text type="secondary">Quản lý và theo dõi tất cả các truyện trong hệ thống</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            router.navigate({ to: "/book/create" } as never);
          }}
        >
          Thêm truyện mới
        </Button>
      </div>

      {/* Filters */}
      <Card className="book-list-filters">
        <Space size="middle" style={{ width: "100%" }} wrap>
          <Input
            placeholder="Tìm kiếm theo tên, tác giả..."
            prefix={<SearchOutlined />}
            value={filters.keyword || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo danh mục"
            value={filters.category}
            onChange={handleCategoryChange}
            style={{ width: 200 }}
            allowClear
            loading={categoriesLoading}
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) => {
              const label = String(option?.label ?? "");
              return label.toLowerCase().includes(input.toLowerCase());
            }}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id} label={category.title}>
                {category.title}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Lọc theo trạng thái"
            value={filters.status}
            onChange={handleStatusChange}
            style={{ width: 180 }}
            allowClear
          >
            <Option value="DRAFT">Bản nháp</Option>
            <Option value="PUBLISHED">Đã xuất bản</Option>
            <Option value="ARCHIVED">Đã lưu trữ</Option>
            <Option value="PENDING">Đang chờ</Option>
          </Select>
          <Select
            placeholder="Sắp xếp"
            value={filters.sort || "latest"}
            onChange={handleSortChange}
            style={{ width: 180 }}
          >
            <Option value="latest">Mới nhất</Option>
            <Option value="top_rated">Đánh giá cao</Option>
            <Option value="most_viewed">Xem nhiều nhất</Option>
            <Option value="price_asc">Giá tăng dần</Option>
            <Option value="price_desc">Giá giảm dần</Option>
            <Option value="free">Miễn phí</Option>
          </Select>
        </Space>
      </Card>

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={books}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.totalItems,
            showSizeChanger: true,
            showTotal: (total: number) => `Hiển thị ${books.length} / ${total} truyện`,
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
