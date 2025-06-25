import { Modal, Descriptions, Tag, Divider, Table } from "antd";
import { useTranslation } from "react-i18next";

import FormattedDate from "@/components/widget/formatted-date";

const MemoDetailCollection = ({ open, onClose, data }) => {
  const { t } = useTranslation();
  if (!data) return null;

  const {
    collection_name,
    description,
    privacy,
    total_cards,
    average_rating,
    total_ratings,
    total_duplicates,
    language_front,
    language_back,
    difficulty_level,
    created_at,
    updated_at,
    user,
    tags = [],
    ratings = [],
  } = data;

  const columns = [
    {
      title: t("components.collection-modal.username"),
      dataIndex: ["user", "username"],
      key: "user",
      width: 150,
    },
    {
      title: t("components.collection-list.rate"),
      dataIndex: "rating",
      key: "rating",
      width: 100,
      render: (rating) => `⭐ ${rating}`,
    },
    {
      title: t("components.collection-modal.comment"),
      dataIndex: "review",
      key: "review",
    },
    {
      title: t("components.collection-modal.update-at"),
      dataIndex: "updated_at",
      key: "updated_at",
      render: (text) => (text ? <FormattedDate dateString={text} /> : "-"),
      width: 160,
    },
  ];

  return (
    <Modal
      title={`${t("components.collection-modal.detail")} ${collection_name}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions
        bordered
        column={1}
        size="small"
        labelStyle={{ width: "30%" }}
      >
        <Descriptions.Item label={t("components.create-collection.des")}>
          {description?.trim()
            ? description
            : t("views.pages.study_detail.no-description")}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.create-collection.privacy")}>
          {privacy === 0
            ? t("components.create-collection.privacy-public")
            : t("components.create-collection.privacy-private")}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.total-card")}>
          {total_cards}
        </Descriptions.Item>
        <Descriptions.Item
          label={t("components.collection-modal.average-rate")}
        >
          {average_rating}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.total-dupli")}>
          {total_duplicates}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.lang")}>
          {language_front} → {language_back}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-list.difficulty")}>
          {difficulty_level}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.creator")}>
          {user?.username}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.tags")}>
          {tags.map((tag) => (
            <Tag key={tag.id}>{tag.name}</Tag>
          ))}
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.create-at")}>
          <FormattedDate dateString={created_at} />
        </Descriptions.Item>
        <Descriptions.Item label={t("components.collection-modal.update-at")}>
          <FormattedDate dateString={updated_at} />
        </Descriptions.Item>
      </Descriptions>

      {ratings.length > 0 && (
        <>
          <Divider>
            {t("components.collection-modal.ratings")} ({total_ratings})
          </Divider>
          <Table
            dataSource={ratings}
            columns={columns}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </>
      )}
    </Modal>
  );
};

export default MemoDetailCollection;
