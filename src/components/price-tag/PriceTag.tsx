import { Tag, Space, Typography } from "antd";
import { formatCurrency } from "@/utils";
import "./PriceTag.scss";

const { Text } = Typography;

export interface PriceTagProps {
  /**
   * Original price of the item
   */
  price: number;
  /**
   * Whether the item is free
   */
  isFree?: boolean;
  /**
   * Whether the item is on sale
   */
  isOnSale?: boolean;
  /**
   * Sale percentage (0-100)
   */
  salePercent?: number;
  /**
   * Show sale percentage tag
   */
  showSaleTag?: boolean;
  /**
   * Free label text (default: "Miễn phí")
   */
  freeLabel?: string;
  /**
   * Layout direction
   */
  direction?: "horizontal" | "vertical";
  /**
   * Additional className
   */
  className?: string;
}

/**
 * PriceTag - A reusable price display component
 * Handles free, regular, and sale price displays
 */
export function PriceTag({
  price,
  isFree = false,
  isOnSale = false,
  salePercent = 0,
  showSaleTag = true,
  freeLabel = "Miễn phí",
  direction = "vertical",
  className = "",
}: PriceTagProps) {
  // Free item
  if (isFree) {
    return (
      <Tag
        color="success"
        className={`price-tag price-tag--free ${className}`.trim()}
      >
        {freeLabel}
      </Tag>
    );
  }

  // Item on sale
  if (isOnSale && salePercent > 0) {
    const salePrice = price * (1 - salePercent / 100);

    return (
      <Space
        direction={direction}
        size={direction === "vertical" ? 0 : 8}
        className={`price-tag price-tag--sale ${className}`.trim()}
      >
        <Text delete type="secondary" className="price-tag__original">
          {formatCurrency(price)}
        </Text>
        <Text type="danger" strong className="price-tag__sale">
          {formatCurrency(salePrice)}
        </Text>
        {showSaleTag && (
          <Tag color="magenta" className="price-tag__percent">
            Giảm {salePercent}%
          </Tag>
        )}
      </Space>
    );
  }

  // Regular price
  return (
    <Text strong className={`price-tag price-tag--regular ${className}`.trim()}>
      {formatCurrency(price)}
    </Text>
  );
}

export default PriceTag;
