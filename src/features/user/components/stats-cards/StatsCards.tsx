import { Col, Row } from "antd";
import {
  BookOutlined,
  DollarOutlined,
  ShoppingOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { AnalyticCard } from "@/components";
import type { IPublisherOverviewStats, IUserStatistics } from "../../types";
import { formatCurrency, formatNumber } from "@/utils";

interface StatsCardsProps {
  userStatistics?: IUserStatistics | null;
  statisticsLoading?: boolean;
  publisherOverview?: IPublisherOverviewStats | null;
  overviewLoading?: boolean;
  isPublisher: boolean;
}

export function StatsCards({
  userStatistics,
  statisticsLoading = false,
  publisherOverview,
  overviewLoading = false,
  isPublisher,
}: StatsCardsProps) {
  if (isPublisher) {
    return (
      <Row gutter={[16, 16]}>
        <Col xs={12} md={8}>
          <AnalyticCard
            title="Tổng doanh thu"
            value={
              publisherOverview
                ? formatCurrency(publisherOverview.totalRevenue)
                : "0đ"
            }
            prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
            loading={overviewLoading}
          />
        </Col>
        <Col xs={12} md={8}>
          <AnalyticCard
            title="Tổng đơn hàng"
            value={
              publisherOverview
                ? formatNumber(publisherOverview.totalOrders)
                : "0"
            }
            prefix={<ShoppingOutlined style={{ color: "#52c41a" }} />}
            loading={overviewLoading}
          />
        </Col>
        <Col xs={12} md={8}>
          <AnalyticCard
            title="Tổng truyện đã đăng"
            value={
              publisherOverview
                ? formatNumber(
                    publisherOverview.totalBooks ??
                      publisherOverview.publishedBookCount ??
                      0
                  )
                : "0"
            }
            prefix={<BookOutlined style={{ color: "#faad14" }} />}
            loading={overviewLoading}
          />
        </Col>
      </Row>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      <Col xs={12} md={6}>
        <AnalyticCard
          title="Tổng chi tiêu"
          value={
            userStatistics ? formatCurrency(userStatistics.totalSpent) : "0đ"
          }
          prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
          loading={statisticsLoading}
        />
      </Col>
      <Col xs={12} md={6}>
        <AnalyticCard
          title="Số truyện đã mua"
          value={
            userStatistics ? formatNumber(userStatistics.purchaseCount) : "0"
          }
          prefix={<ShoppingOutlined style={{ color: "#52c41a" }} />}
          loading={statisticsLoading}
        />
      </Col>
      <Col xs={12} md={6}>
        <AnalyticCard
          title="Số truyện yêu thích"
          value={
            userStatistics ? formatNumber(userStatistics.favoriteCount) : "0"
          }
          prefix={<HeartOutlined style={{ color: "#eb2f96" }} />}
          loading={statisticsLoading}
        />
      </Col>
      <Col xs={12} md={6}>
        <AnalyticCard
          title="Số truyện đã đọc"
          value={
            userStatistics
              ? formatNumber(userStatistics.readingHistoryCount)
              : "0"
          }
          prefix={<BookOutlined style={{ color: "#faad14" }} />}
          loading={statisticsLoading}
        />
      </Col>
    </Row>
  );
}
