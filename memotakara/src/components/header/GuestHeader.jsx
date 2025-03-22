import "./index.css";
import logo from "@/assets/img/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AutoComplete, Input, Select } from "antd";
import HeaderSet from "@/components/btn/btn-header-set";
import BtnBlue from "@/components/btn/btn-blue";

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

const Header = () => {
  const [active, setActive] = useState("");

  //Search bar
  const [optionsSearch, setOptionsSearch] = useState([]);
  const handleSearch = (value) => {
    setOptionsSearch(value ? searchResult(value) : []);
  };
  const onSelectSearch = (value) => {
    console.log("onSelectSearch", value);
  };

  return (
    <div className="header_max">
      <div class="header_container">
        <div className="header_set">
          <Link to="/" className="header_link" onClick={() => setActive("/")}>
            <div className="header_logo">
              <img loading="lazy" src={logo} alt="logo" class="img" />
              <div class="header_name">MemoTakara</div>
            </div>
          </Link>

          <Link to="/" className="header_link" onClick={() => setActive("/")}>
            <HeaderSet
              defaultText="Home"
              isActive={active === "/"}
              onClick={() => setActive("/")}
            />
          </Link>

          <Link to="/" className="header_link" onClick={() => setActive("")}>
            <HeaderSet
              defaultText="About us"
              isActive={active === ""}
              onClick={() => setActive("")}
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
              placeholder="Search standard collection"
              enterButton
            />
          </AutoComplete>

          <Link
            className={`header_link ${
              active === "register" ? "header_start_active" : ""
            }`}
            to="/register"
            onClick={() => setActive("register")}
          >
            <BtnBlue defaultText="Sign up" style={{ fontSize: "15px" }} />
          </Link>

          <Link
            className={`header_link ${
              active === "login" ? "header_start_active" : ""
            }`}
            to="/login"
            onClick={() => setActive("login")}
          >
            <BtnBlue defaultText="Login" style={{ fontSize: "15px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
