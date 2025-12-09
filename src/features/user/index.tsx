import { useState } from "react";
import {
  Card,
  Typography,
  Table,
  Image,
  Space,
  Button,
  Tooltip,
  Tag,
  Input,
  Select,
  Modal,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";
import { useUsers } from "./hooks/useUsers";
import type { IUser, UserRole, AccountStatus } from "./types";
import {
  UserRole as UserRoleEnum,
  AccountStatus as AccountStatusEnum,
} from "./types";
import {
  formatDate,
  getUserRoleColor,
  getUserRoleText,
  getAccountStatusColor,
  getAccountStatusText,
  FALLBACK_IMAGE,
} from "@/utils";
import { userService } from "./services/user.service";
import "./user.scss";

const { Title, Text } = Typography;
const { Option } = Select;

export default function UserPage() {
  const {
    users,
    loading,
    pagination,
    updateFilters,
    handlePageChange,
    refetch,
  } = useUsers();
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<
    AccountStatus | undefined
  >();
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const router = useRouter();

  const handleSearch = () => {
    updateFilters({
      search: searchText || undefined,
      role: selectedRole,
      status: selectedStatus,
      page: 1,
    });
  };

  const handleResetFilters = () => {
    setSearchText("");
    setSelectedRole(undefined);
    setSelectedStatus(undefined);
    updateFilters({
      search: undefined,
      role: undefined,
      status: undefined,
      page: 1,
    });
  };

  const handleEdit = (user: IUser) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    void (router as any).navigate({
      to: "/user/$id",
      params: { id: user.id },
    });
  };

  const handleBan = (user: IUser) => {
    setSelectedUser(user);
    setBanModalVisible(true);
  };

  const handleBanConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await userService.banUser(selectedUser.id);

      if (response.success) {
        message.success(
          response.message || "Đã chuyển người dùng sang trạng thái khóa."
        );
        setBanModalVisible(false);
        setSelectedUser(null);
        void refetch();
      } else {
        message.error(response.message || "Khoá người dùng thất bại!");
      }
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("Có lỗi xảy ra khi khoá người dùng!");
    }
  };

  const columns: ColumnsType<IUser> = [
    {
      title: "#",
      width: 70,
      render: (_: unknown, __: IUser, index: number) => {
        const currentPage = pagination.page || 1;
        const pageSize = pagination.limit || 10;
        return (currentPage - 1) * pageSize + index + 1;
      },
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      width: 100,
      render: (avatar: string | null | undefined) => (
        <Image
          src={avatar || undefined}
          alt="User avatar"
          width={50}
          height={50}
          style={{ objectFit: "cover", borderRadius: "50%" }}
          fallback={FALLBACK_IMAGE}
        />
      ),
    },
    {
      title: "Tên người dùng",
      key: "username",
      render: (_: unknown, record: IUser) => (
        <Space direction="vertical" size={4}>
          <Text strong>{record.username}</Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            {record.email}
          </Text>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      width: 120,
      render: (role: UserRole) => (
        <Tag color={getUserRoleColor(role)}>{getUserRoleText(role)}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      width: 120,
      render: (status: AccountStatus) => (
        <Tag color={getAccountStatusColor(status)}>
          {getAccountStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 120,
      render: (date: string | undefined) => (date ? formatDate(date) : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      width: 120,
      fixed: "right",
      render: (_: unknown, record: IUser) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Khóa tài khoản">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleBan(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-container">
      <div className="user-header">
        <Title level={2} style={{ margin: 0 }}>
          Người dùng
        </Title>
        <Text type="secondary">Quản lý danh sách người dùng và vai trò.</Text>
      </div>
      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Space wrap>
            <Input
              placeholder="Tìm kiếm theo tên hoặc email"
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              placeholder="Chọn vai trò"
              value={selectedRole}
              onChange={setSelectedRole}
              allowClear
              style={{ width: 150 }}
            >
              <Option value={UserRoleEnum.USER}>Người dùng</Option>
              <Option value={UserRoleEnum.ADMIN}>Quản trị viên</Option>
              <Option value={UserRoleEnum.PUBLISHER}>Nhà xuất bản</Option>
            </Select>
            <Select
              placeholder="Chọn trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: 150 }}
            >
              <Option value={AccountStatusEnum.NOT_VERIFY}>
                Chưa xác thực
              </Option>
              <Option value={AccountStatusEnum.VERIFIED}>Đã xác thực</Option>
              <Option value={AccountStatusEnum.BANNED}>Đã khóa</Option>
            </Select>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button onClick={handleResetFilters}>Đặt lại</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="id"
            loading={loading}
            pagination={{
              current: pagination.page,
              pageSize: pagination.limit,
              total: pagination.totalItems,
              showSizeChanger: true,
              showTotal: (total) => `Tổng ${total} người dùng`,
              onChange: handlePageChange,
              onShowSizeChange: handlePageChange,
            }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>

      {/* Ban Modal */}
      <Modal
        title="Khóa tài khoản người dùng"
        open={banModalVisible}
        onOk={handleBanConfirm}
        onCancel={() => {
          setBanModalVisible(false);
          setSelectedUser(null);
        }}
        okText="Khóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn chuyển người dùng{" "}
          <strong>{selectedUser?.username}</strong> sang trạng thái khóa? Hành
          động này sẽ ngăn họ truy cập hệ thống cho tới khi được mở khóa lại.
        </p>
      </Modal>
    </div>
  );
}
