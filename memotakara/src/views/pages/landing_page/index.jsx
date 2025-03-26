import "./index.css";
import landing_img from "@/assets/img/landing_img.png";
import landing_feature1 from "@/assets/img/landing_feature1.png";
import landing_feature2 from "@/assets/img/landing_feature2.png";
import landing_feature3 from "@/assets/img/landing_feature3.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import BtnBlue from "@/components/btn/btn-blue.jsx";
import BtnWhite from "@/components/btn/btn-white.jsx";

function LandingPage() {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  return (
    <div className="landing_container">
      <div className="landing_introduce">
        <div className="landing_content">
          <div
            style={{
              fontSize: "var(--logo-size)",
              fontWeight: "var(--header-weight-size)",
            }}
          >
            {t("views.pages.landing_page.content1")}
          </div>
          <div
            style={{
              marginTop: "18px",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
              fontSize: "var(--header-size)",
            }}
          >
            {t("views.pages.landing_page.content2")}
          </div>
          <div className="landing_btn">
            <Link
              to="/login"
              className="landing_link"
              onClick={() => setActive("login")}
            >
              <BtnBlue textKey="get_started" />
            </Link>

            <BtnWhite textKey="learn_more" />
          </div>
        </div>

        <div>
          <img
            src={landing_img}
            alt={t("image.banner_alt")}
            style={{
              width: "85%",
              objectFit: "cover",
              marginLeft: "25%",
              border: "2px dashed var(--color-button)",
            }}
          />
        </div>
      </div>

      <div className="landing_feature">
        <div className="landing_feature_title">
          {t("views.pages.landing_page.feature")}
        </div>
        <div className="landing_feature_list">
          <div
            className="landing_item"
            style={{
              width: "360px",
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
            }}
          >
            <img src={landing_feature1} alt="feature 1" />
            <div
              style={{
                marginTop: "10px",
                fontSize: "var(--logo-size)",
                fontWeight: "var(--header-weight-size)",
              }}
            >
              {t("views.pages.landing_page.feature1")}
            </div>
            <div
              style={{
                alignSelf: "end", // Đưa phần tử này xuống đáy
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                color: "var(--color-text-disabled",
                fontSize: "var(--body-size)",
              }}
            >
              {t("views.pages.landing_page.des1")}
            </div>
          </div>

          <div
            className="landing_item"
            style={{
              width: "320px",
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
            }}
          >
            <img src={landing_feature2} alt="feature 2" />
            <div
              style={{
                marginTop: "10px",
                fontSize: "var(--logo-size)",
                fontWeight: "var(--header-weight-size)",
              }}
            >
              {t("views.pages.landing_page.feature2")}
            </div>
            <div
              style={{
                alignSelf: "end", // Đưa phần tử này xuống đáy
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                color: "var(--color-text-disabled",
                fontSize: "var(--body-size)",
              }}
            >
              {t("views.pages.landing_page.des2")}
            </div>
          </div>

          <div
            className="landing_item"
            style={{
              width: "300px",
              display: "grid",
              gridTemplateRows: "auto auto 1fr",
            }}
          >
            <img src={landing_feature3} alt="feature 3" />
            <div
              style={{
                marginTop: "10px",
                fontSize: "var(--logo-size)",
                fontWeight: "var(--header-weight-size)",
              }}
            >
              {t("views.pages.landing_page.feature3")}
            </div>
            <div
              style={{
                alignSelf: "end", // Đưa phần tử này xuống đáy
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                color: "var(--color-text-disabled",
                fontSize: "var(--body-size)",
              }}
            >
              {t("views.pages.landing_page.des3")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
