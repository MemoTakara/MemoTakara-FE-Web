import "./index.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, Col, Row, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { getPublicCollections } from "@/api/collection";
import { getRecentCollections } from "@/api/recentCollection";
import BtnBlue from "@/components/btn/btn-blue.jsx";
import DashboardCard from "@/components/set-item/dashboard-set";
import MemoCreateCollection from "@/components/create-collection/MemoCreateCollection";

function Dashboard() {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const { user } = useAuth();
  const [collections, setCollections] = useState([]); // public collections
  const [recentViewed, setRecentViewed] = useState([]); // recently viewed collections
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      setLoading(true);
      try {
        const [publicData, recentData] = await Promise.all([
          getPublicCollections(),
          getRecentCollections(),
        ]);
        setCollections(publicData);
        setRecentViewed(recentData);
      } catch (error) {
        console.error("Failed to fetch collections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
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
        onClick={() => setIsModalVisible(true)} // Mở modal
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
            {/* {totalData.due} */}0
            <span
              style={{
                fontSize: "16px",
                fontWeight: "normal",
              }}
            >
              {t("views.pages.dashboard.due")}
            </span>
          </div>

          <div className="dashboard_streak">
            0
            <span
              style={{
                fontSize: "16px",
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
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin>{t("views.error-pages.loadingPage.title")}</Spin>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {recentViewed.length > 0 ? (
                recentViewed.slice(0, 3).map((item) => (
                  <Col
                    key={item.collection.id}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                  >
                    <DashboardCard
                      collection={item.collection}
                      setAuthor={true}
                    />
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
          {loading ? (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Spin>{t("views.error-pages.loadingPage.title")}</Spin>
            </div>
          ) : (
            <Row gutter={[16, 16]}>
              {collections.length > 0 ? (
                collections.slice(0, 3).map((collection) => (
                  <Col key={collection.id} xs={24} sm={12} md={8} lg={8} xl={8}>
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
