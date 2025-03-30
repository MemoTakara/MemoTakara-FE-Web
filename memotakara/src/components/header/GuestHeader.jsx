import "./index.css";
import logo from "@/assets/img/logo.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderSet from "@/components/btn/btn-header-set";
import BtnBlue from "@/components/btn/btn-blue";
import BtnLanguage from "@/components/btn/btn-language";
import MemoSearch from "@/components/search-bar";

const GuestHeader = () => {
  const [active, setActive] = useState("");

  return (
    <div className="header_max">
      <div className="header_container">
        <div className="header_set">
          <Link to="/" className="header_link" onClick={() => setActive("/")}>
            <div className="header_logo">
              <img src={logo} alt="logo" className="img" />
              <div className="header_name">MemoTakara</div>
            </div>
          </Link>

          <Link to="/" className="header_link" onClick={() => setActive("/")}>
            <HeaderSet
              textKey="home"
              isActive={active === "/"}
              onClick={() => setActive("/")}
            />
          </Link>

          <Link to="/" className="header_link" onClick={() => setActive("")}>
            <HeaderSet
              textKey="about_us"
              isActive={active === ""}
              onClick={() => setActive("")}
            />
          </Link>
        </div>

        <div className="header_tab">
          <MemoSearch />
          <BtnLanguage />

          <Link
            className={`header_link ${
              active === "register" ? "header_start_active" : ""
            }`}
            to="/register"
            onClick={() => setActive("register")}
          >
            <BtnBlue textKey="register" style={{ fontSize: "15px" }} />
          </Link>

          <Link
            className={`header_link ${
              active === "login" ? "header_start_active" : ""
            }`}
            to="/login"
            onClick={() => setActive("login")}
          >
            <BtnBlue textKey="login" style={{ fontSize: "15px" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GuestHeader;
