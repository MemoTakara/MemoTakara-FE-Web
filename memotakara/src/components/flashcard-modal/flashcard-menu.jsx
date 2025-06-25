import { useState, useMemo } from "react";
import { Dropdown, Menu, message, Modal, Descriptions } from "antd";
import {
  EllipsisOutlined,
  DeleteOutlined,
  HistoryOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faEye } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import {
  getFlashcardDetail,
  updateFlashcard,
  deleteFlashcard,
} from "@/api/flashcard";
import MemoFCEdit from "@/components/flashcard-modal/MemoFCEdit";
import MemoFCHistory from "@/components/flashcard-modal/MemoFCHistory";
import FormattedDate from "@/components/widget/formatted-date";

const FlashcardDropdown = ({ isAuthor, initialData, onUpdated, onDeleted }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [showHistory, setShowHistory] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const isLeech = useMemo(() => {
    return initialData.statuses?.some((s) => s.is_leech) ?? false;
  }, [initialData.statuses]);

  const handleDelete = async () => {
    const confirm = window.confirm(t("views.pages.study_sets.confirm-delete"));
    if (!confirm) return;

    try {
      await deleteFlashcard(initialData.id);
      messageApi.success(t("components.flashcard-modal.fc-delete-success"));
      onDeleted?.();
    } catch (err) {
      messageApi.error(t("components.flashcard-modal.fc-delete-error"));
    }
  };

  const handleUpdate = async (values) => {
    try {
      const res = await updateFlashcard(initialData.id, values);
      message.success(t("components.flashcard-modal.fc-update-success"));
      onUpdated?.(res.data);
      setShowEditModal(false);
    } catch (err) {
      message.error(t("components.flashcard-modal.fc-update-error"));
    }
  };

  const handleOpenDetail = async () => {
    try {
      const res = await getFlashcardDetail(initialData.id);
      if (res.success) {
        setDetailData(res.data);
        setShowDetail(true);
      } else {
        message.error(res.message || t("messages.flashcard-fetch-error"));
      }
    } catch (err) {
      message.error(t("messages.flashcard-fetch-error"));
    }
  };

  const menuItems = useMemo(() => {
    const items = [
      {
        key: "detail",
        label: (
          <div>
            <FontAwesomeIcon icon={faEye} style={{ marginRight: 8 }} />
            {t("components.set-item.detail-icon")}
          </div>
        ),
      },
      {
        key: "history",
        label: (
          <div>
            <HistoryOutlined
              style={{ fontSize: "var(--body-size)", marginRight: 8 }}
            />
            {t("components.set-item.history-icon")}
          </div>
        ),
      },
    ];

    if (isAuthor) {
      items.push(
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
        }
      );
    }

    return items;
  }, [isAuthor, t]);

  const handleMenuClick = ({ key }) => {
    if (key === "detail") handleOpenDetail();
    else if (key === "edit") setShowEditModal(true);
    else if (key === "history") setShowHistory(true);
    else if (key === "delete") handleDelete();
  };

  const menu = <Menu onClick={handleMenuClick} items={menuItems} />;

  return (
    <>
      {contextHolder}
      <div style={{ position: "relative", display: "inline-block" }}>
        {isLeech && (
          <ExclamationCircleOutlined
            title={t("components.set-item.leech-icon")}
            style={{
              position: "absolute",
              top: "-70%",
              right: "10%",
              fontSize: "var(--normal-body-size)",
              color: "var(--color-danger)",
            }}
          />
        )}
        <Dropdown overlay={menu} placement="bottomRight" trigger={["click"]}>
          <EllipsisOutlined
            style={{
              fontSize: "var(--body-size-max)",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          />
        </Dropdown>
      </div>

      {showDetail && detailData && (
        <Modal
          open={showDetail}
          onCancel={() => setShowDetail(false)}
          footer={null}
          width={700}
        >
          <Descriptions
            title={t("components.detail-fc.fc-info")}
            bordered
            column={1}
            size="middle"
          >
            {/* <Descriptions.Item label="ID">{detailData.id}</Descriptions.Item> */}
            <Descriptions.Item label={t("components.flashcard-modal.front")}>
              {detailData.front}
            </Descriptions.Item>
            <Descriptions.Item label={t("components.flashcard-modal.back")}>
              {detailData.back}
            </Descriptions.Item>
            <Descriptions.Item
              label={t("components.flashcard-modal.pronunciation")}
            >
              {detailData.pronunciation || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("components.flashcard-modal.kanji")}>
              {detailData.kanji || "-"}
            </Descriptions.Item>
            <Descriptions.Item label={t("components.flashcard-modal.image")}>
              {detailData.image || "-"}
            </Descriptions.Item>
            <Descriptions.Item
              label={t("components.flashcard-modal.extra-data")}
            >
              {detailData.extra_data &&
              typeof detailData.extra_data === "object" ? (
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {Object.entries(detailData.extra_data).map(([key, value]) => (
                    <div key={key}>
                      <b>{key}:</b> {String(value)}
                    </div>
                  ))}
                </div>
              ) : (
                "-"
              )}
            </Descriptions.Item>

            <Descriptions.Item
              label={t("components.collection-modal.create-at")}
            >
              <FormattedDate dateString={detailData.created_at} />
            </Descriptions.Item>
            <Descriptions.Item
              label={t("components.collection-modal.update-at")}
            >
              <FormattedDate dateString={detailData.updated_at} />
            </Descriptions.Item>
          </Descriptions>

          {/* <Descriptions
            title={t("components.set-item.collection-info")}
            bordered
            column={1}
            size="middle"
          >
            <Descriptions.Item label="Tên bộ sưu tập">
              {detailData.collection?.collection_name}
            </Descriptions.Item>
          </Descriptions> */}

          <Descriptions
            title={t("components.detail-fc.status-info")}
            bordered
            column={1}
            size="middle"
            labelStyle={{ width: "30%" }}
            style={{ marginTop: "5%" }}
          >
            {detailData.statuses?.length > 0 ? (
              detailData.statuses.map((status, index) => (
                <Descriptions.Item
                  key={`status-${index}`}
                  label={`#${index + 1} - ${t(
                    "components.detail-fc.study-mode"
                  )}: ${status.study_mode}`}
                >
                  <div>
                    <p>
                      <b>{t("components.detail-fc.fc-status")}: </b>
                      {status.status}
                    </p>
                    <p>
                      <b>
                        {t("components.detail-fc.interval")}
                        {" ("}
                        {t("views.pages.progress.days")}
                        {"):"}
                      </b>{" "}
                      {status.interval}
                    </p>
                    <p>
                      <b>
                        {t("components.detail-fc.interval")}
                        {" ("}
                        {t("components.detail-fc.min")}
                        {"):"}
                      </b>{" "}
                      {status.interval_minutes}
                    </p>
                    <p title={t("components.flashcard-modal.ease-factor")}>
                      <b>Ease Factor:</b> {status.ease_factor}
                    </p>
                    <p title={t("components.flashcard-modal.repetition")}>
                      <b>Repetitions:</b> {status.repetitions}
                    </p>
                    <p title={t("components.detail-fc.lapses")}>
                      <b>Lapses:</b> {status.lapses}
                    </p>
                    {/* <p title="Sai quá 8 lần">
                      <b>Leech:</b> {status.is_leech ? "Yes" : "No"}
                    </p> */}
                    <p>
                      <b>
                        {t("components.detail-fc.last-review")}
                        {": "}
                      </b>
                      {status.last_reviewed_at ? (
                        <FormattedDate dateString={status.last_reviewed_at} />
                      ) : (
                        <span>{t("components.detail-fc.study-yet")}</span>
                      )}
                    </p>
                    <p>
                      <b>
                        {t("components.detail-fc.next-review")}
                        {": "}
                      </b>
                      {status.next_review_at ? (
                        <FormattedDate dateString={status.next_review_at} />
                      ) : (
                        <span>{t("components.detail-fc.study-yet")}</span>
                      )}
                    </p>
                  </div>
                </Descriptions.Item>
              ))
            ) : (
              <Descriptions.Item label={t("components.detail-fc.fc-status")}>
                new
              </Descriptions.Item>
            )}
          </Descriptions>
        </Modal>
      )}

      <MemoFCHistory
        flashcardId={initialData.id}
        open={showHistory}
        onClose={() => setShowHistory(false)}
      />
      <MemoFCEdit
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleUpdate}
        initialData={initialData}
      />
    </>
  );
};

export default FlashcardDropdown;
