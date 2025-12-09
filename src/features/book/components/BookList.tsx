import { useMemo } from "react";
import {
  SearchOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { Input, Select, Table, Space, Typography, Card, Row, Col } from "antd";
import { useBooks, useBookOverviewStatistics } from "../hooks";
import { getBookListColumns, navigateToBookDetail } from "./BookListColumns";
import { AnalyticCard } from "@/components";
import { formatNumber } from "@/utils";
import "./BookList.scss";

const { Title } = Typography;
const { Option } = Select;

export function BookList() {
  const {
    books,
    loading,
    categories,
    categoriesLoading,
    pagination,
    filters,
    handleSearch,
    handleSortChange,
    handleCategoryChange,
    handleStatusChange,
    handleTableChange,
  } = useBooks();

  const { data: statistics, loading: statisticsLoading } =
    useBookOverviewStatistics();

  const columns = useMemo(
    () =>
      getBookListColumns({
        onViewDetail: navigateToBookDetail,
      }),
    []
  );

  const statisticsCards = [
    {
      key: "total",
      title: "Tổng số truyện",
      value: statistics?.totalBooks ?? 0,
      icon: <BookOutlined style={{ color: "#1890ff" }} />,
    },
    {
      key: "published",
      title: "Đang xuất bản",
      value: statistics?.publishedBooks ?? 0,
      icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
    },
    {
      key: "pending",
      title: "Đang chờ duyệt",
      value: statistics?.pendingBooks ?? 0,
      icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
    },
    {
      key: "free",
      title: "Truyện miễn phí",
      value: statistics?.freeBooks ?? 0,
      icon: <GiftOutlined style={{ color: "#eb2f96" }} />,
    },
  ];

  return (
    <div className="book-list-container">
      {/* Header */}
      <div className="book-list-header">
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Danh sách truyện
          </Title>
        </div>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="book-list-statistics">
        {statisticsCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.key}>
            <AnalyticCard
              title={card.title}
              value={formatNumber(card.value)}
              prefix={card.icon}
              loading={statisticsLoading}
            />
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Card className="book-list-filters">
        <Space size="middle" style={{ width: "100%" }} wrap>
          <Input
            placeholder="Tìm kiếm theo tên, tác giả..."
            prefix={<SearchOutlined />}
            value={filters.keyword || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleSearch(e.target.value)
            }
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
              <Option
                key={category.slug}
                value={category.slug}
                label={category.title}
              >
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
            showTotal: (total: number) =>
              `Hiển thị ${books.length} / ${total} truyện`,
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
