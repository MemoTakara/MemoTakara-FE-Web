import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";

import { duplicateCollection } from "@/api/collection";
import CollectionDropdown from "@/components/collection-modal/collection-menu";
import MemoEditCollection from "@/components/collection-modal/MemoEditCollection";
import MemoRateCollection from "@/components/collection-modal/MemoRateCollection";

const PublicSet = ({ collection, isAuthor, isPublic, onUpdate, isDetail }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);

  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
  }

  const handleDuplicate = async () => {
    const result = await duplicateCollection(collection.id);

    if (result.success) {
      messageApi.success(result.message);
      setTimeout(() => navigate(`/public-study-set/${result.id}`), 3000);
    } else {
      messageApi.error(result.message);
    }
  };

  const handleUpdate = (updatedCollection) => {
    // Gọi hàm onUpdate để cập nhật collection đã sửa ở phần cha (nếu cần)
    onUpdate(updatedCollection);
  };

  return (
    <div className="set-item-container">
      {contextHolder}
      <div className="set-item-above">
        <div className="set-item-header">
          <div className="set-item-collection-name">
            {collection.collection_name}
          </div>

          <div className="set-item-collection-des">
            {t("components.header.search_user1")}{" "}
            {collection.user?.role === "admin"
              ? "MemoTakara"
              : collection.user?.username ||
                t("components.header.search_user2")}
          </div>
          {!isDetail && (
            <div className="set-item-collection-des">
              {t("views.pages.study_detail.collection-des")}{" "}
              {collection.description
                ? collection.description
                : t("views.pages.study_detail.no-description")}
            </div>
          )}
        </div>

        <div className="set-item-footer">
          {!isPublic && (
            <CollectionDropdown
              isAuthor={isAuthor}
              onEdit={() => setIsModalVisible(true)}
              onCopy={handleDuplicate}
              onRate={() => {
                setSelectedCollectionId(collection.id);
                setShowRateModal(true);
              }}
              collection={collection}
            />
          )}

          <div className="set-item-totalcard">
            {collection.flashcards?.length || 0}
            <br />
            {t("views.pages.study_detail.totalcard")}
          </div>
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

export default PublicSet;
