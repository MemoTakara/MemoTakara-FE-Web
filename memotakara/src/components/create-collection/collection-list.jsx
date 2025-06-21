import "@/components/set-item/index.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination, message, Select } from "antd";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { duplicateCollection, deleteCollection } from "@/api/collection";
import { LOCAL_STORAGE_KEYS } from "@/constants/localStorageKeys";
import LoadingPage from "@/views/error-pages/LoadingPage";
import CollectionDropdown from "@/components/widget/collection-menu";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";

const SelectFilter = ({ filter, onChange }) => {
  const { t } = useTranslation();
  return (
    <div
      className="public-list-sort-select"
      style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
    >
      <Select
        value={filter}
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

const CollectionList = ({ title, isPublic, fetchCollections, isRecent }) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    // Lấy từ localStorage nếu có
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MEMO_ITEMS_PER_PAGE);
    return saved ? parseInt(saved, 10) : 10;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchCollections();
        setCollections(result);
      } catch (err) {
        console.error("Error loading collections:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [fetchCollections, t]);

  const handleCopyCollection = async (collectionId) => {
    try {
      const { newCollectionId } = await duplicateCollection(collectionId);
      messageApi.success(t("views.pages.study_sets.copy-success"));
      setTimeout(() => {
        navigate(`/public-study-set/${newCollectionId}`);
      }, 3000);
    } catch (error) {
      console.error("Copy failed:", error);
      messageApi.error(t("views.pages.study_sets.copy-fail"));
    }
  };

  const handleDeleteCollection = async (id) => {
    const confirm = window.confirm(t("views.pages.study_sets.confirm-delete"));
    if (!confirm) return;

    try {
      await deleteCollection(id);
      const updated = collections.filter((col) => {
        const target = isRecent ? col.collection : col;
        return target.id !== id;
      });
      setCollections(updated);

      const totalItems = filteredCollections.length - 1;
      const maxPage = Math.ceil(totalItems / itemsPerPage);
      if (currentPage > maxPage && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      messageApi.success(t("views.pages.study_sets.delete-success"));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      messageApi.error(t("views.pages.study_sets.delete-fail"));
    }
  };

  const handleUpdateCollection = (updatedCollection) => {
    setCollections((prev) =>
      prev.map((col) => {
        const target = isRecent ? col.collection : col;
        if (target.id === updatedCollection.id) {
          return isRecent
            ? { ...col, collection: updatedCollection }
            : updatedCollection;
        }
        return col;
      })
    );
  };

  // Reset về trang đầu khi filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Lọc danh sách collections khi filter thay đổi
  const filteredCollections = useMemo(() => {
    let list = collections;

    if (filter === "memoTakara") {
      list = list.filter(
        (c) => (isRecent ? c.collection?.user?.role : c.user?.role) === "admin"
      );
    } else if (filter === "otherUsers") {
      list = list.filter(
        (c) => (isRecent ? c.collection?.user?.role : c.user?.role) !== "admin"
      );
    }

    return list.map((item) => {
      const col = isRecent ? item.collection : item;
      return {
        ...item,
        isAuthor: user?.id === col?.user?.id,
      };
    });
  }, [collections, filter, user?.id, isRecent]);

  // Chia trang danh sách
  const paginatedCollections = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCollections.slice(start, start + itemsPerPage);
  }, [filteredCollections, currentPage, itemsPerPage]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;

  return (
    <div className="public-list-container">
      {contextHolder}
      <div className="public-list-header">{title}</div>

      <SelectFilter filter={filter} onChange={setFilter} />

      {filteredCollections.length === 0 ? (
        <div>{t("views.pages.study_detail.no-collection-data")}</div>
      ) : (
        <>
          {paginatedCollections.map((item, index) => {
            const { isAuthor } = item;
            const collection = isRecent ? item.collection : item;

            return (
              <div
                key={`${collection.id}-${index}`}
                className="set-item-container"
              >
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
                      style={{ fontSize: "var(--normal-font-size)" }}
                    >
                      {t("components.header.search_user1")}{" "}
                      {collection.user?.role === "admin"
                        ? "MemoTakara"
                        : collection.user?.username ||
                          t("components.header.search_user2")}
                    </div>
                    <div
                      className="set-item-collection-des"
                      style={{ fontSize: "var(--normal-font-size)" }}
                    >
                      {t("views.pages.study_detail.collection-des")}{" "}
                      {collection.description ||
                        t("views.pages.study_detail.no-description")}
                    </div>
                  </div>
                  <div className="set-item-footer">
                    {!isPublic && (
                      <CollectionDropdown
                        isAuthor={isAuthor}
                        onEdit={
                          isAuthor
                            ? () => {
                                setEditingCollection(collection);
                                setIsModalVisible(true);
                              }
                            : undefined
                        }
                        onDelete={
                          isAuthor
                            ? () => handleDeleteCollection(collection.id)
                            : undefined
                        }
                        onUpdate={isAuthor ? handleUpdateCollection : undefined}
                        onCopy={() => handleCopyCollection(collection.id)}
                      />
                    )}
                    <div className="set-item-totalcard">
                      {collection.flashcards_count || 0}
                      <br />
                      {t("views.pages.study_detail.totalcard")}
                    </div>
                  </div>
                </div>

                {isAuthor && editingCollection?.id === collection.id && (
                  <MemoEditCollection
                    isVisible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onUpdate={handleUpdateCollection}
                    collection={editingCollection}
                  />
                )}
              </div>
            );
          })}
          <Pagination
            current={currentPage}
            pageSize={itemsPerPage}
            total={filteredCollections.length}
            onChange={setCurrentPage}
            onShowSizeChange={(_, size) => {
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

export default CollectionList;
