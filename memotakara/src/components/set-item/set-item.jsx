// set in folder (list of own-set)
import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";
import CollectionDropdown from "@/components/widget/collection-menu";

const SetItem = ({ collection, onDelete, onUpdate, onCopy }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleUpdate = (updatedCollection) => {
    // Gọi hàm onUpdate để cập nhật collection đã sửa ở phần cha (nếu cần)
    onUpdate(updatedCollection);
  };

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
          <CollectionDropdown
            isAuthor={true}
            onEdit={() => setIsModalVisible(true)}
            onCopy={() => onCopy(collection.id)}
            onDelete={() => onDelete(collection.id)}
          />
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
