import { Modal, Typography, Spin } from "antd";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import type { ReactNode } from "react";
import "./status-modal.scss";

const { Title, Paragraph } = Typography;

export type StatusModalStatus = "loading" | "success" | "error";

interface StatusModalProps {
  open: boolean;
  status: StatusModalStatus;
  title?: string;
  description?: string;
  onClose?: () => void;
  closable?: boolean;
  footer?: ReactNode;
}

const statusConfigs: Record<StatusModalStatus, { icon: ReactNode }> = {
  loading: {
    icon: <Spin size="large" />,
  },
  success: {
    icon: (
      <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
    ),
  },
  error: {
    icon: (
      <CloseCircleTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 48 }} />
    ),
  },
};

export function StatusModal({
  open,
  status,
  title,
  description,
  onClose,
  closable = status !== "loading",
  footer,
}: StatusModalProps) {
  const statusTitle =
    title ??
    (status === "loading"
      ? "Đang xử lý..."
      : status === "success"
      ? "Thành công"
      : "Có lỗi xảy ra");

  const statusDescription =
    description ??
    (status === "loading"
      ? "Vui lòng chờ trong giây lát."
      : status === "success"
      ? "Hoàn tất thao tác."
      : "Vui lòng thử lại sau.");

  return (
    <Modal
      open={open}
      onCancel={closable ? onClose : undefined}
      footer={footer}
      closable={closable}
      centered
      className="status-modal"
    >
      <div className="status-modal__content">
        <div className="status-modal__icon">{statusConfigs[status].icon}</div>
        <Title level={4}>{statusTitle}</Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          {statusDescription}
        </Paragraph>
      </div>
    </Modal>
  );
}
