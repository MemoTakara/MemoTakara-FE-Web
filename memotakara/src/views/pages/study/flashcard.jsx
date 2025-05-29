// học bằng flashcard
import "@/views/pages/study_detail/index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { faShuffle, faRotate } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/contexts/AuthContext";
import { postRecentCollection } from "@/api/recentCollection";
import { getCollectionById, getPublicCollectionDetail } from "@/api/collection";
import { getCollectionProgress, getDueFlashcards } from "@/api/flashcard";
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoFlash from "@/components/cards/flashcard";
import OwnSet from "@/components/set-item/own-set";
import ToggleWhite from "@/components/btn/toggle-white";

function StudyFlashcard({ isPublic, isEditFC }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcardsDue, setFlashcardsDue] = useState([]);
  const [originalFlashcards, setOriginalFlashcards] = useState([]);
  const [progress, setProgress] = useState({ new: 0, learning: 0, due: 0 });
  const [isShuffled, setIsShuffled] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy chi tiết collection
        const data = user
          ? await getCollectionById(id)
          : await getPublicCollectionDetail(id);

        if (cancelled) return;

        setCollection(data);

        if (user && (data.privacy === 1 || user.id === data.user_id)) {
          await postRecentCollection(data.id);
        }

        const flashcards = user
          ? await getDueFlashcards(id)
          : data.flashcards || [];

        if (cancelled) return;

        setFlashcardsDue(Array.isArray(flashcards) ? flashcards : []);
        setOriginalFlashcards(Array.isArray(flashcards) ? flashcards : []);

        const progressData = user
          ? await getCollectionProgress(id)
          : { new: 0, learning: 0, due: flashcards.length };

        if (cancelled) return;

        setProgress(progressData);
      } catch (err) {
        console.error("Lỗi API:", err);
        if (!cancelled) {
          setError(t("views.pages.study_detail.error-loading"));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [id, t, user]);

  // Trở lại giao diện loading hoặc thông báo lỗi nếu có
  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
  }

  const isAuthor = user && user.id === collection.user_id;

  // Hàm để cập nhật collection từ modal
  const handleUpdateCollection = (updatedCollection) => {
    setCollection((prev) => ({
      ...prev,
      ...updatedCollection,
    }));
  };

  const toggleShuffle = () => {
    if (isShuffled) {
      setFlashcardsDue(originalFlashcards);
    } else {
      const shuffled = [...flashcardsDue].sort(() => Math.random() - 0.5);
      setFlashcardsDue(shuffled);
    }
    setIsShuffled(!isShuffled);
  };

  return (
    <div className="std-detail-container">
      <OwnSet
        collection={collection}
        isAuthor={isAuthor}
        onUpdate={handleUpdateCollection}
        isStudy={true}
      />

      <div className="std-fc-toggle-btn">
        <ToggleWhite
          textKeyDefault="default"
          textKeyClicked="shuffle"
          iconDefault={faRotate}
          iconClicked={faShuffle}
          onClick={toggleShuffle}
        />
      </div>

      <MemoFlash
        isStudy={true}
        flashcards={flashcardsDue}
        collectionId={collection.id}
        collectionTag={collection.tags[0].name}
        progress={progress}
        onUpdateProgress={setProgress}
      />
    </div>
  );
}

export default StudyFlashcard;
