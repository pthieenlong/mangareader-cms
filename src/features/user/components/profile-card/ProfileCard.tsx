import { Avatar, Card, Descriptions, Space, Tag, Button } from "antd";
import { CheckCircleOutlined, StopOutlined, UserOutlined } from "@ant-design/icons";
import type { IUserProfileDetail } from "../../types";
import { AccountStatus } from "../../types";

interface ProfileCardProps {
  profile: IUserProfileDetail;
  banning: boolean;
  onBanUser?: () => Promise<void>;
  onUnbanUser?: () => Promise<void>;
}

export function ProfileCard({
  profile,
  banning,
  onBanUser,
  onUnbanUser,
}: ProfileCardProps) {
  return (
    <Card title="Thông tin cá nhân">
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Avatar
            size={100}
            src={profile.avatar || undefined}
            icon={<UserOutlined />}
          >
            {profile.username?.[0]?.toUpperCase() ?? "U"}
          </Avatar>
        </div>

        <Descriptions column={1} size="small">
          <Descriptions.Item label="Tên người dùng">
            {profile.username}
          </Descriptions.Item>
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
                  onClick={() => onUnbanUser?.()}
                  disabled={!onUnbanUser}
                >
                  Unban
                </Button>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<StopOutlined />}
                  loading={banning}
                  onClick={() => onBanUser?.()}
                  disabled={!onBanUser}
                >
                  Ban
                </Button>
              )}
            </Space>
          </Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}
