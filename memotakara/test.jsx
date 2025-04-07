import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getPublicCollections } from "@/api/collection"; // Lấy danh sách public collections
import LoadingPage from "@/views/error-pages/LoadingPage";
import { Select } from "antd";

const PublicList = () => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [flashcardCounts, setFlashcardCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredCollections, setFilteredCollections] = useState([]);

  useEffect(() => {
    const fetchPublicCollections = async () => {
      try {
        setLoading(true);
        const collectionList = await getPublicCollections();

        // Tạo map để đếm số flashcards theo collection_id
        const countMap = {};
        collectionList.forEach((collection) => {
          const flashcards = collection.flashcards; // Lấy flashcards từ collection đã được tải
          countMap[collection.id] = flashcards.length; // Đếm số flashcards
        });

        setCollections(collectionList);
        setFilteredCollections(collectionList); // Ban đầu hiển thị tất cả
        setFlashcardCounts(countMap);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCollections();
  }, []);

  // Lọc theo người tạo (MemoTakara hoặc người dùng khác)
  const handleFilterChange = (value) => {
    setFilter(value);

    if (value === "memoTakara") {
      setFilteredCollections(
        collections.filter((col) => col.user?.role === "admin")
      );
    } else if (value === "otherUsers") {
      setFilteredCollections(
        collections.filter((col) => col.user?.role !== "admin")
      );
    } else {
      setFilteredCollections(collections); // Hiển thị tất cả khi chọn 'all'
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (filteredCollections.length === 0) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
  }

  return (
    <div className="public-list-container">
      <div className="public-list-header">
        {t("components.set-item.public-collection-title")}
      </div>

      {/* Phần Select để lọc */}
      <div className="sort-select">
        <Select
          defaultValue="all"
          style={{ width: 160, marginBottom: "20px" }}
          onChange={handleFilterChange}
          options={[
            { label: t("views.pages.study_detail.filter-all"), value: "all" }, // Tất cả
            {
              label: t("views.pages.study_detail.filter-memoTakara"),
              value: "memoTakara",
            }, // MemoTakara
            {
              label: t("views.pages.study_detail.filter-otherUsers"),
              value: "otherUsers",
            }, // Người dùng khác
          ]}
        />
      </div>

      {/* Hiển thị các collection đã lọc */}
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
                {collection.description
                  ? collection.description
                  : t("views.pages.study_detail.no-description")}
              </div>
            </div>

            <div className="set-item-footer set-item-totalcard">
              {flashcardCounts[collection.id] || 0}{" "}
              {t("views.pages.study_detail.totalcard")}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicList;
