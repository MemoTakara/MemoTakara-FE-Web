import "./noti-header-drop.css";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Dropdown, Menu, Spin, Tabs, Typography, message } from "antd";
import {
  BellOutlined,
  EllipsisOutlined,
  NotificationOutlined,
  StarOutlined,
  CopyOutlined,
  CheckOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

import {
  getRecentNotifications,
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  deleteAllReadNotifications,
  getNotifications,
} from "@/api/notification";

import FormattedDate from "@/components/widget/formatted-date";

const iconMap = {
  system: <NotificationOutlined style={{ color: "#1677ff" }} />,
  collection_duplicated: <CopyOutlined style={{ color: "#52c41a" }} />,
  collection_rated: <StarOutlined style={{ color: "#fadb14" }} />,
  study_due: <BellOutlined style={{ color: "#ff4d4f" }} />,
};

const NotificationDropdown = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(true);
  const [recentNotis, setRecentNotis] = useState([]);
  const [unreadNotis, setUnreadNotis] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recentRes, unreadRes] = await Promise.all([
        getRecentNotifications(),
        getNotifications({ is_read: 0, per_page: 50 }),
      ]);
      if (recentRes.success) setRecentNotis(recentRes.data);
      if (unreadRes.success && unreadRes.data?.data)
        setUnreadNotis(unreadRes.data.data);
    } catch (e) {
      messageApi.error(t("components.noti-drop.noti-load-error"));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      fetchData();
    } catch {
      messageApi.error(t("components.noti-drop.mark-error"));
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      fetchData();
    } catch {
      messageApi.error(t("components.noti-drop.delete-error"));
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsAsRead();
      fetchData();
    } catch {
      messageApi.error(t("components.noti-drop.all-mark-error"));
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllReadNotifications();
      fetchData();
    } catch {
      messageApi.error(t("components.noti-drop.all-mark-delete-error"));
    }
  };

  const renderNotiItems = (list) => {
    return list.length === 0 ? (
      <div style={{ textAlign: "center", padding: 12 }}>
        {t("components.noti-drop.no-noti")}
      </div>
    ) : (
      list.map((n) => (
        <div className={`noti-item ${n.is_read ? "read" : ""}`} key={n.id}>
          <div className="noti-icon">{iconMap[n.type] || <BellOutlined />}</div>
          <div className="noti-content">
            <Typography.Text strong>{n.message}</Typography.Text>
            <div style={{ fontSize: 12, color: "#888" }}>
              <FormattedDate dateString={n.created_at} />
            </div>
          </div>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                {!n.is_read && (
                  <Menu.Item
                    icon={<CheckOutlined />}
                    onClick={() => handleMarkRead(n.id)}
                  >
                    {t("components.noti-drop.mark")}
                  </Menu.Item>
                )}
                <Menu.Item
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(n.id)}
                >
                  {t("tooltip.delete")}
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <EllipsisOutlined style={{ cursor: "pointer" }} />
          </Dropdown>
        </div>
      ))
    );
  };

  return (
    <>
      {contextHolder}
      <div className="noti-dropdown">
        <div className="noti-dropdown-header">
          <Button type="link" size="small" onClick={handleMarkAll}>
            {t("components.noti-drop.mark-all")}
          </Button>
          <Button type="link" size="small" danger onClick={handleDeleteAll}>
            {t("components.noti-drop.delete-mark")}
          </Button>
        </div>
        <div className="noti-dropdown-body">
          <Tabs
            defaultActiveKey="recent"
            items={[
              {
                key: "recent",
                label: t("components.noti-drop.recent"),
                children: loading ? <Spin /> : renderNotiItems(recentNotis),
              },
              {
                key: "unread",
                label: t("components.noti-drop.unread"),
                children: loading ? <Spin /> : renderNotiItems(unreadNotis),
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
