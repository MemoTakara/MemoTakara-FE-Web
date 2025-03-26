import "./index.css";
import logo from "@/assets/img/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AutoComplete, Input, Badge, Popconfirm } from "antd";
import {
  UserOutlined,
  BellOutlined,
  FireOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import HeaderSet from "@/components/btn/btn-header-set";
import BtnWhite from "@/components/btn/btn-white";
import BtnBlue from "@/components/btn/btn-blue";
import BtnLanguage from "@/components/btn/btn-language";

// Search bar
const getRandomInt = (max, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
const searchResult = (query) =>
  new Array(getRandomInt(5))
    .join(".")
    .split(".")
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              Found {query} on{" "}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

const UserHeader = () => {
  const [active, setActive] = useState("");
  const { t } = useTranslation();
  const { user } = useAuth();

  //Search bar
  const [optionsSearch, setOptionsSearch] = useState([]);
  const handleSearch = (value) => {
    setOptionsSearch(value ? searchResult(value) : []);
  };
  const onSelectSearch = (value) => {
    console.log("onSelectSearch", value);
  };

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
      <div class="header_container">
        <div className="header_set">
          <Link
            to="/dashboard"
            className="header_link"
            onClick={() => setActive("dashboard")}
          >
            <div className="header_logo">
              <img loading="lazy" src={logo} alt="logo" class="img" />
              <div class="header_name">MemoTakara</div>
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
            to="/statistics"
            className={`header_link ${
              active === "statistics" ? "header_active" : ""
            }`}
            onClick={() => setActive("statistics")}
          >
            <HeaderSet
              textKey="statistics"
              isActive={active === "statistics"}
              onClick={() => setActive("statistics")}
            />
          </Link>
        </div>

        <div className="header_tab">
          <AutoComplete
            popupMatchSelectWidth={252}
            style={{
              width: 360,
            }}
            options={optionsSearch}
            onSelect={onSelectSearch}
            onSearch={handleSearch}
            size="medium"
          >
            <Input.Search
              size="medium"
              placeholder={t("search.placeholder")}
              enterButton={t("search.enter")}
            />
          </AutoComplete>

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
              username={user.username}
              iconSrc="logo.png"
              iconAlt="User avatar"
              style={{
                border: "2.4px solid var(--color-button)",
                borderRadius: "30px",
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
