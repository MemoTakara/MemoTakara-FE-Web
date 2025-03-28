import "./index.css";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Tooltip } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  memoData,
  totalData,
  recentCollections,
  recommendCollections,
  popularCollections,
} from "@/data/data.jsx";
import { useAuth } from "@/contexts/AuthContext";
import BtnBlue from "@/components/btn/btn-blue.jsx";
import DashboardCard from "@/components/dashboard_card/index.jsx";

function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const { user } = useAuth();

  //Tooltip
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  //Data
  const [collections, setCollections] = useState(memoData);
  const recommendList = recommendCollections.slice(0, 3);
  const popularList = popularCollections.slice(0, 3);

  return (
    <div className="dashboard_container">
      <Link //create new collection
        to="/create_collection"
        className="dashboard_link"
        onClick={() => setActive("")}
      >
        <Tooltip
          placement="bottomRight"
          title={t("tooltip.create_collection")}
          arrow={mergedArrow}
        >
          <Button
            shape="circle"
            style={{
              height: "50px",
              width: "50px",
              marginBottom: "10px",
              background: "var(--color-button)",
            }}
            id="dashboard_btn"
            icon={<PlusOutlined style={{ color: "#fff", fontSize: "24px" }} />}
          />
        </Tooltip>
      </Link>

      <div className="dashboard_sayhi">
        <div id="dashboard_sayhi_text">
          {t("views.pages.dashboard.welcome1")}
          <Link
            to="/study_sets"
            className="dashboard_link"
            onClick={() => setActive("")}
            style={{
              fontStyle: "italic",
              fontSize: "24px",
              fontWeight: "var(--header-weight-size)",
            }}
          >
            @{user?.username}
          </Link>
          {","}
          <br />
          <span style={{ fontSize: "20px" }}>
            {t("views.pages.dashboard.welcome2")}
          </span>
        </div>

        <div className="dashboard_cards">
          <div className="dashboard_due">
            {totalData.due}
            <span
              style={{
                fontSize: "16px",
                fontStyle: "italic",
                fontWeight: "normal",
              }}
            >
              {t("views.pages.dashboard.due")}
            </span>
          </div>

          <div className="dashboard_streak">
            50
            <span
              style={{
                fontSize: "16px",
                fontStyle: "italic",
                fontWeight: "normal",
              }}
            >
              {t("views.pages.dashboard.streak")}
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard_recent">
        <div className="dashboard_title">
          <div className="dashboard_title_text">
            {t("views.pages.dashboard.title1")}
          </div>
          <Link //see more
            to="/create_collection"
            className="dashboard_link"
            onClick={() => setActive("")}
          >
            <BtnBlue textKey="see_more" />
          </Link>
        </div>

        {/* recent list */}
        <div style={{ padding: 20 }}>
          <Row gutter={[16, 16]}>
            {recentCollections.map((collection, index) => (
              <Col key={collection.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <div id="dashboard_recent_list_col">
                  <DashboardCard collections={[collection]} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="dashboard_recommend">
        <div className="dashboard_title">
          <div className="dashboard_title_text">
            {t("views.pages.dashboard.title2")}
            <span
              style={{
                fontStyle: "italic",
                fontSize: "24px",
                fontWeight: "var(--header-weight-size)",
              }}
            >
              @en120
            </span>
          </div>
          <Link //see more
            to="/create_collection"
            className="dashboard_link"
            onClick={() => setActive("")}
          >
            <BtnBlue textKey="see_more" />
          </Link>
        </div>

        {/* recommend list */}
        <div style={{ padding: 20 }}>
          <Row gutter={[16, 16]}>
            {recommendList.map((collection, index) => (
              <Col key={collection.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <div id="dashboard_recent_list_col">
                  <DashboardCard collections={[collection]} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="dashboard_popular">
        <div className="dashboard_title">
          <div className="dashboard_title_text">
            {t("views.pages.dashboard.title3")}
          </div>
          <Link //see more
            to="/create_collection"
            className="dashboard_link"
            onClick={() => setActive("")}
          >
            <BtnBlue textKey="see_more" />
          </Link>
        </div>

        {/* popular list */}
        <div style={{ padding: 20 }}>
          <Row gutter={[16, 16]}>
            {popularList.map((collection, index) => (
              <Col key={collection.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <div id="dashboard_recent_list_col">
                  <DashboardCard collections={[collection]} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
