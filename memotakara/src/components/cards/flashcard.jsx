import "./flashcard.css";
import { useEffect, useState } from "react";
import { Card, Button, Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { reviewFlashcard, getCollectionProgress } from "@/api/flashcard";
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoSpeaker from "@/components/speaker";
import BtnWhite from "@/components/btn/btn-white";

const MemoFlash = ({
  isStudy,
  flashcards,
  collectionId,
  collectionTag,
  progress,
  onUpdateProgress,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý thẻ hiện tại
  const [flipped, setFlipped] = useState(false); // Trạng thái lật thẻ
  const [summary, setSummary] = useState({ new: 0, learning: 0, due: 0 });

  useEffect(() => {
    if (progress) {
      setSummary(progress);
    }
  }, [progress]);

  if (!flashcards) return <LoadingPage />;
  if (!flashcards || flashcards.length === 0)
    return <div>{t("components.cards.no-fc-due")}</div>;

  const mapTagToLang = (tag) => {
    const tagMap = {
      english: "en",
      "tiếng anh": "en",
      japanese: "ja",
      "tiếng nhật": "ja",
      chinese: "zh",
      "tiếng trung": "zh",
    };
    return tagMap[tag?.toLowerCase()] || "en";
  };

  // Học bằng flashcard
  const handleReview = async (quality) => {
    const cardId = flashcards[currentIndex].id;
    try {
      await reviewFlashcard({ flashcard_id: cardId, quality });

      // Cập nhật lại tiến độ
      if (onUpdateProgress) {
        const updatedProgress = await getCollectionProgress(collectionId);
        onUpdateProgress(updatedProgress);
      }

      // Chuyển sang thẻ tiếp theo
      setFlipped(false);
      setCurrentIndex((i) => (i + 1) % flashcards.length);
    } catch (error) {
      console.error("Lỗi khi gửi review:", error);
    }
    console.log("summary", summary);
  };

  const card = flashcards[currentIndex];

  // Hàm chuyển sang thẻ trước
  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i === 0 ? flashcards.length - 1 : i - 1));
  };

  // Hàm chuyển sang thẻ tiếp theo
  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % flashcards.length);
  };

  return (
    <div className="memo-flash-container">
      <button className="fc-btn-prev" onClick={prevCard}>
        <LeftOutlined />
      </button>

      <Card className="memo-flash-card" onClick={() => setFlipped(!flipped)}>
        <div className={`memo-flash-inner ${flipped ? "flipped" : ""}`}>
          <div
            className="memo-flash-front"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div className="memo-flash-icon">
              <MemoSpeaker
                text={card.front}
                lang={mapTagToLang(collectionTag)}
              />
            </div>
            <div
              className="memo-flash-front-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                flex: 1,
                width: "100%",
                height: "100%",
                fontSize: "var(--body-size-bigger)",
                padding: "40px",
                cursor: "pointer",
              }}
            >
              {card.front}
            </div>
          </div>
          <div
            className="memo-flash-back"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div
              className="memo-flash-back-content"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                width: "100%",
                height: "100%",
                fontSize: "var(--body-size-bigger)",
                padding: "40px",
                cursor: "pointer",
              }}
            >
              {card.pronunciation}
              <br />
              <br />
              {card.back}
              <br />
              <br />
              {card.kanji ? card.kanji : null}{" "}
              {/* Hiển thị kanji nếu có, ngược lại không hiển thị gì */}
            </div>
          </div>
        </div>
      </Card>

      <button className="fc-btn-next" onClick={nextCard}>
        <RightOutlined />
      </button>

      {isStudy ? (
        <>
          <div className="memo-flash-status">
            <BtnWhite textKey="again" onClick={() => handleReview("again")} />
            <BtnWhite textKey="hard" onClick={() => handleReview("hard")} />
            <BtnWhite textKey="good" onClick={() => handleReview("good")} />
            <BtnWhite textKey="easy" onClick={() => handleReview("easy")} />
          </div>

          <div className="memo-flash-status">
            <Tooltip //new
              placement="bottomRight"
              title={t("tooltip.new_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_new">{summary.new}</div>
            </Tooltip>

            <Tooltip //learning
              placement="bottomRight"
              title={t("tooltip.learning_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_learn">
                {summary.learning}
              </div>
            </Tooltip>

            <Tooltip //due
              placement="bottomRight"
              title={t("tooltip.due_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_due">{summary.due}</div>
            </Tooltip>
          </div>
        </>
      ) : (
        <div className="memo-flash-status">
          <div>
            {t("components.cards.card")} {currentIndex + 1} /{" "}
            {flashcards.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoFlash;
