import { Button, Space } from "antd";
import { ArrowLeftOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "@tanstack/react-router";

interface UserDetailHeaderProps {
  onRefresh: () => void;
  loading?: boolean;
}

export function UserDetailHeader({
  onRefresh,
  loading = false,
}: UserDetailHeaderProps) {
  const router = useRouter();

  return (
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
          onClick={onRefresh}
          disabled={loading}
        >
          Tải lại
        </Button>
      </Space>
    </div>
  );
}




