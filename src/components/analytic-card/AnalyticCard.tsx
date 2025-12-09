import { Card, Statistic, Spin, Typography } from "antd";
import type { ReactNode } from "react";
import "./AnalyticCard.scss";

const { Text } = Typography;

export interface AnalyticCardProps {
  /**
   * Title of the statistic card
   */
  title: string;
  /**
   * Value to display (formatted string)
   */
  value: string | number;
  /**
   * Optional trend indicator component
   */
  trend?: ReactNode;
  /**
   * Whether the card is in loading state
   */
  loading?: boolean;
  /**
   * Optional prefix icon
   */
  prefix?: ReactNode;
  /**
   * Optional suffix text or element
   */
  suffix?: ReactNode;
  /**
   * Optional className for additional styling
   */
  className?: string;
}

/**
 * AnalyticCard - A reusable statistic card component
 * Used for displaying KPIs, metrics, and analytics data
 */
export function AnalyticCard({
  title,
  value,
  trend,
  loading = false,
  prefix,
  suffix,
  className = "",
}: AnalyticCardProps) {
  return (
    <Card className={`analytic-card ${className}`.trim()}>
      {loading ? (
        <div className="analytic-card__loading">
          <Spin />
        </div>
      ) : (
        <>
          <Statistic
            title={<Text type="secondary">{title}</Text>}
            value={value}
            valueStyle={{ fontSize: 24, fontWeight: 600 }}
            prefix={prefix}
            suffix={suffix}
          />
          {trend && <div className="analytic-card__trend">{trend}</div>}
        </>
      )}
    </Card>
  );
}

export default AnalyticCard;
