import { Col, Row } from "antd";
import {
  DollarOutlined,
  ShoppingOutlined,
  HeartOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { AnalyticCard } from "@/components";
import type {
  IPublisherOverviewStats,
  IUserStatistics,
} from "../types";
import { formatCurrency, formatNumber } from "@/utils";

interface UserStatisticsCardsProps {
  userStatistics?: IUserStatistics | null;
  statisticsLoading?: boolean;
  publisherOverview?: IPublisherOverviewStats | null;
  overviewLoading?: boolean;
  isPublisher: boolean;
}

export function UserStatisticsCards({
  userStatistics,
  statisticsLoading = false,
  publisherOverview,
  overviewLoading = false,
  isPublisher,
}: UserStatisticsCardsProps) {
  if (isPublisher) {
    return (
      <Row gutter={[16, 16]}>
        {publisherOverview && (
          <>
            <Col xs={12} md={6}>
              <AnalyticCard
                title="Doanh thu"
                value={formatCurrency(publisherOverview.totalRevenue)}
                prefix={<DollarOutlined style={{ color: "#1890ff" }} />}
                loading={overviewLoading}
              />
            </Col>
            <Col xs={12} md={6}>
              <AnalyticCard
                title="Số truyện đã đăng tải"
                value={formatNumber(publisherOverview.publishedBookCount)}
                prefix={<BookOutlined style={{ color: "#52c41a" }} />}
                loading={overviewLoading}
              />
            </Col>
          </>
        )}
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


