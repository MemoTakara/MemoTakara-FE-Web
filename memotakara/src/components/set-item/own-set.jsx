// set while study
import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { message } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCodePullRequest,
  faRepeat,
  faKeyboard,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { duplicateCollection } from "@/api/collection";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";
import CollectionDropdown from "@/components/widget/collection-menu";

const OwnSet = ({ collection, isAuthor, onUpdate, isStudy }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  const handleDuplicate = async () => {
    const result = await duplicateCollection(collection.id);

    if (result.success) {
      messageApi.success(result.message);
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

          {!isStudy && (
            <div className="set-item-collection-des">
              {t("views.pages.study_detail.collection-des")}{" "}
              {collection.description
                ? collection.description
                : t("views.pages.study_detail.no-description")}
            </div>
          )}
        </div>

        <div className="set-item-footer">
          <CollectionDropdown
            isAuthor={isAuthor}
            onEdit={() => setIsModalVisible(true)}
            onCopy={handleDuplicate}
          />

          {/* <div className="set-item-totalcard">
            {collection.flashcards?.length || 0}
            <br />
            {t("views.pages.study_detail.totalcard")}
          </div> */}
        </div>
      </div>

      {/* line */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "#00000080",
          margin: "15px 0",
        }}
      ></div>

      <div className="set-item-bottom">
        <Link
          to={`/collection-study/match/${collection.id}`}
          className="set-item-link"
        >
          <FontAwesomeIcon
            icon={faCodePullRequest}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.merge-icon")}
        </Link>

        <Link
          to={`/collection-study/flashcard/${collection.id}`}
          className="set-item-link"
        >
          <FontAwesomeIcon
            icon={faRepeat}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.flashcard-icon")}
        </Link>

        <Link
          to={`/collection-study/typing/${collection.id}`}
          className="set-item-link"
        >
          <FontAwesomeIcon
            icon={faKeyboard}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.typing-icon")}
        </Link>

        <Link
          to={`/collection-study/quiz/${collection.id}`}
          className="set-item-link"
        >
          <FontAwesomeIcon
            icon={faBook}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.test-icon")}
        </Link>
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

export default OwnSet;
