import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Card, Radio, Alert } from "antd";

import "@/views/pages/study_detail/index.css";
import { useAuth } from "@/contexts/AuthContext";
import { getCollectionById } from "@/api/collection";
import { startSession, submitQuizAnswer, endSession } from "@/api/study";

import LoadingPage from "@/views/error-pages/LoadingPage";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";
import OwnSet from "@/components/set-item/own-set";
import {
  NotiSessionComplete,
  NotiSessionLeave,
} from "@/components/widget/noti-session";

function StudyQuiz() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [results, setResults] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const fetchCollectionData = async () => {
    try {
      const data = await getCollectionById(id);

      setCollection(data.collection);
      return data.collection;
    } catch (err) {
      throw new Error(t("views.pages.study_detail.error-loading-collection"));
    }
  };

  const initQuizSession = async (collectionId) => {
    try {
      const data = await startSession({
        collection_id: collectionId,
        study_type: "test",
        limit: 10,
        new_cards_limit: 5,
        review_cards_limit: 5,
      });

      const { session_id, cards } = data;

      sessionIdRef.current = session_id;
      setSessionId(session_id);

      const cardsWithOptions = cards.map((card) => ({
        ...card,
        options: card.test_options.options,
        correct_index: card.test_options.correct_index,
      }));

      setFlashcards(cardsWithOptions || []);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchCollectionData();
        if (cancelled) return;

        await initQuizSession(data.id);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || t("views.pages.study_detail.error-loading"));
          console.error("Error loading data:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
      if (sessionIdRef.current) {
        endSession({ session_id: sessionIdRef.current }).catch((err) =>
          console.warn("Cannot end session:", err)
        );
      }
    };
  }, [id, t, user]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (
        sessionId &&
        flashcards.length > 0 &&
        currentIndex < flashcards.length
      ) {
        e.preventDefault();
        e.returnValue = ""; // Required for some browsers
        setShowLeaveModal(true);
        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [sessionId, flashcards.length, currentIndex]);

  const handleSubmitQuiz = async () => {
    if (selectedIndex === null) {
      alert(t("views.pages.quiz.select-ans"));
      return;
    }

    const currentCard = flashcards[currentIndex];
    if (!currentCard || !sessionId) return;

    const responseTime = Date.now() - startTimeRef.current;

    // Gửi kèm options và correct_index để backend có thể verify hoặc sử dụng
    const answers = [
      {
        flashcard_id: currentCard.id,
        selected_option: selectedIndex,
        // Thêm metadata để backend có thể sử dụng thay vì regenerate
        options: currentCard.options,
        correct_index: currentCard.correct_index,
      },
    ];

    try {
      setSubmitting(true);
      const result = await submitQuizAnswer({
        session_id: sessionId,
        answers,
        study_mode: "front_to_back",
        response_time_ms: responseTime,
      });

      const backendResult = result.results[0];

      // Temporary fix: Override backend result with frontend calculation
      // Remove this after backend is fixed
      const frontendIsCorrect = selectedIndex === currentCard.correct_index;
      const correctedResult = {
        ...backendResult,
        is_correct: frontendIsCorrect, // Use frontend calculation
        selected_index: selectedIndex,
        correct_index: currentCard.correct_index, // Use frontend correct_index
        options: currentCard.options, // Use frontend options
      };

      setResults(correctedResult);
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError(t("views.pages.quiz.error-submit"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= flashcards.length) {
      setShowCompleteModal(true);
    } else {
      setCurrentIndex(nextIndex);
      setSelectedIndex(null);
      setResults(null);
      startTimeRef.current = Date.now();
    }
  };

  const handleRetry = async () => {
    setShowCompleteModal(false);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setResults(null);
    setLoading(true);
    try {
      await initQuizSession(collection.id);
    } catch (err) {
      console.error("Error restarting session:", err);
      setError(t("views.pages.quiz.error-start-session"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div>{t("views.pages.study_detail.login-required")}</div>;
  if (!collection)
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;

  const currentCard = flashcards[currentIndex];

  if (!currentCard) {
    return (
      <div className="std-detail-container">
        <OwnSet
          collection={collection}
          isAuthor={user?.id === collection.user_id}
          onUpdate={setCollection}
          isDetail={true}
        />
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {t("views.pages.study_detail.no-collection-data")}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="std-detail-container">
        <OwnSet
          collection={collection}
          isAuthor={user?.id === collection.user_id}
          onUpdate={setCollection}
          isStudy={true}
        />

        <Card
          style={{
            marginTop: "3%",
            width: "60%",
          }}
          title={
            <div style={{ fontSize: "var(--body-size-bigger)" }}>
              {`${t("views.pages.quiz.ques")} ${currentIndex + 1} / ${
                flashcards.length
              }`}
            </div>
          }
        >
          <div style={{ fontSize: "var(--body-size-max)", marginBottom: "3%" }}>
            {currentCard.front}
          </div>

          {!results ? (
            <>
              <Radio.Group
                onChange={(e) => setSelectedIndex(e.target.value)}
                value={selectedIndex}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {currentCard.options?.map((option, i) => (
                  <Radio
                    key={i}
                    value={i}
                    style={{
                      fontSize: "var(--normal-font-size)",
                    }}
                  >
                    {option}
                  </Radio>
                ))}
              </Radio.Group>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <BtnBlue
                  textKey="submit"
                  onClick={handleSubmitQuiz}
                  disabled={selectedIndex === null || submitting}
                  style={{ marginTop: 16, fontSize: "var(--body-size)" }}
                />
              </div>
            </>
          ) : (
            <Alert
              type={results.is_correct ? "success" : "error"}
              message={
                results.is_correct
                  ? t("views.pages.typing.correct")
                  : t("views.pages.typing.incorrect")
              }
              description={
                <div>
                  <p>
                    <strong>{t("views.pages.typing.ans")}</strong>{" "}
                    {results.options?.[results.selected_index] || "N/A"}
                  </p>
                  <p>
                    <strong>{t("views.pages.typing.correct-ans")}</strong>{" "}
                    {results.correct_answer}
                  </p>
                </div>
              }
              showIcon
              style={{ fontSize: "var(--normal-font-size)" }}
            />
          )}

          {results && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 16,
              }}
            >
              {currentIndex + 1 < flashcards.length ? (
                <BtnWhite
                  textKey="next-ques"
                  onClick={handleNext}
                  style={{ marginTop: 16, fontSize: "var(--body-size)" }}
                />
              ) : (
                <BtnBlue
                  textKey="finish"
                  onClick={() => setShowCompleteModal(true)}
                  style={{ marginTop: 16, fontSize: "var(--body-size)" }}
                />
              )}
            </div>
          )}
        </Card>
      </div>

      <NotiSessionComplete
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        collectionId={collection.id}
        studyType="quiz"
        onRetry={handleRetry}
      />

      <NotiSessionLeave
        open={showLeaveModal}
        onConfirm={() => {
          setShowLeaveModal(false);
          window.removeEventListener("beforeunload", () => {});
          window.location.href = "/dashboard";
        }}
        onCancel={() => setShowLeaveModal(false)}
        studyType="typing"
      />
    </>
  );
}

export default StudyQuiz;
