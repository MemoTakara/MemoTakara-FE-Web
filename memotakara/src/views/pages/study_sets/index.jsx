import "./index.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select, message, Pagination } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import {
  getMyCollections,
  duplicateCollection,
  deleteCollection,
} from "@/api/collection";

import LoadingPage from "@/views/error-pages/LoadingPage";
import SetItem from "@/components/set-item/set-item";
import MemoCreateCollection from "@/components/collection-modal/MemoCreateCollection";

function StudySets() {
  const { t } = useTranslation();

  const [collections, setCollections] = useState({ data: [], total: 0 });
  const [filteredCollections, setFilteredCollections] = useState({
    data: [],
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [setOptions, setSetOptions] = useState([
    {
      value: "all",
      label: t("components.set-item.filter-all"),
      disabled: true,
    },
    {
      value: "public",
      label: t("views.pages.study_sets.filter-public"),
      disabled: false,
    },
    {
      value: "private",
      label: t("views.pages.study_sets.filter-private"),
      disabled: false,
    },
  ]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getMyCollections({ page, per_page: 5 });
        setCollections(data);
        setFilteredCollections(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, [page]);

  const handleSets = (value) => {
    setSetOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        disabled: opt.value === value,
      }))
    );

    if (value === "public") {
      const filtered = collections.data.filter((col) => col.privacy === 1);
      setFilteredCollections({ data: filtered, total: filtered.length });
    } else if (value === "private") {
      const filtered = collections.data.filter((col) => col.privacy === 0);
      setFilteredCollections({ data: filtered, total: filtered.length });
    } else {
      setFilteredCollections(collections);
    }
  };

  const handleDeleteCollection = async (id) => {
    const confirm = window.confirm(t("views.pages.study_sets.confirm-delete"));
    if (!confirm) return;

    try {
      await deleteCollection(id);
      const updatedData = collections.data.filter((col) => col.id !== id);
      setCollections({ data: updatedData, total: updatedData.length });
      setFilteredCollections({ data: updatedData, total: updatedData.length });
      messageApi.success(t("views.pages.study_sets.delete-success"));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      messageApi.error(t("views.pages.study_sets.delete-fail"));
    }
  };

  const handleCreateCollection = (newCollection) => {
    const updatedData = [...collections.data, newCollection];
    setCollections({ data: updatedData, total: updatedData.length });
    setFilteredCollections({ data: updatedData, total: updatedData.length });
  };

  const handleUpdateCollection = (updatedCollection) => {
    const updatedData = collections.data.map((col) =>
      col.id === updatedCollection.id ? updatedCollection : col
    );
    setCollections({ data: updatedData, total: updatedData.length });
    setFilteredCollections({ data: updatedData, total: updatedData.length });
  };

  const handleCopyCollection = async (collectionId) => {
    try {
      const res = await duplicateCollection(collectionId);
      if (res.success) {
        const updatedCollections = await getMyCollections({
          page,
          per_page: 5,
        });
        setCollections(updatedCollections);
        setFilteredCollections(updatedCollections);
        messageApi.success(t("views.pages.study_sets.copy-success"));
        setTimeout(() => navigate(`/public-study-set/${res.id}`), 3000);
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error("Lỗi khi sao chép collection:", error);
      messageApi.error(t("views.pages.study_sets.copy-fail"));
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="std-set-container">
      {contextHolder}
      <div className="std-set-header">{t("views.pages.study_sets.header")}</div>

      <div className="std-set-select">
        <Select
          defaultValue="all"
          style={{ width: 160, height: 40, marginRight: "10px" }}
          onChange={handleSets}
          options={setOptions}
        />

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
      </div>

      {filteredCollections.data.length === 0 ? (
        <div className="std-set-no-collection">
          {t("views.pages.study_sets.no-create-collection")}
        </div>
      ) : (
        <>
          {filteredCollections.data.map((col) => (
            <SetItem
              key={col.id}
              collection={col}
              onDelete={handleDeleteCollection}
              onUpdate={handleUpdateCollection}
              onCopy={handleCopyCollection}
            />
          ))}
          <div style={{ textAlign: "center", marginTop: "5%" }}>
            <Pagination
              current={page}
              pageSize={5}
              total={filteredCollections.total || 0}
              onChange={(page) => setPage(page)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}

      <MemoCreateCollection
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={handleCreateCollection}
      />
    </div>
  );
}

export default StudySets;
