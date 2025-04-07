import "./index.css";
import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Button, Tooltip, Select, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import SetItem from "@/components/set-item/set-item";
import { getOwnCollections, deleteCollection } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

function StudySets() {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const [collections, setCollections] = useState([]);
  const [filteredCollections, setFilteredCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [setOptions, setSetOptions] = useState([
    {
      value: "all",
      label: "All",
      disabled: true,
    },
    {
      value: "public",
      label: "Public Collection",
      disabled: false,
    },
    {
      value: "private",
      label: "Private Collection",
      disabled: false,
    },
  ]);

  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") return false;
    if (arrow === "Show") return true;
    return { pointAtCenter: true };
  }, [arrow]);

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
      setFilteredCollections((prev) => prev.filter((col) => col.id !== id));
      window.confirm(t("views.pages.study_sets.delete-success"));
    } catch (error) {
      console.error("Xóa thất bại:", error);
      alert(t("views.pages.study_sets.delete-fail"));
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="std-set-container">
      <div className="std-set-header">{t("views.pages.study_sets.header")}</div>

      <div className="std-set-select">
        <Select
          defaultValue="all"
          style={{
            width: 160,
            height: 40,
            marginRight: "10px",
          }}
          onChange={handleSets}
          options={setOptions}
        />

        <Link to="/create_collection" onClick={() => setActive("")}>
          <Tooltip
            placement="bottomRight"
            title="Create new collection."
            arrow={mergedArrow}
          >
            <Button
              shape="circle"
              style={{
                height: "50px",
                width: "50px",
                marginBottom: "10px",
                background: "var(--color-button)",
              }}
              id="dashboard_btn"
              icon={
                <PlusOutlined style={{ color: "#fff", fontSize: "24px" }} />
              }
            />
          </Tooltip>
        </Link>
      </div>

      {filteredCollections.map((col) => (
        <SetItem
          key={col.id}
          collection={col}
          onDelete={handleDeleteCollection}
        />
      ))}
    </div>
  );
}

export default StudySets;
