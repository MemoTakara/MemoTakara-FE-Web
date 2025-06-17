import "./index.css";
import logo from "@/assets/img/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Badge, Popconfirm } from "antd";
import {
  BellOutlined,
  FireOutlined,
  BookOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import HeaderSet from "@/components/btn/btn-header-set";
import BtnWhite from "@/components/btn/btn-white";
import BtnLanguage from "@/components/btn/btn-language";
import MemoSearch from "@/components/widget/search-bar";

const UserHeader = () => {
  const [active, setActive] = useState("");
  const { t } = useTranslation();
  const { user } = useAuth();

  //Notifications
  const [notis, setNotis] = useState([
    {
      id: 0,
      visible: false,
      icon: <FireOutlined style={{ color: "red" }} />,
      title: "Way to go! You’re on a 50-day streak.",
      description: "Keep up the momentum and study again.",
      time: "2 hours ago",
    },
    {
      id: 1,
      visible: false,
      icon: <BookOutlined style={{ color: "#166dba" }} />,
      title: "Can you master the set Computer virus in learn mode?",
      description: "Find out!",
      time: "1 day ago",
    },
  ]);
  const toggleNoti = (id) => {
    setNotis(
      notis.map((noti) =>
        noti.id === id ? { ...noti, visible: !noti.visible } : noti
      )
    );
  };
  const [showNotifications, setShowNotifications] = useState(false);
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="header_max">
      <div className="header_container">
        <div className="header_set">
          <Link
            to="/dashboard"
            className="header_link"
            onClick={() => setActive("dashboard")}
          >
            <div className="header_logo">
              <img src={logo} alt="logo" className="img" />
              <div className="header_name">MemoTakara</div>
            </div>
          </Link>

          <Link
            to="/dashboard"
            className={`header_link ${
              active === "dashboard" ? "header_active" : ""
            }`}
            onClick={() => setActive("dashboard")}
          >
            <HeaderSet
              textKey="home"
              isActive={active === "dashboard"}
              onClick={() => setActive("dashboard")}
            />
          </Link>

          <Link
            className={`header_link ${
              active === "study_sets" ? "header_active" : ""
            }`}
            onClick={() => setActive("study_sets")}
            to="/study_sets"
          >
            <HeaderSet
              textKey="study_set"
              isActive={active === "study_sets"}
              onClick={() => setActive("study_sets")}
            />
          </Link>

          <Link
            to="/progress"
            className={`header_link ${
              active === "progress" ? "header_active" : ""
            }`}
            onClick={() => setActive("progress")}
          >
            <HeaderSet
              textKey="progress"
              isActive={active === "progress"}
              onClick={() => setActive("progress")}
            />
          </Link>
        </div>

        <div className="header_tab">
          <MemoSearch isGuest={false} />
          <BtnLanguage />

          <div id="header_noti_container" onClick={() => toggleNotifications()}>
            <BellOutlined id="header_bell" />
          </div>

          <Link
            className="header_link"
            to="/settings"
            onClick={() => setActive("")}
          >
            <BtnWhite
              username={`@${user.username}`}
              style={{
                border: "2px solid var(--color-button)",
                borderRadius: "30px",
                fontSize: "16px",
                // fontStyle: "italic",
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
