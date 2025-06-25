import "@/components/set-item/index.css";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pagination, message, Select } from "antd";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/contexts/AuthContext";
import { duplicateCollection, deleteCollection } from "@/api/collection";

import LoadingPage from "@/views/error-pages/LoadingPage";
import CollectionDropdown from "@/components/collection-modal/collection-menu";
import MemoEditCollection from "@/components/collection-modal/MemoEditCollection";
import MemoRateCollection from "@/components/collection-modal/MemoRateCollection";

const CollectionList = ({ title, isPublic, fetchCollections, isRecent }) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [collections, setCollections] = useState({
    data: [],
    total: 0,
    per_page: 10,
  });
  const [editingCollection, setEditingCollection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  const [filter, setFilter] = useState("all");
  const [difficulty, setDifficulty] = useState(null);
  const [languageFront, setLanguageFront] = useState(null);
  const [languageBack, setLanguageBack] = useState(() => {
    const lang = localStorage.getItem("language") || i18n.language || "en";
    return ["vi", "en", "ja", "zh"].includes(lang) ? lang : "en";
  });
  const [sortBy, setSortBy] = useState("created_at");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useMemo(() => {
    return Object.fromEntries(
      Object.entries({
        page,
        difficulty,
        language_front: languageFront,
        language_back: languageBack,
        sort_by: sortBy,
        sort_order: "desc",
      }).filter(([, value]) => value !== null && value !== undefined)
    );
  }, [page, difficulty, languageFront, languageBack, sortBy]);

  const loadCollections = async (pageNum = page) => {
    setLoading(true);
    try {
      const result = isRecent
        ? await fetchCollections()
        : await fetchCollections({ ...params, page: pageNum });
      setCollections(
        isRecent
          ? { data: result, total: result.length, per_page: result.length }
          : result
      );
    } catch (err) {
      console.error("Error loading collections:", err);
      setError(t("views.pages.study_detail.error-loading"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, [fetchCollections, t, params, isRecent]);

  useEffect(() => {
    setLanguageBack(i18n.language);
  }, [i18n.language]);

  useEffect(() => setPage(1), [filter]);

  const visibleCollections = useMemo(() => {
    const data = collections.data || [];
    return data
      .filter((item) => {
        const userRole = item.user?.role;
        if (filter === "memoTakara") return userRole === "admin";
        if (filter === "otherUsers") return userRole !== "admin";
        return true;
      })
      .map((item) => ({ ...item, isAuthor: user?.id === item?.user?.id }));
  }, [collections.data, filter, user?.id]);

  const handleCopyCollection = async (collectionId) => {
    try {
      const newCollectionId = await duplicateCollection(collectionId);
      messageApi.success(t("views.pages.study_sets.copy-success"));
      setTimeout(() => {
        if (isPublic) {
          navigate(`/public-collection/${newCollectionId.data.id}`);
        } else {
          navigate(`/public-study-set/${newCollectionId.data.id}`);
        }
      }, 3000);
    } catch {
      messageApi.error(t("views.pages.study_sets.copy-fail"));
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!window.confirm(t("views.pages.study_sets.confirm-delete"))) return;
    try {
      await deleteCollection(id);
      const updated = collections.data.filter((col) => {
        return col.id !== id;
      });
      setCollections((prev) => ({
        ...prev,
        data: updated,
        total: prev.total - 1,
      }));
      messageApi.success(t("views.pages.study_sets.delete-success"));
    } catch (error) {
      messageApi.error(t("views.pages.study_sets.delete-fail"));
    }
  };

  const handleUpdateCollection = (updated) => {
    setCollections((prev) => ({
      ...prev,
      data: prev.data.map((col) => (col.id === updated.id ? updated : col)),
    }));
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;

  return (
    <div className="public-list-container">
      {contextHolder}
      <div className="public-list-header">{title}</div>

      {!isRecent && (
        <div
          className="public-list-filters"
          style={{ display: "flex", gap: 12, marginBottom: 20 }}
        >
          <Select
            placeholder={t("components.collection-list.difficulty")}
            value={difficulty}
            onChange={setDifficulty}
            allowClear
            style={{ width: 140 }}
            options={[
              {
                label: t("components.collection-list.beginner"),
                value: "beginner",
              },
              {
                label: t("components.collection-list.intermediate"),
                value: "intermediate",
              },
              {
                label: t("components.collection-list.advanced"),
                value: "advanced",
              },
            ]}
          />
          <Select
            placeholder={t("components.collection-list.front")}
            value={languageFront}
            onChange={setLanguageFront}
            allowClear
            style={{ width: 140 }}
            options={[
              { label: t("components.collection-list.viet"), value: "vi" },
              { label: t("components.collection-list.eng"), value: "en" },
              { label: t("components.collection-list.japan"), value: "ja" },
              { label: t("components.collection-list.china"), value: "zh" },
            ]}
          />
          <Select
            placeholder={t("components.collection-list.back")}
            value={languageBack}
            onChange={setLanguageBack}
            allowClear
            style={{ width: 140 }}
            options={[
              { label: t("components.collection-list.viet"), value: "vi" },
              { label: t("components.collection-list.eng"), value: "en" },
              { label: t("components.collection-list.japan"), value: "ja" },
              { label: t("components.collection-list.china"), value: "zh" },
            ]}
          />
          <Select
            placeholder={t("components.collection-list.sort-by")}
            value={sortBy}
            onChange={setSortBy}
            style={{ width: 140 }}
            options={[
              {
                label: t("components.collection-list.newest"),
                value: "created_at",
              },
              { label: t("components.collection-list.rate"), value: "rating" },
              {
                label: t("components.collection-list.card-count"),
                value: "cards_count",
              },
              {
                label: t("components.collection-list.duplicates"),
                value: "duplicates",
              },
              { label: t("components.collection-list.name"), value: "name" },
            ]}
          />
          <Select
            value={filter}
            onChange={setFilter}
            style={{ width: 150 }}
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
      )}

      {visibleCollections.length === 0 ? (
        <div>{t("views.pages.study_detail.no-collection-data")}</div>
      ) : (
        <>
          {visibleCollections.map((collection, index) => {
            const isAuthor = collection.isAuthor;
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
                        onRate={() => {
                          setSelectedCollectionId(collection.id);
                          setShowRateModal(true);
                        }}
                        collection={collection}
                      />
                    )}
                    <div className="set-item-totalcard">
                      {collection.total_cards || 0}
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
          {!isRecent && (
            <Pagination
              current={page}
              pageSize={collections.per_page}
              total={collections.total}
              onChange={setPage}
              showSizeChanger={false}
              style={{ marginTop: 24, textAlign: "center" }}
            />
          )}
        </>
      )}

      <MemoRateCollection
        visible={showRateModal}
        onCancel={() => setShowRateModal(false)}
        collectionId={selectedCollectionId}
      />
    </div>
  );
};

export default CollectionList;
