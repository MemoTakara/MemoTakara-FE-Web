import { useEffect, useState, useRef } from "react";
import { Card, Typography, Input, Alert } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "@/components/cards/flashcard.css";
import "@/views/pages/study_detail/index.css";

import { useAuth } from "@/contexts/AuthContext";
import { postRecentCollection } from "@/api/recentCollection";
import { getCollectionById, getPublicCollectionDetail } from "@/api/collection";
import { startSession, submitTypingAnswer, endSession } from "@/api/study";

import LoadingPage from "@/views/error-pages/LoadingPage";
import BtnWhite from "@/components/btn/btn-white";
import OwnSet from "@/components/set-item/own-set";
import {
  NotiSessionComplete,
  NotiSessionLeave,
} from "@/components/widget/noti-session";
import MemoSpeaker from "@/components/widget/speaker";

const { Paragraph } = Typography;

function StudyTyping({ isEditFC }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcardsDue, setFlashcardsDue] = useState([]);
  const [progress, setProgress] = useState({ new: 0, learning: 0, due: 0 });
  const [sessionId, setSessionId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedData, setCompletedData] = useState(null);

  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const fetchCollectionData = async () => {
    const data = user
      ? await getCollectionById(id)
      : await getPublicCollectionDetail(id);

    setCollection(data);

    if (user && (data.privacy === 1 || user.id === data.user_id)) {
      await postRecentCollection(data.id);
    }

    return data;
  };

  const initStudySession = async (collectionId) => {
    const session = await startSession({
      collection_id: collectionId,
      study_type: "typing",
      limit: 10,
      new_cards_limit: 5,
      review_cards_limit: 5,
    });

    sessionIdRef.current = session.session_id;
    setSessionId(session.session_id);
    setFlashcardsDue(session.cards || []);
    setProgress(session.card_counts || {});
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await fetchCollectionData();
        if (cancelled) return;

        if (user) {
          await initStudySession(data.id);
        } else {
          const cards = data.flashcards || [];
          setFlashcardsDue(cards);
          setProgress({ new: 0, learning: 0, due: cards.length });
        }
      } catch (err) {
        console.error("Lỗi API:", err);
        if (!cancelled) setError(t("views.pages.study_detail.error-loading"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      if (sessionIdRef.current) {
        endSession({ session_id: sessionIdRef.current }).catch((error) =>
          console.warn("Không thể kết thúc session:", error)
        );
      }
    };
  }, [id, t, user]);

  useEffect(() => {
    const handleEnd = async () => {
      if (
        sessionIdRef.current &&
        flashcardsDue.length > 0 &&
        currentIndex >= flashcardsDue.length
      ) {
        try {
          const res = await endSession({ session_id: sessionIdRef.current });
          setCompletedData(res);
          setShowCompleteModal(true);
        } catch (err) {
          console.warn("Lỗi khi gọi endSession:", err);
        }
      }
    };

    if (user && currentIndex >= flashcardsDue.length) {
      handleEnd();
    }
  }, [user, currentIndex, flashcardsDue]);

  const handleSubmitAnswer = async () => {
    const currentCard = flashcardsDue[currentIndex];
    if (!sessionId || !currentCard) return;

    const responseTime = Date.now() - startTimeRef.current;

    try {
      const result = await submitTypingAnswer({
        session_id: sessionId,
        collection_id: collection.id,
        flashcard_id: currentCard.id,
        quality: 0, // chưa đánh giá
        study_mode: "front_to_back",
        response_time_ms: responseTime,
        answer: userAnswer.trim(),
      });

      setAnswerResult(result);
      setIsAnswerCorrect(result?.is_correct ?? false);
      setShowAnswer(true);
    } catch (error) {
      console.error("Lỗi khi gửi câu trả lời:", error);
    }
  };

  const handleReview = async (qualityLabel) => {
    const qualityMap = { again: 0, hard: 2, good: 4, easy: 5 };
    const quality = qualityMap[qualityLabel] ?? 0;
    const currentCard = flashcardsDue[currentIndex];
    if (!sessionId || !currentCard) return;

    const responseTime = Date.now() - startTimeRef.current;

    try {
      const result = await submitTypingAnswer({
        session_id: sessionId,
        collection_id: collection.id,
        flashcard_id: currentCard.id,
        quality,
        study_mode: "front_to_back",
        response_time_ms: responseTime,
        answer: userAnswer.trim(),
      });

      if (result.card_counts) {
        setProgress(result.card_counts);
      }

      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setShowAnswer(false);
      setIsAnswerCorrect(false);
      setAnswerResult(null);
      startTimeRef.current = Date.now();
    } catch (error) {
      console.error("Lỗi khi đánh giá:", error);
    }
  };

  const handleRetry = async () => {
    setShowCompleteModal(false);
    setLoading(true);
    try {
      if (sessionIdRef.current) {
        await endSession({ session_id: sessionIdRef.current });
        sessionIdRef.current = null;
      }
      await initStudySession(collection.id);
      setCurrentIndex(0);
      setUserAnswer("");
      setShowAnswer(false);
      setIsAnswerCorrect(false);
      setAnswerResult(null);
    } catch (err) {
      setError(t("views.pages.study_detail.error-loading"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection)
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;

  const currentCard = flashcardsDue[currentIndex];

  return (
    <>
      <div className="std-detail-container">
        <OwnSet
          collection={collection}
          isAuthor={user?.id === collection.user_id}
          onUpdate={setCollection}
          isStudy={true}
        />

        {currentCard ? (
          <Card className="memo-flash-card">
            <div className="memo-flash-inner">
              <div
                className="memo-flash-type"
                style={{
                  borderRadius: "10px",
                  border: "3px solid var(--color-stroke)",
                }}
              >
                <div className="memo-flash-icon">
                  <MemoSpeaker
                    text={currentCard.front}
                    lang={collection.language_front}
                  />
                </div>

                <div className="memo-flash-type-content">
                  {currentCard.front}
                </div>

                <div className="memo-flash-submit">
                  {!showAnswer ? (
                    <>
                      <Input
                        placeholder={t("views.pages.typing.type-placeholder")}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        rows={2}
                        onPressEnter={handleSubmitAnswer}
                        className={{ marginBottom: "5px" }}
                      />
                      <div className="memo-flash-type-btn">
                        <BtnWhite
                          textKey="submit"
                          onClick={handleSubmitAnswer}
                          disabled={!userAnswer.trim()}
                        />
                      </div>
                    </>
                  ) : (
                    <Alert
                      message={isAnswerCorrect ? "Correct!" : "Incorrect"}
                      description={
                        <div>
                          <Paragraph>
                            <strong>Your answer:</strong> {userAnswer}
                          </Paragraph>
                          <Paragraph>
                            <strong>Correct answer:</strong>{" "}
                            {answerResult?.correct_answer ?? currentCard.back}
                          </Paragraph>
                          <Paragraph>
                            <strong>Similarity:</strong>{" "}
                            {answerResult?.similarity ?? "N/A"}%
                          </Paragraph>
                        </div>
                      }
                      type={isAnswerCorrect ? "success" : "error"}
                      icon={
                        isAnswerCorrect ? (
                          <CheckCircleOutlined />
                        ) : (
                          <CloseCircleOutlined />
                        )
                      }
                      style={{ width: "100%", paddingBottom: "0" }}
                    />
                  )}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          ""
        )}

        {showAnswer && currentCard && (
          <>
            <div className="memo-flash-status">
              <BtnWhite textKey="again" onClick={() => handleReview("again")} />
              <BtnWhite textKey="hard" onClick={() => handleReview("hard")} />
              <BtnWhite textKey="good" onClick={() => handleReview("good")} />
              <BtnWhite textKey="easy" onClick={() => handleReview("easy")} />
            </div>
            <div className="memo-flash-status" style={{ width: "32%" }}>
              <div
                className="memo-flash-status-new"
                title={t("tooltip.new_card")}
              >
                {progress.new}
              </div>
              <div
                className="memo-flash-status-learn"
                title={t("tooltip.learning_card")}
              >
                {progress.learning}
              </div>
              <div
                className="memo-flash-status-due"
                title={t("tooltip.due_card")}
              >
                {progress.due}
              </div>
            </div>
          </>
        )}
      </div>

      <NotiSessionLeave isActive={sessionId && flashcardsDue.length > 0} />

      <NotiSessionComplete
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onRetry={handleRetry}
        collectionId={collection?.id}
        studyType="typing"
      />
    </>
  );
}

export default StudyTyping;
