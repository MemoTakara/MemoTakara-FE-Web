import "./index.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useAuth } from "@/contexts/AuthContext";
import { getCollections, getRecentCollections } from "@/api/collection";
import { getDashboard } from "@/api/progress";

import BtnBlue from "@/components/btn/btn-blue.jsx";
import DashboardCard from "@/components/set-item/dashboard-set";
import MemoCreateCollection from "@/components/collection-modal/MemoCreateCollection";

function Dashboard() {
  const { t, i18n } = useTranslation();
  const [active, setActive] = useState("");
  const { user } = useAuth();

  const [studyDashboard, setStudyDashboard] = useState(null);
  const [collections, setCollections] = useState([]); // public collections
  const [recentViewed, setRecentViewed] = useState([]); // recently viewed collections
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [languageBack, setLanguageBack] = useState(() => {
    const lang = localStorage.getItem("language") || i18n.language || "en";
    return ["vi", "en", "ja", "zh"].includes(lang) ? lang : "en";
  });

  const [loadingPublic, setLoadingPublic] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const fetchMemoCollections = async (params) => {
    setLoadingPublic(true);
    try {
      const publicData = await getCollections({
        user_id: 1,
        privacy: "public",
        language_back: languageBack,
        sort_by: "rating",
      });
      setCollections(publicData.data);
    } catch (error) {
      console.error("Failed to fetch public collections:", error);
    } finally {
      setLoadingPublic(false);
    }
  };

  useEffect(() => {
    setLanguageBack(i18n.language);
  }, [i18n.language]);

  const fetchRecentCollections = async () => {
    setLoadingRecent(true);
    try {
      const recentData = await getRecentCollections();
      setRecentViewed(recentData);
    } catch (error) {
      console.error("Failed to fetch recent collections:", error);
    } finally {
      setLoadingRecent(false);
    }
  };

  const fetchStudyDashboard = async () => {
    try {
      const res = await getDashboard();
      setStudyDashboard(res);
    } catch (error) {
      console.error("Failed to fetch dashboard data", err);
    }
  };

  useEffect(() => {
    fetchMemoCollections();
  }, []);

  useEffect(() => {
    fetchRecentCollections();
  }, []);

  useEffect(() => {
    fetchStudyDashboard();
  }, []);

  const handleCreateCollection = (newCollection) => {
    setCollections((prev) => [...prev, newCollection]);
  };

  return (
    <div className="dashboard_container">
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
        onClick={() => setIsModalVisible(true)}
        title={t("components.create-collection.title")}
      />

      {/* Sử dụng modal tạo collection */}
      <MemoCreateCollection
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={handleCreateCollection}
      />

      <div className="dashboard_sayhi">
        <div id="dashboard_sayhi_text">
          {t("views.pages.dashboard.welcome1")}
          <Link
            to="/study_sets"
            className="dashboard_link"
            onClick={() => setActive("study_sets")}
            style={{
              fontSize: "var(--body-size-bigger)",
              fontWeight: "var(--header-weight-size)",
              color: "var(--color-light-button)",
              fontStyle: "italic",
            }}
          >
            @{user?.username}
          </Link>
          {","}
          <br />
          <span style={{ fontSize: "var(--body-size)" }}>
            {t("views.pages.dashboard.welcome2")}
          </span>
        </div>

        <div className="dashboard_cards">
          <div className="dashboard_due">
            {studyDashboard?.overall_stats.due_cards}
            <span
              style={{
                fontSize: "var(--normal-font-size)",
                fontWeight: "normal",
              }}
            >
              {t("views.pages.dashboard.due")}
            </span>
          </div>

          <div className="dashboard_streak">
            {studyDashboard?.overall_stats.study_streak}
            <span
              style={{
                fontSize: "var(--normal-font-size)",
                fontWeight: "normal",
              }}
            >
              {t("views.pages.dashboard.streak")}
            </span>
          </div>
        </div>
      </div>

      {/* Recently viewed collections */}
      <div className="dashboard_recent">
        <div className="dashboard_title">
          <div className="dashboard_title_text">
            {t("views.pages.dashboard.title1")}
          </div>
          <Link //see more
            to="/recent-collection"
            className="dashboard_link"
            onClick={() => setActive("study_sets")}
          >
            <BtnBlue textKey="see_more" />
          </Link>
        </div>

        <div style={{ padding: 20 }}>
          {loadingRecent ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin>{t("views.error-pages.loadingPage.title")}</Spin>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {recentViewed.length > 0 ? (
                recentViewed.slice(0, 3).map((item) => (
                  <Col key={`recent-${item.id}`}>
                    <DashboardCard collection={item} setAuthor={true} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    {t("views.pages.study_sets.no-collection")}
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </div>

      {/* Public recommended collections */}
      <div className="dashboard_recommend">
        <div className="dashboard_title">
          <div className="dashboard_title_text">
            {t("views.pages.dashboard.title2")}
            <span
              style={{
                fontFamily: "var(--logo-font)",
                fontWeight: "var(--header-weight-size)",
              }}
            >
              MemoTakara
            </span>
          </div>
          <Link //see more
            to="/public-study-set"
            className="dashboard_link"
            onClick={() => setActive("study-sets")}
          >
            <BtnBlue textKey="see_more" />
          </Link>
        </div>

        <div style={{ padding: 20 }}>
          {loadingPublic ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin>{t("views.error-pages.loadingPage.title")}</Spin>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {collections.length > 0 ? (
                collections.slice(0, 3).map((collection) => (
                  <Col key={`public-${collection.id}`}>
                    <DashboardCard collection={collection} setAuthor={false} />
                  </Col>
                ))
              ) : (
                <Col span={24}>
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    {t("views.pages.study_sets.no-collection")}
                  </div>
                </Col>
              )}
            </Row>
          )}
        </div>
      </div>

      {/* <div className="dashboard_popular">
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

        popular list
        <div style={{ padding: 20 }}>
          <Row gutter={[16, 16]}>
            {popularList.map((collection, index) => (
              <Col key={collection.id} xs={24} sm={12} md={8} lg={8} xl={8}>
                <div>
                  <DashboardCard collections={[collection]} />
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div> */}
    </div>
  );
}

export default Dashboard;
