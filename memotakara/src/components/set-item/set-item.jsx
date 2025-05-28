// set in folder (list of own-set)
import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Dropdown } from "antd";
import { EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";

const SetItem = ({ collection, onDelete, onUpdate }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleMenuClick = ({ key }) => {
    if (key === "edit") {
      setIsModalVisible(true);
    } else if (key === "delete") {
      onDelete(collection.id);
    }
  };

  const handleUpdate = (updatedCollection) => {
    // Gọi hàm onUpdate để cập nhật collection đã sửa ở phần cha (nếu cần)
    onUpdate(updatedCollection);
  };

  const menuItems = [
    {
      key: "edit",
      label: (
        <div>
          <FontAwesomeIcon
            icon={faPencil}
            style={{
              fontSize: "var(--body-size)",
              marginRight: 8,
            }}
          />
          {t("components.set-item.edit-icon")}
        </div>
      ),
    },
    {
      key: "delete",
      label: (
        <div>
          <DeleteOutlined
            style={{
              fontSize: "var(--body-size)",
              color: "var(--color-error-button)",
              marginRight: 8,
            }}
          />
          {t("components.set-item.delete-icon")}
        </div>
      ),
    },
  ];

  return (
    <div className="set-item-container">
      <div className="set-item-above">
        <div className="set-item-header">
          <Link
            className="set-item-collection-name"
            to={`/public-study-set/${collection.id}`}
          >
            {collection.collection_name}
          </Link>
          <div
            style={{ fontSize: "20px", color: "var(--color-text-disabled)" }}
          >
            {collection.flashcards_count || 0}{" "}
            {t("views.pages.study_detail.totalcard")}
          </div>
        </div>

        <div className="set-item-footer set-item-icon">
          <Dropdown
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <EllipsisOutlined
              style={{
                fontSize: "var(--body-size-max)",
                marginBottom: "5px",
                cursor: "pointer",
              }}
            />
          </Dropdown>
        </div>
      </div>

      {/* Modal Edit Collection */}
      <MemoEditCollection
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onUpdate={handleUpdate}
        collection={collection}
      />
    </div>
  );
};

export default SetItem;
