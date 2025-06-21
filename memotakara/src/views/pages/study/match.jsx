import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "@/views/pages/study_detail/index.css";

import { useAuth } from "@/contexts/AuthContext";
import { getCollectionById, getPublicCollectionDetail } from "@/api/collection";
import { postRecentCollection } from "@/api/recentCollection";
import { startSession, submitMatchingAnswer, endSession } from "@/api/study";

import LoadingPage from "@/views/error-pages/LoadingPage";
import MatchingCard from "@/components/cards/match-card";
import OwnSet from "@/components/set-item/own-set";
import {
  NotiSessionComplete,
  NotiSessionLeave,
} from "@/components/widget/noti-session";

function StudyMatching({ isEditFC }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [matchResults, setMatchResults] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  const sessionIdRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  const setupSession = async (collectionId) => {
    try {
      const session = await startSession({
        collection_id: collectionId,
        study_type: "game_match",
        limit: 5,
        new_cards_limit: 0,
        review_cards_limit: 5,
      });
      sessionIdRef.current = session.session_id;
      setSessionId(session.session_id);
      setFlashcards(session.cards || []);
      setIsCompleted(false);
      setMatchResults(null);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    let isCancelled = false;

    const fetchCollection = async () => {
      return user
        ? await getCollectionById(id)
        : await getPublicCollectionDetail(id);
    };

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCollection();
        if (isCancelled) return;

        setCollection(data);

        if (user && (data.privacy === 1 || user.id === data.user_id)) {
          await postRecentCollection(data.id);
        }

        if (user) {
          await setupSession(data.id);
        } else {
          const cards = data.flashcards || [];
          setFlashcards(cards);
        }
      } catch (err) {
        if (!isCancelled) setError(t("views.pages.study_detail.error-loading"));
        console.error("Lỗi khi load dữ liệu:", err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    loadData();

    return () => {
      isCancelled = true;
      if (sessionIdRef.current) {
        endSession({ session_id: sessionIdRef.current }).catch((err) =>
          console.warn("Không thể kết thúc session:", err)
        );
      }
    };
  }, [id, t, user]);

  useEffect(() => {
    if (isCompleted) {
      setShowCompleteModal(true);
    }
  }, [isCompleted]);

  const handleSubmitMatching = async (matches) => {
    const responseTime = Date.now() - startTimeRef.current;
    try {
      const result = await submitMatchingAnswer({
        session_id: sessionId,
        matches,
        study_mode: "front_to_back",
        response_time_ms: responseTime,
      });
      setIsCompleted(true);
      setMatchResults(result);
    } catch (err) {
      console.error("Lỗi khi gửi đáp án matching:", err);
      setError(t("views.pages.quiz.error-submitting"));
    }
  };

  const handleRetry = async () => {
    setShowCompleteModal(false);
    setLoading(true);
    try {
      setLoading(true);
      if (sessionIdRef.current) {
        await endSession({ session_id: sessionIdRef.current });
        sessionIdRef.current = null;
      }
      await setupSession(collection.id);
    } catch (err) {
      setError(t("views.pages.study_detail.error-loading"));
      console.error("Lỗi khi tạo session mới:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection)
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;

  return (
    <>
      <div className="std-detail-container">
        <OwnSet
          collection={collection}
          isAuthor={user?.id === collection.user_id}
          onUpdate={setCollection}
          isStudy
        />

        <MatchingCard
          flashcards={flashcards}
          onSubmitResult={handleSubmitMatching}
          onRetry={handleRetry}
          matchResults={matchResults}
        />
      </div>

      <NotiSessionComplete
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onRetry={handleRetry}
        collectionId={collection?.id}
        studyType="matching"
      />

      <NotiSessionLeave
        open={showLeaveModal}
        onConfirm={() => {
          setShowLeaveModal(false);
          window.removeEventListener("beforeunload", () => {});
          window.location.href = "/dashboard";
        }}
        onCancel={() => setShowLeaveModal(false)}
        studyType="matching"
      />
    </>
  );
}

export default StudyMatching;
