import { Typography } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import "./TrendIndicator.scss";

const { Text } = Typography;

export interface TrendIndicatorProps {
  /**
   * Growth percentage value (positive or negative)
   */
  value: number;
  /**
   * Suffix text (default: "so với kỳ trước")
   */
  suffix?: string;
  /**
   * Font size in pixels (default: 12)
   */
  fontSize?: number;
  /**
   * Color for positive trend (default: "#52c41a")
   */
  positiveColor?: string;
  /**
   * Color for negative trend (default: "#ff4d4f")
   */
  negativeColor?: string;
  /**
   * Whether to show the icon
   */
  showIcon?: boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * TrendIndicator - Displays growth/decline percentage with visual indicator
 * Used for showing KPI trends in analytics dashboards
 */
export function TrendIndicator({
  value,
  suffix = "so với kỳ trước",
  fontSize = 12,
  positiveColor = "#52c41a",
  negativeColor = "#ff4d4f",
  showIcon = true,
  className = "",
}: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const color = isPositive ? positiveColor : negativeColor;
  const Icon = isPositive ? ArrowUpOutlined : ArrowDownOutlined;
  const prefix = isPositive ? "+" : "";

  return (
    <Text
      type="secondary"
      style={{ fontSize }}
      className={`trend-indicator ${className}`.trim()}
    >
      {showIcon && <Icon style={{ color, marginRight: 4 }} />}
      <span style={{ color }}>
        {prefix}
        {value}%
      </span>
      {suffix && <span className="trend-indicator__suffix"> {suffix}</span>}
    </Text>
  );
}

export default TrendIndicator;
