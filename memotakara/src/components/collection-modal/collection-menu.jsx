import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, message } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  StarOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faEye, faPencil } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import { deleteCollection } from "@/api/collection";

import MemoDetailCollection from "@/components/collection-modal/MemoDetailCollection";
import MemoFCCreate from "@/components/flashcard-modal/MemoFCCreate";
import MemoFCCreateBulk from "@/components/flashcard-modal/MemoFCCreateBulk";

const CollectionDropdown = ({
  isAuthor,
  onEdit,
  onCopy,
  onDelete,
  onRate,
  collection,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);

  const menuItems = useMemo(() => {
    const items = [];

    if (isAuthor) {
      items.push({
        key: "create",
        label: (
          <div>
            <PlusOutlined
              style={{ fontSize: "var(--body-size)", marginRight: 8 }}
            />
            {t("components.collection-modal.create-fc")}
          </div>
        ),
        children: [
          {
            key: "create-one",
            label: t("components.collection-modal.create-fc"),
          },
          {
            key: "create-bulk",
            label: t("components.collection-modal.create-fc-bulk"),
          },
        ],
      });
    }

    items.push(
      {
        key: "detail",
        label: (
          <div>
            <FontAwesomeIcon
              icon={faEye}
              style={{ fontSize: "var(--body-size)", marginRight: 6 }}
            />
            {t("components.set-item.detail-icon")}
          </div>
        ),
      },
      {
        key: "copy",
        label: (
          <div>
            <FontAwesomeIcon
              icon={faCopy}
              style={{ fontSize: "var(--body-size)", marginRight: 10 }}
            />
            {t("components.set-item.copy-icon")}
          </div>
        ),
      }
    );

    // Item: Rate (chỉ hiện nếu không phải tác giả)
    if (!isAuthor) {
      items.push({
        key: "rate",
        label: (
          <div>
            <StarOutlined
              style={{ fontSize: "var(--body-size)", marginRight: 8 }}
            />
            {t("components.set-item.rate-icon")}
          </div>
        ),
      });
    }

    // Items: Edit + Delete (chỉ hiện nếu là tác giả)
    if (isAuthor) {
      items.push({
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
      });
      items.push({
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
      });
    }

    return items;
  }, [isAuthor, t]);

  const handleMenuClick = async ({ key }) => {
    if (key === "create-one") setOpenCreateModal(true);
    else if (key === "create-bulk") setOpenBulkModal(true);
    else if (key === "detail") setOpenDetailModal(true);
    else if (key === "edit") onEdit?.();
    else if (key === "copy") onCopy?.();
    else if (key === "rate") onRate?.();
    else if (key === "delete") {
      if (onDelete) return onDelete();

      const confirm = window.confirm(
        t("views.pages.study_sets.confirm-delete")
      );
      if (!confirm) return;

      const res = await deleteCollection(collection.id);
      if (res.success) {
        messageApi.success(t("views.pages.study_sets.copy-success-dashboard"));
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        messageApi.error(res.message || t("views.pages.study_sets.copy-fail"));
      }
    }
  };

  const menu = <Menu onClick={handleMenuClick} items={menuItems} />;

  return (
    <>
      {contextHolder}
      <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
        <EllipsisOutlined
          style={{
            fontSize: "var(--body-size-max)",
            marginBottom: "5px",
            cursor: "pointer",
          }}
        />
      </Dropdown>

      <MemoDetailCollection
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        data={collection}
      />

      <MemoFCCreate
        open={openCreateModal}
        onClose={() => setOpenCreateModal(false)}
        collectionId={collection.id}
      />
      <MemoFCCreateBulk
        open={openBulkModal}
        onClose={() => setOpenBulkModal(false)}
        collectionId={collection.id}
      />
    </>
  );
};

export default CollectionDropdown;
