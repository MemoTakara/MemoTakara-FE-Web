// set while study
import "./index.css";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faPencil,
  faCodePullRequest,
  faRepeat,
  faKeyboard,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { duplicateCollection } from "@/api/collection";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";

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

  const handleMenuClick = ({ key }) => {
    if (key === "edit") {
      setIsModalVisible(true);
    } else if (key === "copy") {
      handleDuplicate();
    }
  };

  const handleUpdate = (updatedCollection) => {
    // Gọi hàm onUpdate để cập nhật collection đã sửa ở phần cha (nếu cần)
    onUpdate(updatedCollection);
  };

  const menuItems = useMemo(
    () => [
      ...(isAuthor
        ? [
            {
              key: "edit",
              label: (
                <div>
                  <FontAwesomeIcon
                    icon={faPencil}
                    style={{ fontSize: "var(--body-size)", marginRight: 8 }}
                  />
                  {t("components.set-item.edit-icon")}
                </div>
              ),
            },
          ]
        : []),
      {
        key: "copy",
        label: (
          <div>
            <FontAwesomeIcon
              icon={faCopy}
              style={{
                fontSize: "var(--body-size)",
                marginRight: 8,
              }}
            />
            {t("components.set-item.copy-icon")}
          </div>
        ),
      },
    ],
    [isAuthor, t]
  );

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
          to={`/public-study-set/${collection.id}`}
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
          to={`/public-study-set/${collection.id}`}
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
          to={`/public-study-set/${collection.id}`}
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
