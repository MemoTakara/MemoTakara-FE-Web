import "./index.css";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, message } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faPencil } from "@fortawesome/free-solid-svg-icons";
import { duplicateCollection } from "@/api/collection";
import MemoEditCollection from "@/components/create-collection/MemoEditCollection";

const PublicSet = ({ collection, isAuthor, isPublic, onUpdate }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);

  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
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

          <div className="set-item-collection-des">
            {t("views.pages.study_detail.collection-des")}{" "}
            {collection.description
              ? collection.description
              : t("views.pages.study_detail.no-description")}
          </div>
        </div>

        <div className="set-item-footer">
          {!isPublic && (
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
          )}

          <div className="set-item-totalcard">
            {collection.flashcards?.length || 0}{" "}
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
    </div>
  );
};

export default PublicSet;
