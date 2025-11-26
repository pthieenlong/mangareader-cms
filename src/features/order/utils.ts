import type { OrderStatus, PayingMethod } from "./types";
import {
  OrderStatus as OrderStatusEnum,
  PayingMethod as PayingMethodEnum,
} from "./types";

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatusEnum.COMPLETED:
    case OrderStatusEnum.PAID:
      return "success";
    case OrderStatusEnum.PENDING:
      return "warning";
    case OrderStatusEnum.CANCELLED:
    case OrderStatusEnum.FAILED:
    case OrderStatusEnum.ERROR:
      return "error";
    case OrderStatusEnum.REFUNDED:
      return "default";
    default:
      return "default";
  }
};

export const getStatusText = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatusEnum.PENDING:
      return "Đang chờ";
    case OrderStatusEnum.COMPLETED:
      return "Hoàn thành";
    case OrderStatusEnum.PAID:
      return "Đã thanh toán";
    case OrderStatusEnum.CANCELLED:
      return "Đã hủy";
    case OrderStatusEnum.REFUNDED:
      return "Đã hoàn tiền";
    case OrderStatusEnum.FAILED:
      return "Thất bại";
    case OrderStatusEnum.ERROR:
      return "Lỗi";
    default:
      return status;
  }
};

export const getPayingMethodText = (method: PayingMethod): string => {
  switch (method) {
    case PayingMethodEnum.BANK_TRANSFER:
      return "Chuyển khoản";
    case PayingMethodEnum.CREDIT_CARD:
      return "Thẻ tín dụng";
    case PayingMethodEnum.E_WALLET:
      return "Ví điện tử";
    default:
      return method;
  }
};
