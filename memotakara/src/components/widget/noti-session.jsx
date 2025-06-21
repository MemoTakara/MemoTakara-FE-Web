import { Modal, Button } from "antd";
import { useNavigate } from "react-router-dom";

export const NotiSessionComplete = ({
  open,
  onClose,
  collectionId,
  studyType,
  onRetry,
}) => {
  const navigate = useNavigate();
  const isStudyMode = studyType === "flashcard" || studyType === "typing";

  return (
    <Modal
      open={open}
      title="Hoàn thành phiên học"
      onCancel={onClose}
      footer={[
        !isStudyMode ? (
          <Button key="retry" onClick={onRetry}>
            Học lại
          </Button>
        ) : null,
        <Button key="dashboard" onClick={() => navigate("/dashboard")}>
          Về Dashboard
        </Button>,
        <Button
          key="publicSet"
          type="primary"
          onClick={() => navigate(`/public-study-set/${collectionId}`)}
        >
          Xem bộ từ vựng
        </Button>,
      ]}
    >
      {isStudyMode ? (
        <p>
          Chúc mừng bạn đã hoàn thành phiên học! Hãy nghỉ ngơi trước khi học
          tiếp nhé.
        </p>
      ) : (
        <p>
          Bạn đã hoàn thành phiên luyện tập nhận diện từ vựng. Phương pháp này
          không tính là học, nhưng sẽ giúp bạn ghi nhớ tốt hơn!
        </p>
      )}
    </Modal>
  );
};

export const NotiSessionLeave = ({ open, onConfirm, onCancel, studyType }) => {
  const isSaved = studyType === "flashcard" || studyType === "typing";

  return (
    <Modal
      open={open}
      title="Bạn có chắc muốn thoát?"
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Thoát"
      cancelText="Tiếp tục học"
    >
      <p>
        {isSaved
          ? "Tiến trình học của bạn đã được lưu. Bạn có thể quay lại sau."
          : "Tiến trình sẽ không được lưu nếu bạn thoát khỏi chế độ học hiện tại."}
      </p>
    </Modal>
  );
};
