import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Space,
  Tag,
  Upload,
  message,
} from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import {
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import type {
  IUserProfileDetail,
  IUserProfileUpdatePayload,
} from "../types";
import { AccountStatus } from "../types";

interface UserProfileCardProps {
  profile: IUserProfileDetail;
  saving: boolean;
  banning: boolean;
  updatingAvatar: boolean;
  onUpdateProfile: (payload: IUserProfileUpdatePayload) => Promise<void>;
  onUpdateAvatar: (avatar: File) => Promise<void>;
  onBanUser: () => Promise<void>;
  onUnbanUser: () => Promise<void>;
}

export function UserProfileCard({
  profile,
  saving,
  banning,
  updatingAvatar,
  onUpdateProfile,
  onUpdateAvatar,
  onBanUser,
  onUnbanUser,
}: UserProfileCardProps) {
  const [form] = Form.useForm();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>();

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
      await onUpdateProfile(payload);
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
      await onUpdateAvatar(avatarFile);
      setAvatarFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
                const file = (e.target as HTMLInputElement).files?.[0];
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
          <Descriptions.Item label="Email">{profile.email}</Descriptions.Item>
          <Descriptions.Item label="Vai trò">{profile.role}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Space>
              <Tag
                color={
                  profile.accountStatus === AccountStatus.VERIFIED
                    ? "success"
                    : profile.accountStatus === AccountStatus.BANNED
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
                  onClick={() => onUnbanUser()}
                >
                  Unban
                </Button>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<StopOutlined />}
                  loading={banning}
                  onClick={() => onBanUser()}
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
            rules={[{ required: true, message: "Vui lòng nhập tên." }]}
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
  );
}




