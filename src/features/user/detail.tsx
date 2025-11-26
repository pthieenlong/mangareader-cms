import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Form,
  Input,
  List,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  Tag,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { UploadFile } from "antd/es/upload/interface";
import {
  ArrowLeftOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useParams, useRouter } from "@tanstack/react-router";
import { useUserProfile } from "./hooks/useUserProfile";
import type {
  IPublisherBook,
  IPublisherOverviewStats,
  IUserFavorite,
  IUserOrderHistory,
  IUserOverviewStats,
  IUserProfileUpdatePayload,
} from "./types";
import { UserRole } from "./types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { OrderStatus, PayingMethod } from "@/features/order/types";
import { AccountStatus } from "./types";
import "./user-detail.scss";

const userOverviewCards: Array<{
  key: keyof IUserOverviewStats;
  label: string;
  formatter?: (value: number) => string;
}> = [
  { key: "totalSpend", label: "Tổng chi tiêu", formatter: formatCurrency },
  { key: "purchasedCount", label: "Số truyện đã mua" },
  { key: "favoriteCount", label: "Số truyện yêu thích" },
  { key: "readingCount", label: "Số truyện đã đọc" },
];

const publisherOverviewCards: Array<{
  key: keyof IPublisherOverviewStats;
  label: string;
  formatter?: (value: number) => string;
}> = [
  { key: "totalRevenue", label: "Doanh thu", formatter: formatCurrency },
  { key: "publishedBookCount", label: "Số truyện đã đăng tải" },
];

const payingMethodText: Record<PayingMethod, string> = {
  [PayingMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PayingMethod.CREDIT_CARD]: "Thẻ tín dụng",
  [PayingMethod.E_WALLET]: "Ví điện tử",
};

