import "./flashcard.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Progress } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import { submitFlashcardAnswer } from "@/api/study";
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoSpeaker from "@/components/widget/speaker";
import BtnWhite from "@/components/btn/btn-white";

const MemoFlash = ({
  isStudy,
  collection,
  flashcards,
  total,
  languageFront,
  progress,
  onUpdateProgress,
  sessionId,
}) => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0); // Quản lý thẻ hiện tại
  const [flipped, setFlipped] = useState(false); // Trạng thái lật thẻ
  const [summary, setSummary] = useState({ new: 0, learning: 0, due: 0 });
  const [startTime, setStartTime] = useState(Date.now());
  const progressPercent = ((currentIndex + 1) / total) * 100;

  useEffect(() => {
    if (progress) {
      setSummary(progress);
    }
  }, [progress]);

  if (!flashcards) return <LoadingPage />;
  if (!flashcards || total === 0)
    return (
      <div style={{ marginTop: "3%" }}>{t("components.cards.no-fc-due")}</div>
    );

  // Học bằng flashcard
  const handleReview = async (qualityLabel) => {
    if (!sessionId) {
      alert("Session học không hợp lệ. Vui lòng thử lại sau.");
      return;
    }

    const qualityMap = {
      again: 0,
      hard: 2,
      good: 4,
      easy: 5,
    };

    const quality = qualityMap[qualityLabel] ?? 0;
    const cardId = flashcards[currentIndex].id;
    const responseTime = Date.now() - startTime;

    try {
      const result = await submitFlashcardAnswer({
        session_id: sessionId,
        collection_id: collection.id,
        flashcard_id: cardId,
        quality,
        study_mode: "front_to_back",
        response_time_ms: responseTime,
      });

      // Nếu backend trả về progress mới thì cập nhật
      if (result?.card_counts && onUpdateProgress) {
        const updated = {
          new: result.card_counts.new ?? summary.new,
          learning: result.card_counts.learning ?? summary.learning,
          due: result.card_counts.due ?? summary.due,
        };
        setSummary(updated);
        onUpdateProgress(updated);
      }

      setFlipped(false);
      setCurrentIndex((i) => (i + 1) % total);
    } catch (error) {
      console.error("Lỗi khi gửi review:", error);
    }
  };

  const card = flashcards[currentIndex];

  // Hàm chuyển sang thẻ trước
  const prevCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i === 0 ? total - 1 : i - 1));
  };

  // Hàm chuyển sang thẻ tiếp theo
  const nextCard = () => {
    setFlipped(false);
    setCurrentIndex((i) => (i + 1) % total);
  };

  return (
    <div className="memo-flash-container">
      {!isStudy && currentIndex > 0 && (
        <button className="fc-btn-prev" onClick={prevCard}>
          <LeftOutlined />
        </button>
      )}

      <Card className="memo-flash-card" onClick={() => setFlipped(!flipped)}>
        <div className={`memo-flash-inner ${flipped ? "flipped" : ""}`}>
          <div
            className="memo-flash-front"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div
              className="memo-flash-icon"
              onClick={(e) => e.stopPropagation()}
            >
              <MemoSpeaker text={card.front} lang={languageFront} />
            </div>
            <div className="memo-flash-fc-content">{card.front}</div>
          </div>
          <div
            className="memo-flash-back"
            style={{
              borderRadius: "10px",
              border: "3px solid var(--color-stroke)",
            }}
          >
            <div className="memo-flash-fc-content">
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

      {!isStudy && currentIndex < total - 1 && (
        <button className="fc-btn-next" onClick={nextCard}>
          <RightOutlined />
        </button>
      )}

      {isStudy ? (
        <>
          <div className="memo-flash-status">
            <BtnWhite textKey="again" onClick={() => handleReview("again")} />
            <BtnWhite textKey="hard" onClick={() => handleReview("hard")} />
            <BtnWhite textKey="good" onClick={() => handleReview("good")} />
            <BtnWhite textKey="easy" onClick={() => handleReview("easy")} />
          </div>

          <div className="memo-flash-status">
            <div
              className="dashboard_card_status_new"
              title={t("tooltip.new_card")}
            >
              {summary.new}
            </div>

            <div
              className="dashboard_card_status_learn"
              title={t("tooltip.learning_card")}
            >
              {summary.learning}
            </div>

            <div
              className="dashboard_card_status_due"
              title={t("tooltip.due_card")}
            >
              {summary.due}
            </div>
          </div>
        </>
      ) : (
        <div className="memo-flash-status">
          <Progress
            percent={progressPercent.toFixed(2)}
            strokeColor={{
              "0%": "var(--color-light-button-hover)",
              "100%": "var(--color-light-button)",
            }}
            trailColor="var(--color-card-background)"
          />
          <div className="dashboard_card_status_new" style={{ width: "30%" }}>
            {currentIndex + 1} / {total}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoFlash;
