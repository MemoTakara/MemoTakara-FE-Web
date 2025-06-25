// học bằng flashcard
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import "@/views/pages/study_detail/index.css";

import { useAuth } from "@/contexts/AuthContext";
import { getCollectionById } from "@/api/collection";
import { startSession, endSession } from "@/api/study";

import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoFlash from "@/components/cards/flashcard";
import OwnSet from "@/components/set-item/own-set";
import {
  NotiSessionComplete,
  NotiSessionLeave,
} from "@/components/widget/noti-session";

function StudyFlashcard({ isPublic }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [progress, setProgress] = useState({ new: 0, learning: 0, due: 0 });
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const sessionIdRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchCollection = async () => {
      try {
        const data = await getCollectionById(id);

        setCollection(data.collection);
        return data.collection;
      } catch (err) {
        throw new Error(t("views.pages.study_detail.error-loading-collection"));
      }
    };

    const setupSession = async (collectionId) => {
      const session = await startSession({
        collection_id: collectionId,
        study_type: "flashcard",
        limit: 40,
        new_cards_limit: 20,
        review_cards_limit: 20,
      });

      sessionIdRef.current = session.session_id;
      setSessionId(session.session_id);
      setFlashcards(session.cards || []);
      setProgress(session.card_counts || { new: 0, learning: 0, due: 0 });
    };

    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchCollection();
        if (isCancelled) return;

        setCollection(data);

        if (user) {
          await setupSession(data.id);
        } else {
          const cards = data.flashcards || [];
          setFlashcards(cards);
          setProgress({ new: 0, learning: 0, due: cards.length });
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
    if (user && flashcards.length === 0) {
      setShowCompleteModal(true);
    }
  }, [user, flashcards]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
  }

  // const isAuthor = user?.id === collection.user_id;
  const isAuthor = collection.can_edit;

  // Hàm để cập nhật collection từ modal
  const handleUpdateCollection = (updatedCollection) => {
    setCollection((prev) => ({
      ...prev,
      ...updatedCollection,
    }));
  };

  const handleRetry = async () => {
    setShowCompleteModal(false);
    setLoading(true);
    try {
      if (sessionIdRef.current) {
        await endSession({ session_id: sessionIdRef.current });
        sessionIdRef.current = null;
      }
      await setupSession(collection.id);
    } catch (err) {
      setError(t("views.pages.study_detail.error-loading"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="std-detail-container">
        <OwnSet
          collection={collection}
          isAuthor={isAuthor}
          onUpdate={setCollection}
          isDetail
        />

        <MemoFlash
          isStudy
          flashcards={flashcards}
          collection={collection}
          languageFront={collection.language_front || ""}
          progress={progress}
          onUpdateProgress={setProgress}
          sessionId={sessionId}
        />
      </div>
      <NotiSessionLeave isActive={sessionId && flashcards.length > 0} />

      <NotiSessionComplete
        open={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onRetry={handleRetry}
        collectionId={collection?.id}
        studyType="flashcard"
      />
    </>
  );
}

export default StudyFlashcard;
