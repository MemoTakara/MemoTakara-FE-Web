// set in folder (list of own-set)
import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import CollectionDropdown from "@/components/collection-modal/collection-menu";
import MemoEditCollection from "@/components/collection-modal/MemoEditCollection";
import MemoRateCollection from "@/components/collection-modal/MemoRateCollection";

const SetItem = ({ collection, onDelete, onUpdate, onCopy }) => {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

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
            onRate={() => {
              setSelectedCollectionId(collection.id);
              setShowRateModal(true);
            }}
            collection={collection}
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

      <MemoRateCollection
        visible={showRateModal}
        onCancel={() => setShowRateModal(false)}
        collectionId={selectedCollectionId}
      />
    </div>
  );
};

export default SetItem;
