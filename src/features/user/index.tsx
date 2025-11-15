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
  Form,
  Upload,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { useUsers } from "./hooks/useUsers";
import type { IUser, UserRole, AccountStatus } from "./types";
import { UserRole as UserRoleEnum, AccountStatus as AccountStatusEnum } from "./types";
import { formatDate } from "@/lib/utils";
import { userService } from "./services/user.service";
import "./user.scss";

const { Title, Text } = Typography;
const { Option } = Select;

const FALLBACK_IMAGE =
  "data:image/png;base64,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";

const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return "red";
    case UserRoleEnum.PUBLISHER:
      return "blue";
    case UserRoleEnum.MODERATOR:
      return "orange";
    case UserRoleEnum.USER:
    default:
      return "default";
  }
};

const getStatusColor = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatusEnum.VERIFIED:
      return "success";
    case AccountStatusEnum.NOT_VERIFY:
      return "warning";
    case AccountStatusEnum.BANNED:
      return "error";
    default:
      return "default";
  }
};

const getStatusText = (status: AccountStatus): string => {
  switch (status) {
    case AccountStatusEnum.VERIFIED:
      return "Đã xác thực";
    case AccountStatusEnum.NOT_VERIFY:
      return "Chưa xác thực";
    case AccountStatusEnum.BANNED:
      return "Đã khóa";
    default:
      return status;
  }
};

const getRoleText = (role: UserRole): string => {
  switch (role) {
    case UserRoleEnum.ADMIN:
      return "Quản trị viên";
    case UserRoleEnum.PUBLISHER:
      return "Nhà xuất bản";
    case UserRoleEnum.MODERATOR:
      return "Điều hành viên";
    case UserRoleEnum.USER:
    default:
      return "Người dùng";
  }
};

export default function UserPage() {
  const { users, loading, pagination, updateFilters, handlePageChange, refetch } =
    useUsers();
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<AccountStatus | undefined>();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [form] = Form.useForm();
  const [uploadFile, setUploadFile] = useState<File | null>(null);

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
    setSelectedUser(user);
    form.setFieldsValue({
      username: user.username,
    });
    setUploadFile(null);
    setEditModalVisible(true);
  };

  const handleDelete = (user: IUser) => {
    setSelectedUser(user);
    setDeleteModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!selectedUser) return;

      const response = await userService.updateUser(selectedUser.id, {
        username: values.username,
        avatar: uploadFile || undefined,
      });

      if (response.success) {
        message.success("Cập nhật người dùng thành công!");
        setEditModalVisible(false);
        setSelectedUser(null);
        form.resetFields();
        setUploadFile(null);
        void refetch();
      } else {
        message.error(response.message || "Cập nhật người dùng thất bại!");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      message.error("Có lỗi xảy ra khi cập nhật người dùng!");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      const response = await userService.deleteUser(selectedUser.id);

      if (response.success) {
        message.success("Xóa người dùng thành công!");
        setDeleteModalVisible(false);
        setSelectedUser(null);
        void refetch();
      } else {
        message.error(response.message || "Xóa người dùng thất bại!");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Có lỗi xảy ra khi xóa người dùng!");
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
        <Tag color={getRoleColor(role)}>{getRoleText(role)}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "accountStatus",
      width: 120,
      render: (status: AccountStatus) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: "Thiết bị hoạt động",
      dataIndex: "activeDevices",
      width: 120,
      align: "center",
      render: (devices: number) => <Text>{devices}</Text>,
    },
    {
      title: "Nhà cung cấp",
      key: "provider",
      width: 120,
      render: (_: unknown, record: IUser) => {
        if (record.googleID) {
          return <Tag color="blue">Google</Tag>;
        }
        if (record.facebookID) {
          return <Tag color="blue">Facebook</Tag>;
        }
        return <Text type="secondary">-</Text>;
      },
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
          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
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
        <Text type="secondary">
          Quản lý danh sách người dùng và vai trò.
        </Text>
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
              <Option value={UserRoleEnum.MODERATOR}>Điều hành viên</Option>
            </Select>
            <Select
              placeholder="Chọn trạng thái"
              value={selectedStatus}
              onChange={setSelectedStatus}
              allowClear
              style={{ width: 150 }}
            >
              <Option value={AccountStatusEnum.NOT_VERIFY}>Chưa xác thực</Option>
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

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa người dùng"
        open={editModalVisible}
        onOk={handleEditSubmit}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
          form.resetFields();
          setUploadFile(null);
        }}
        okText="Cập nhật"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[
              { required: true, message: "Vui lòng nhập tên người dùng!" },
              { min: 3, message: "Tên người dùng phải có ít nhất 3 ký tự!" },
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>
          <Form.Item label="Ảnh đại diện" name="avatar">
            <Upload
              beforeUpload={(file) => {
                setUploadFile(file);
                return false;
              }}
              onRemove={() => {
                setUploadFile(null);
              }}
              maxCount={1}
              listType="picture-card"
              fileList={
                uploadFile
                  ? [
                      {
                        uid: "-1",
                        name: uploadFile.name,
                        status: "done",
                        url: URL.createObjectURL(uploadFile),
                      },
                    ]
                  : selectedUser?.avatar
                    ? [
                        {
                          uid: "-2",
                          name: "current-avatar",
                          status: "done",
                          url: selectedUser.avatar,
                        },
                      ]
                    : []
              }
            >
              {(!uploadFile && !selectedUser?.avatar) && "+ Tải lên"}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        title="Xác nhận xóa"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedUser(null);
        }}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc chắn muốn xóa người dùng{" "}
          <strong>{selectedUser?.username}</strong> không? Hành động này không
          thể hoàn tác.
        </p>
      </Modal>
    </div>
  );
}
