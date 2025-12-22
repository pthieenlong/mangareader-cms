import { useState, useEffect } from "react";
import { Badge, Popover } from "antd";
import { BellOutlined } from "@ant-design/icons";
import { useUnreadCount } from "../hooks/useUnreadCount";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount, refetch } = useUnreadCount();

  // Refetch when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  const content = (
    <NotificationDropdown onClose={() => setIsOpen(false)} />
  );

  return (
    <Popover
      content={content}
      trigger="click"
      open={isOpen}
      onOpenChange={setIsOpen}
      placement="bottomRight"
      overlayStyle={{ width: 400, maxWidth: "90vw" }}
    >
      <Badge count={unreadCount > 99 ? "99+" : unreadCount} offset={[-5, 5]}>
        <BellOutlined style={{ fontSize: 18, cursor: "pointer" }} />
      </Badge>
    </Popover>
  );
}
