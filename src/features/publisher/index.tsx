import { Card, Typography, Table, Space, Avatar, Tag, Button, Modal, message, Input } from "antd";
import { CheckOutlined, CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { usePendingPublishers } from "./hooks/usePendingPublishers";
import type { IPublisherApplication } from "./types";
import { AccountStatus } from "./types";
import { formatDate } from "@/utils";
import { useState } from "react";
import { publisherService } from "./services/publisher.service";
import "./publisher.scss";

const { Title, Text, Paragraph } = Typography;

const getAccountStatusColor = (status: AccountStatus): string => {
  const colors = {
    [AccountStatus.ACTIVE]: "success",
    [AccountStatus.INACTIVE]: "default",
    [AccountStatus.BANNED]: "error",
    [AccountStatus.PENDING]: "warning",
  };
  return colors[status] || "default";
};

const getAccountStatusText = (status: AccountStatus): string => {
  const texts = {
    [AccountStatus.ACTIVE]: "Hoạt động",
    [AccountStatus.INACTIVE]: "Không hoạt động",
    [AccountStatus.BANNED]: "Bị khóa",
    [AccountStatus.PENDING]: "Đang chờ",
  };
  return texts[status] || status;
};

export default function PendingPublishersPage() {
  const { applications, loading, pagination, handlePageChange, refetch } =
    usePendingPublishers();
  const [selectedApplication, setSelectedApplication] = useState<IPublisherApplication | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectingApplication, setRejectingApplication] = useState<IPublisherApplication | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setApproving(true);
      console.log("Approving publisher:", id);
      const response = await publisherService.approvePublisher(id);
      console.log("Approve response:", response);
      message.success("Phê duyệt publisher thành công");
      await refetch();
      setShowDetailsModal(false);
    } catch (error: any) {
      console.error("Approve error:", error);
      message.error(error?.response?.data?.message || "Phê duyệt thất bại");
    } finally {
      setApproving(false);
    }
  };

  const showRejectModal = (application: IPublisherApplication) => {
    setRejectingApplication(application);
    setRejectReason("Thông tin đăng ký chưa đầy đủ hoặc chưa đáp ứng yêu cầu. Vui lòng kiểm tra lại và nộp đơn lại.");
    setRejectModalVisible(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) {
      message.error("Vui lòng nhập lý do từ chối");
      return;
    }

    if (!rejectingApplication) return;

    try {
      setRejecting(true);
      console.log("Rejecting publisher:", rejectingApplication.id, "reason:", rejectReason);
      const response = await publisherService.rejectPublisher(rejectingApplication.id, rejectReason.trim());
      console.log("Reject response:", response);
      message.success("Từ chối publisher thành công");
      await refetch();
      setRejectModalVisible(false);
      setShowDetailsModal(false);
    } catch (error: any) {
      console.error("Reject error:", error);
      message.error(error?.response?.data?.message || "Từ chối thất bại");
    } finally {
      setRejecting(false);
    }
  };

  const handleRejectCancel = () => {
    setRejectModalVisible(false);
    setRejectReason("");
    setRejectingApplication(null);
  };

  const columns: ColumnsType<IPublisherApplication> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: IPublisherApplication, index: number) => {
        const currentPage = pagination.page || 1;
        const pageSize = pagination.limit || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Người dùng",
      key: "user",
      width: 300,
      render: (_: unknown, record: IPublisherApplication) => (
        <Space size={12}>
          <Avatar src={record.user.avatar} size={48}>
            {record.user.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Space direction="vertical" size={2}>
            <Text strong>{record.user.username}</Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {record.user.email}
            </Text>
            <Tag
              color={getAccountStatusColor(record.user.accountStatus)}
              style={{ marginTop: 4 }}
            >
              {getAccountStatusText(record.user.accountStatus)}
            </Tag>
          </Space>
        </Space>
      ),
    },
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      width: 120,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 130,
      render: (text: string) => (
        <Text code style={{ fontSize: "12px" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Lý do đăng ký",
      dataIndex: "reason",
      key: "reason",
      width: 250,
      ellipsis: true,
      render: (text: string) => (
        <Text ellipsis={{ tooltip: text }} style={{ maxWidth: 250 }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Ngày nộp đơn",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 140,
      render: (date: Date) => formatDate(date.toString()),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      fixed: "right",
      render: (_: unknown, record: IPublisherApplication) => (
        <Space>
          <Button
            type="link"
            icon={<FileTextOutlined />}
            onClick={() => {
              setSelectedApplication(record);
              setShowDetailsModal(true);
            }}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(record.id)}
            loading={approving}
          >
            Duyệt
          </Button>
          <Button
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => showRejectModal(record)}
            loading={rejecting}
          >
            Từ chối
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="publisher-container">
      <div className="publisher-header">
        <Title level={2} style={{ margin: 0 }}>
          Publisher đang chờ phê duyệt
        </Title>
        <Text type="secondary">
          Danh sách các đơn đăng ký trở thành publisher đang chờ phê duyệt.
        </Text>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={applications}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.limit,
            total: pagination.totalItems,
            showSizeChanger: false,
            showTotal: (total) => `Tổng ${total} đơn đăng ký`,
            onChange: handlePageChange,
          }}
          scroll={{ x: 1400 }}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        title="Chi tiết đơn đăng ký Publisher"
        open={showDetailsModal}
        onCancel={() => setShowDetailsModal(false)}
        width={700}
        footer={[
          <Button key="cancel" onClick={() => setShowDetailsModal(false)}>
            Đóng
          </Button>,
          <Button
            key="reject"
            danger
            icon={<CloseOutlined />}
            onClick={() => selectedApplication && showRejectModal(selectedApplication)}
            loading={rejecting}
          >
            Từ chối
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => selectedApplication && handleApprove(selectedApplication.id)}
            loading={approving}
          >
            Phê duyệt
          </Button>,
        ]}
      >
        {selectedApplication && (
          <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
              <Text strong>Người dùng:</Text>
              <Space style={{ marginLeft: 8 }}>
                <Avatar src={selectedApplication.user.avatar}>
                  {selectedApplication.user.username?.[0]?.toUpperCase()}
                </Avatar>
                <Space direction="vertical" size={0}>
                  <Text>{selectedApplication.user.username}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {selectedApplication.user.email}
                  </Text>
                </Space>
              </Space>
            </div>
            <div>
              <Text strong>Họ và tên:</Text>
              <Text style={{ marginLeft: 8 }}>{selectedApplication.fullName}</Text>
            </div>
            <div>
              <Text strong>Ngày sinh:</Text>
              <Text style={{ marginLeft: 8 }}>{selectedApplication.dateOfBirth}</Text>
            </div>
            <div>
              <Text strong>Số điện thoại:</Text>
              <Text code style={{ marginLeft: 8 }}>{selectedApplication.phoneNumber}</Text>
            </div>
            <div>
              <Text strong>Lý do đăng ký:</Text>
              <Paragraph style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                {selectedApplication.reason}
              </Paragraph>
            </div>
            {selectedApplication.personalStoryFiles && selectedApplication.personalStoryFiles.length > 0 && (
              <div>
                <Text strong>File đính kèm:</Text>
                <Space direction="vertical" style={{ marginTop: 8 }}>
                  {selectedApplication.personalStoryFiles.map((url, index) => (
                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                      File {index + 1}
                    </a>
                  ))}
                </Space>
              </div>
            )}
            <div>
              <Text strong>Ngày nộp đơn:</Text>
              <Text style={{ marginLeft: 8 }}>
                {formatDate(selectedApplication.createdAt.toString())}
              </Text>
            </div>
          </Space>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối đơn đăng ký"
        open={rejectModalVisible}
        onCancel={handleRejectCancel}
        onOk={handleRejectConfirm}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: rejecting }}
        width={600}
      >
        <div>
          <p style={{ marginBottom: 16 }}>Vui lòng nhập lý do từ chối:</p>
          <Input.TextArea
            rows={4}
            placeholder="Ví dụ: Thông tin cá nhân chưa đầy đủ, thiếu mô tả mục đích xuất bản..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
