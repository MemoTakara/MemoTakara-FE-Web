import { useEffect, useState } from "react";
import { Modal, Table, Pagination, Spin } from "antd";
import { useTranslation } from "react-i18next";

import { getFlashcardReviewHistory } from "@/api/progress";
import FormattedDate from "@/components/widget/formatted-date";

const MemoFCHistory = ({ flashcardId, open, onClose }) => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await getFlashcardReviewHistory(flashcardId, {
        page: pageNumber,
        per_page: 10,
      });
      setData(res.data);
      setTotal(res.total);
      setPage(res.current_page);
    } catch (err) {
      console.error("Lỗi lấy lịch sử:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchData(page);
  }, [open, page]);

  const columns = [
    {
      title: t("components.flashcard-modal.study-type"),
      dataIndex: "study_type",
      key: "study_type",
    },
    {
      title: t("components.flashcard-modal.quality"),
      dataIndex: "quality",
      key: "quality",
    },
    {
      title: t("components.flashcard-modal.interval"),
      dataIndex: "new_interval",
      key: "new_interval",
    },
    {
      title: t("components.flashcard-modal.ease-factor"),
      dataIndex: "new_ease_factor",
      key: "new_ease_factor",
    },
    {
      title: t("components.flashcard-modal.repetition"),
      dataIndex: "new_repetitions",
      key: "new_repetitions",
    },
    {
      title: t("components.flashcard-modal.review-time"),
      dataIndex: "reviewed_at",
      key: "reviewed_at",
      render: (text) => <FormattedDate dateString={text} />,
    },
  ];

  return (
    <Modal
      title={t("components.flashcard-modal.fc-review-title")}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowKey="id"
            size="middle"
            bordered
          />
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <Pagination
              current={page}
              total={total}
              pageSize={10}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default MemoFCHistory;
