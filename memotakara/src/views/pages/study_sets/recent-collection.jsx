// recent list của user: cả private và public
// cần chia Public để sao chép collection
import "./index.css";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Select, Pagination, message } from "antd";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import { getRecentCollections } from "@/api/recentCollection";
import { duplicateCollection } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";
import CollectionDropdown from "@/components/widget/collection-menu";

const RecentList = ({ isPublic }) => {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Lấy từ localStorage nếu có
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE);
    return saved ? parseInt(saved, 10) : 10;
  });

  useEffect(() => {
    const fetchRecentCollections = async () => {
      setLoading(true);
      try {
        const collectionList = await getRecentCollections();
        setCollections(collectionList);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchRecentCollections();
  }, []);

  const handleCopyCollection = async (collectionId) => {
    try {
      const data = await duplicateCollection(collectionId);
      messageApi.success(t("views.pages.study_sets.copy-success"));
      setTimeout(() => {
        navigate(`/public-study-set/${data.newCollectionId}`);
      }, 3000);
    } catch (error) {
      console.error("Lỗi khi sao chép collection: ", error);
      messageApi.error(t("views.pages.study_sets.copy-fail"));
    }
  };

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
      {contextHolder}
      <div className="public-list-header">
        {t("views.pages.recent-list.title")}
      </div>

      <SelectFilter onChange={handleFilterChange} />

      {filteredCollections.length === 0 ? (
        <div>{t("views.pages.study_detail.no-collection-data")}</div>
      ) : (
        <>
          {paginatedCollections.map((item) => (
            <div key={item.collection.id} className="set-item-container">
              <div className="set-item-above">
                <div className="set-item-header">
                  <Link
                    className="set-item-collection-name"
                    to={`/public-study-set/${item.collection.id}`}
                    style={{ fontSize: "var(--body-size-max)" }}
                  >
                    {item.collection.collection_name}
                  </Link>

                  <div
                    className="set-item-collection-des"
                    style={{ fontSize: "16px" }}
                  >
                    {t("components.header.search_user1")}{" "}
                    {item.collection.user?.role === "admin"
                      ? "MemoTakara"
                      : item.collection.user?.username ||
                        t("components.header.search_user2")}
                  </div>

                  <div
                    className="set-item-collection-des"
                    style={{ fontSize: "16px" }}
                  >
                    {t("views.pages.study_detail.collection-des")}{" "}
                    {item.collection.description ||
                      t("views.pages.study_detail.no-description")}
                  </div>
                </div>

                <div className="set-item-footer">
                  {!isPublic && (
                    <CollectionDropdown
                      isAuthor={false}
                      onEdit={false}
                      onCopy={() => handleCopyCollection(collection.id)}
                    />
                  )}
                  <div className="set-item-totalcard">
                    {item.collection.flashcards_count || 0}
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

export default RecentList;
