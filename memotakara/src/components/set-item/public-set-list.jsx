// hiển thị trong public list và chi tiết của public collection
// cần chia Public để sao chép collection
import "./index.css";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Select, Tooltip, Pagination } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { getPublicCollections } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

const PublicList = ({ isPublic }) => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Lấy từ localStorage nếu có
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE);
    return saved ? parseInt(saved, 10) : 10;
  });

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

  // Reset về trang đầu khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Lọc danh sách collections khi filter thay đổi
  const filteredCollections = useMemo(() => {
    if (filter === "memoTakara") {
      return collections.filter((col) => col.user?.role === "admin");
    } else if (filter === "otherUsers") {
      return collections.filter((col) => col.user?.role !== "admin");
    }
    return collections; // Hiển thị tất cả khi filter là 'all'
  }, [collections, filter]);

  // Chia trang danh sách
  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCollections.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCollections, currentPage, itemsPerPage]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;

  return (
    <div className="public-list-container">
      <div className="public-list-header">
        {t("components.set-item.public-collection-title")}
      </div>

      <SelectFilter onChange={handleFilterChange} />

      {filteredCollections.length === 0 ? (
        <div>{t("views.pages.study_detail.no-collection-data")}</div>
      ) : (
        <>
          {paginatedCollections.map((collection) => (
            <div key={collection.id} className="set-item-container">
              <div className="set-item-above">
                <div className="set-item-header">
                  <Link
                    className="set-item-collection-name"
                    to={
                      isPublic
                        ? `/public-collection/${collection.id}`
                        : `/public-study-set/${collection.id}`
                    }
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

                <div className="set-item-footer">
                  {!isPublic && (
                    <Tooltip
                      placement="top"
                      title={t("components.set-item.copy-icon")}
                      arrow={true}
                    >
                      <FontAwesomeIcon
                        icon={faCopy}
                        style={{
                          fontSize: "var(--body-size)",
                          marginBottom: "5px",
                          cursor: "pointer",
                        }}
                      />
                    </Tooltip>
                  )}
                  <div className="set-item-totalcard">
                    {collection.flashcards_count || 0}
                    <br />
                    {t("views.pages.study_detail.totalcard")}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredCollections.length}
            onChange={(page) => setCurrentPage(page)}
            onShowSizeChange={(current, size) => {
              setItemsPerPage(size);
              setCurrentPage(1);
              localStorage.setItem(
                LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE,
                size
              );
            }}
            showSizeChanger
            pageSizeOptions={["5", "10", "15", "20"]}
            style={{ marginTop: 24, textAlign: "center" }}
          />
        </>
      )}
    </div>
  );
};

const SelectFilter = ({ onChange }) => {
  const { t } = useTranslation();

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
          { label: t("components.set-item.filter-all"), value: "all" },
          { label: "MemoTakara", value: "memoTakara" },
          {
            label: t("components.set-item.filter-otherUsers"),
            value: "otherUsers",
          },
        ]}
      />
    </div>
  );
};

export default PublicList;
