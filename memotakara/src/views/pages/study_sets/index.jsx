import "./index.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Select, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  getOwnCollections,
  duplicateCollection,
  deleteCollection,
} from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";
import SetItem from "@/components/set-item/set-item";
import MemoCreateCollection from "@/components/create-collection/MemoCreateCollection";

function StudySets() {
  const { t } = useTranslation();
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  // Gọi API khi component mount
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const data = await getOwnCollections();
        setCollections(data || []);
        setFilteredCollections(data || []); // Ban đầu hiển thị tất cả
      } catch (err) {
        console.error("Lỗi khi lấy danh sách collection:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  // Lọc theo privacy
  const handleSets = (value) => {
    setSetOptions((prev) =>
      prev.map((opt) => ({
        ...opt,
        disabled: opt.value === value,
      }))
    );

    if (value === "public") {
      setFilteredCollections(collections.filter((col) => col.privacy === 1));
    } else if (value === "private") {
      setFilteredCollections(collections.filter((col) => col.privacy === 0));
    } else {
      setFilteredCollections(collections);
    }
  };

  const handleDeleteCollection = async (id) => {
    const confirm = window.confirm(t("views.pages.study_sets.confirm-delete"));
    if (!confirm) return;

    try {
      await deleteCollection(id);
      setCollections((prev) => prev.filter((col) => col.id !== id));
      setFilteredCollections((prev) => prev.filter((col) => col.id !== id));
      messageApi.success(t("views.pages.study_sets.delete-success"));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      messageApi.error(t("views.pages.study_sets.delete-fail"));
    }
  };

  const handleCreateCollection = (newCollection) => {
    setCollections((prev) => [...prev, newCollection]);
    setFilteredCollections((prev) => [...prev, newCollection]);
  };

  const handleUpdateCollection = (updatedCollection) => {
    setCollections((prevCollections) =>
      prevCollections.map((col) =>
        col.id === updatedCollection.id ? updatedCollection : col
      )
    );
    setFilteredCollections((prevFiltered) =>
      prevFiltered.map((col) =>
        col.id === updatedCollection.id ? updatedCollection : col
      )
    );
  };

  const handleCopyCollection = async (collectionId) => {
    try {
      const res = await duplicateCollection(collectionId);
      if (res.success) {
        const updatedCollections = await getOwnCollections();
        setCollections(updatedCollections);
        setFilteredCollections(updatedCollections);
        messageApi.success(t("views.pages.study_sets.copy-success"));
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
          onClick={() => setIsModalVisible(true)} // Mở modal
          title={t("components.create-collection.title")}
        />
      </div>

      {/* Sử dụng modal tạo collection */}
      <MemoCreateCollection
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onCreate={handleCreateCollection}
      />

      {filteredCollections.length === 0 ? (
        <div className="std-set-no-collection">
          {t("views.pages.study_sets.no-create-collection")}
        </div>
      ) : (
        filteredCollections.map((col) => (
          <SetItem
            key={col.id}
            collection={col}
            onDelete={handleDeleteCollection}
            onUpdate={handleUpdateCollection}
            onCopy={handleCopyCollection}
          />
        ))
      )}
    </div>
  );
}

export default StudySets;
