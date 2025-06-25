import "./index.css";
import logo from "@/assets/img/logo.png";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge, Dropdown, Menu, Popover } from "antd";
import {
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

import { useAuth } from "@/contexts/AuthContext";
import { getUnreadNotificationCount } from "@/api/notification";

import HeaderSet from "@/components/btn/btn-header-set";
import BtnLanguage from "@/components/btn/btn-language";
import BtnWhite from "@/components/btn/btn-white";
import NotificationDropdown from "@/components/widget/noti-header-drop";
import MemoSearch from "@/components/widget/search-bar";

const UserHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [active, setActive] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadNotificationCount();
      if (res.success) {
        setUnreadCount(res.data.unread_count);
      }
    } catch (err) {
      console.error("Lỗi khi lấy số lượng thông báo chưa đọc:", err);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        key="settings"
        icon={
          <SettingOutlined style={{ fontSize: "var(--normal-font-size)" }} />
        }
        onClick={() => navigate("/settings")}
        style={{ fontSize: "var(--normal-font-size)" }}
      >
        {t("views.pages.settings.setting")}
      </Menu.Item>
      <Menu.Item
        key="logout"
        icon={
          <LogoutOutlined
            style={{
              color: "var(--color-error-button)",
              fontSize: "var(--normal-font-size)",
            }}
          />
        }
        onClick={handleLogout}
        style={{ fontSize: "var(--normal-font-size)" }}
      >
        {t("buttons.logout")}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header_max">
      <div className="header_container">
        <div className="header_set">
          <div
            className="header_link"
            onClick={() => {
              setActive("dashboard");
              navigate("/dashboard");
            }}
          >
            <div className="header_logo">
              <img src={logo} alt="logo" className="img" />
              <div className="header_name">MemoTakara</div>
            </div>
          </div>

          <div
            className={`header_link ${
              active === "dashboard" ? "header_active" : ""
            }`}
            onClick={() => {
              setActive("dashboard");
              navigate("/dashboard");
            }}
          >
            <HeaderSet textKey="home" isActive={active === "dashboard"} />
          </div>

          <div
            className={`header_link ${
              active === "study_sets" ? "header_active" : ""
            }`}
            onClick={() => {
              setActive("study_sets");
              navigate("/study_sets");
            }}
          >
            <HeaderSet textKey="study_set" isActive={active === "study_sets"} />
          </div>

          <div
            className={`header_link ${
              active === "progress" ? "header_active" : ""
            }`}
            onClick={() => {
              setActive("progress");
              navigate("/progress");
            }}
          >
            <HeaderSet textKey="progress" isActive={active === "progress"} />
          </div>
        </div>

        <div className="header_tab">
          <MemoSearch isGuest={false} />
          <BtnLanguage />

          <div id="header_noti_container">
            <Popover
              content={<NotificationDropdown />}
              trigger="hover"
              placement="bottomRight"
              overlayClassName="noti-popover"
            >
              <Badge count={unreadCount} size="small">
                <BellOutlined id="header_bell" />
              </Badge>
            </Popover>
          </div>

          <Dropdown overlay={menu} placement="bottomRight" trigger={["hover"]}>
            <div className="header_link" style={{ cursor: "pointer" }}>
              <BtnWhite
                username={`@${user.username}`}
                style={{
                  border: "2px solid var(--color-button)",
                  borderRadius: "30px",
                  fontSize: "var(--normal-font-size)",
                }}
              />
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
