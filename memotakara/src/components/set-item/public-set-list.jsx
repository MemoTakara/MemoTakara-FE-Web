import "./index.css";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Select } from "antd";
import { getPublicCollections } from "@/api/collection"; // Lấy danh sách public collections
import LoadingPage from "@/views/error-pages/LoadingPage";

const PublicList = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchPublicCollections = async () => {
      try {
        setLoading(true);
        const collectionList = await getPublicCollections();

        setCollections(collectionList);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCollections();
  }, []);

  // Lọc danh sách collections khi filter thay đổi
  const filteredCollections = useMemo(() => {
    if (filter === "memoTakara") {
      return collections.filter((col) => col.user?.role === "admin");
    } else if (filter === "otherUsers") {
      return collections.filter((col) => col.user?.role !== "admin");
    }
    return collections; // Hiển thị tất cả khi filter là 'all'
  }, [collections, filter]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (filteredCollections.length === 0) {
    return (
      <div className="public-list-container">
        <div className="public-list-header">
          {t("components.set-item.public-collection-title")}
        </div>

        <SelectFilter onChange={handleFilterChange} />

        <div>{t("views.pages.study_detail.no-collection-data")}</div>
      </div>
    );
  }

  return (
    <div className="public-list-container">
      <div className="public-list-header">
        {t("components.set-item.public-collection-title")}
      </div>

      <SelectFilter onChange={handleFilterChange} />

      {filteredCollections.map((collection) => (
        <div key={collection.id} className="set-item-container">
          <div className="set-item-above">
            <div className="set-item-header">
              <Link
                className="set-item-collection-name"
                to={`/public-collection/${collection.id}`}
                style={{ fontSize: "var(--body-size-max)" }}
              >
                {collection.collection_name}
              </Link>

              <div
                className="set-item-collection-des"
                style={{ fontSize: "16px" }}
              >
                {t("components.header.search_user1")}{" "}
                {collection.user?.role === "admin"
                  ? "MemoTakara"
                  : collection.user?.username ||
                    t("components.header.search_user2")}
              </div>

              <div
                className="set-item-collection-des"
                style={{ fontSize: "16px" }}
              >
                {t("views.pages.study_detail.collection-des")}{" "}
                {collection.description ||
                  t("views.pages.study_detail.no-description")}
              </div>
            </div>

            <div className="set-item-footer set-item-totalcard">
              {collection.flashcards?.length || 0}{" "}
              {t("views.pages.study_detail.totalcard")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const SelectFilter = ({ onChange }) => {
  return (
    <div
      className="public-list-sort-select"
      style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
    >
      <Select
        defaultValue="all"
        style={{ width: 150, marginBottom: "20px" }}
        onChange={onChange}
        options={[
          { label: "Tất cả", value: "all" },
          { label: "MemoTakara", value: "memoTakara" },
          { label: "Người dùng khác", value: "otherUsers" },
        ]}
      />
    </div>
  );
};

export default PublicList;