const orderStatusColor: Partial<Record<OrderStatus, string>> = {
  [OrderStatus.COMPLETED]: "success",
  [OrderStatus.PAID]: "green",
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.CANCELLED]: "default",
  [OrderStatus.REFUNDED]: "purple",
  [OrderStatus.FAILED]: "red",
  [OrderStatus.ERROR]: "red",
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams({ strict: false }) as { id?: string };
  const userId = params.id;
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const {
    loading,
    saving,
    banning,
    updatingAvatar,
    overview,
    profile,
    orders,
    favorites,
    publisherBooks,
    updateProfile,
    updateAvatar,
    refresh,
    banUser,
    unbanUser,
  } = useUserProfile(userId);

  const isPublisher = profile?.role === UserRole.PUBLISHER;

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        username: profile.username,
      });
    }
  }, [form, profile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(avatarFile);
    setAvatarPreview(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [avatarFile]);

  const uploadFileList: UploadFile[] = useMemo(() => {
    if (avatarPreview) {
      return [
        {
          uid: "new-avatar",
          name: avatarFile?.name ?? "avatar-preview",
          status: "done",
          url: avatarPreview,
        },
      ];
    }
    if (profile?.avatar) {
      return [
        {
          uid: "current-avatar",
          name: "avatar",
          status: "done",
          url: profile.avatar,
        },
      ];
    }
    return [];
  }, [avatarPreview, avatarFile?.name, profile?.avatar]);

  const handleProfileSubmit = async () => {
    try {
      const values = await form.validateFields();
      const payload: IUserProfileUpdatePayload = {
        username: values.username,
      };
      await updateProfile(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!avatarFile) {
      message.warning("Vui lòng chọn ảnh đại diện.");
      return;
    }
    try {
      await updateAvatar(avatarFile);
      setAvatarFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleViewOrder = (order: IUserOrderHistory) => {
    if (!userId || !order.id) {
      message.warning("Thiếu thông tin để mở chi tiết đơn hàng.");
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void (router as any).navigate({
      to: "/order/$userId/$orderId",
      params: { userId, orderId: order.id },
    });
  };

  const orderColumns: ColumnsType<IUserOrderHistory> = [
    { title: "Mã đơn", dataIndex: "code" },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (value: string) => formatDate(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (value: OrderStatus) => (
        <Tag color={orderStatusColor[value] || "default"}>{value}</Tag>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Thanh toán",
      dataIndex: "payingMethod",
      render: (value: PayingMethod) => payingMethodText[value],
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: unknown, record: IUserOrderHistory) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewOrder(record)}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  if (!userId) {
    return (
      <Empty description="Không tìm thấy người dùng, vui lòng quay lại danh sách." />
    );
  }

  return (
    <div className="user-detail-page">
      <div className="user-detail-page__header">
        <Space align="center" size="middle">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() =>
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (router as any).navigate({ to: "/user" })
            }
          >
            Quay lại
          </Button>
        </Space>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => refresh()}
            disabled={loading}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      <Spin spinning={loading}>
        {profile ? (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <section>
              <Row gutter={[16, 16]}>
                {isPublisher
                  ? publisherOverviewCards.map((card) => {
                      const rawValue =
                        overview && "totalRevenue" in overview
                          ? overview[card.key]
                          : 0;
                      return (
                        <Col key={card.key} xs={12} md={6}>
                          <Card>
                            <Statistic
                              title={card.label}
                              value={
                                card.formatter && typeof rawValue === "number"
                                  ? card.formatter(rawValue)
                                  : rawValue
                              }
                            />
                          </Card>
                        </Col>
                      );
                    })
                  : userOverviewCards.map((card) => {
                      const rawValue =
                        overview && "totalSpend" in overview
                          ? overview[card.key]
                          : 0;
                      return (
                        <Col key={card.key} xs={12} md={6}>
                          <Card>
                            <Statistic
                              title={card.label}
                              value={
                                card.formatter && typeof rawValue === "number"
                                  ? card.formatter(rawValue)
                                  : rawValue
                              }
                            />
                          </Card>
                        </Col>
                      );
                    })}
              </Row>
            </section>

            <section>
              <Row gutter={16}>
                <Col xs={24} md={9}>
                  <Card title="Thông tin cá nhân">
                    <Space
                      direction="vertical"
                      size="middle"
                      className="user-detail-page__profile"
                    >
                      <Space
                        direction="vertical"
                        size="middle"
                        style={{ width: "100%" }}
                      >
                        <Upload
                          className="user-detail-page__avatar-upload"
                          fileList={uploadFileList}
                          listType="picture-card"
                          maxCount={1}
                          beforeUpload={(file) => {
                            setAvatarFile(file);
                            return false;
                          }}
                          onRemove={() => {
                            setAvatarFile(null);
                          }}
                          showUploadList={{
                            showPreviewIcon: false,
                            showRemoveIcon: true,
                          }}
                        >
                          {!uploadFileList.length && "+ Ảnh đại diện"}
                        </Upload>
                        <Button
                          type="default"
                          icon={<EditOutlined />}
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) {
                                setAvatarFile(file);
                              }
                            };
                            input.click();
                          }}
                          block
                        >
                          Chỉnh sửa ảnh đại diện
                        </Button>
                        {avatarFile && (
                          <Button
                            type="primary"
                            icon={<CameraOutlined />}
                            loading={updatingAvatar}
                            onClick={handleAvatarSubmit}
                            block
                          >
                            Cập nhật avatar
                          </Button>
                        )}
                      </Space>
                      <Descriptions column={1} size="small">
                        <Descriptions.Item label="Email">
                          {profile.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                          {profile.role}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                          <Space>
                            <Tag
                              color={
                                profile.accountStatus === AccountStatus.VERIFIED
                                  ? "success"
                                  : profile.accountStatus ===
                                    AccountStatus.BANNED
                                  ? "error"
                                  : "warning"
                              }
                            >
                              {profile.accountStatus}
                            </Tag>
                            {profile.accountStatus === AccountStatus.BANNED ? (
                              <Button
                                type="primary"
                                danger={false}
                                icon={<CheckCircleOutlined />}
                                loading={banning}
                                onClick={() => unbanUser()}
                              >
                                Unban
                              </Button>
                            ) : (
                              <Button
                                type="primary"
                                danger
                                icon={<StopOutlined />}
                                loading={banning}
                                onClick={() => banUser()}
                              >
                                Ban
                              </Button>
                            )}
                          </Space>
                        </Descriptions.Item>
                      </Descriptions>

                      <Form
                        form={form}
                        layout="vertical"
                        initialValues={{
                          username: profile.username,
                        }}
                      >
                        <Form.Item
                          label="Tên người dùng"
                          name="username"
                          rules={[
                            { required: true, message: "Vui lòng nhập tên." },
                          ]}
                        >
                          <Input prefix={<EditOutlined />} />
                        </Form.Item>
                        <Space>
                          <Button
                            type="primary"
                            loading={saving}
                            onClick={handleProfileSubmit}
                          >
                            Lưu thay đổi
                          </Button>
                          <Button
                            onClick={() => {
                              form.resetFields();
                            }}
                          >
                            Đặt lại
                          </Button>
                        </Space>
                      </Form>
                    </Space>
                  </Card>
                </Col>
                {!isPublisher && (
                  <Col xs={24} md={15}>
                    <Card title="Lịch sử đơn hàng">
                      <Table
                        columns={orderColumns}
                        dataSource={orders}
                        rowKey="id"
                        pagination={false}
                        locale={{
                          emptyText: "Chưa có đơn hàng nào.",
                        }}
                        scroll={{ x: 600 }}
                      />
                    </Card>
                  </Col>
                )}
              </Row>
            </section>

            <section>
              <Card
                title={
                  isPublisher
                    ? "Danh sách truyện đã đăng tải"
                    : "Danh sách truyện yêu thích"
                }
              >
                {isPublisher ? (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={publisherBooks}
                    locale={{ emptyText: "Chưa có truyện nào." }}
                    renderItem={(item: IPublisherBook) => (
                      <List.Item key={item.id}>
                        <Card
                          cover={
                            item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                style={{ height: 180, objectFit: "cover" }}
                              />
                            ) : null
                          }
                        >
                          <Card.Meta
                            title={item.title}
                            description={
                              <Space direction="vertical" size={4}>
                                <span>
                                  Tác giả: {item.author || "Đang cập nhật"}
                                </span>
                                <span>
                                  Thể loại:{" "}
                                  {item.categories.join(", ") || "Chưa có"}
                                </span>
                                <span>
                                  Trạng thái:{" "}
                                  <Tag
                                    color={
                                      item.status === "PUBLISHED"
                                        ? "success"
                                        : item.status === "PENDING"
                                        ? "warning"
                                        : "default"
                                    }
                                  >
                                    {item.status}
                                  </Tag>
                                </span>
                                <span>
                                  Lượt xem: {item.view ?? 0} | Lượt thích:{" "}
                                  {item.likeCount ?? 0}
                                </span>
                                <span>
                                  Ngày tạo:{" "}
                                  {item.createdAt
                                    ? formatDate(item.createdAt)
                                    : "-"}
                                </span>
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                ) : (
                  <List
                    grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
                    dataSource={favorites}
                    locale={{ emptyText: "Chưa có truyện yêu thích." }}
                    renderItem={(item: IUserFavorite) => (
                      <List.Item key={item.id}>
                        <Card
                          cover={
                            item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                style={{ height: 180, objectFit: "cover" }}
                              />
                            ) : null
                          }
                        >
                          <Card.Meta
                            title={item.title}
                            description={
                              <Space direction="vertical" size={4}>
                                <span>
                                  Tác giả: {item.author || "Đang cập nhật"}
                                </span>
                                <span>
                                  Thể loại: {item.categories.join(", ")}
                                </span>
                                <span>
                                  Đã mua:{" "}
                                  {item.purchasedAt
                                    ? formatDate(item.purchasedAt)
                                    : "-"}
                                </span>
                              </Space>
                            }
                          />
                        </Card>
                      </List.Item>
                    )}
                  />
                )}
              </Card>
            </section>
          </Space>
        ) : (
          <Empty description="Không tìm thấy dữ liệu người dùng." />
        )}
      </Spin>
    </div>
  );
}
