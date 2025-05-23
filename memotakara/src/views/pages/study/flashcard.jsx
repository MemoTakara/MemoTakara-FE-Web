// học bằng flashcard
import "@/views/pages/study_detail/index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { postRecentCollection } from "@/api/recentCollection";
import { getCollectionById, getPublicCollectionDetail } from "@/api/collection";
import { getCollectionProgress, getDueFlashcards } from "@/api/flashcard";
import LoadingPage from "@/views/error-pages/LoadingPage";
import MemoFlash from "@/components/cards/flashcard";
import OwnSet from "@/components/set-item/own-set";

function StudyFlashcard({ isPublic, isEditFC }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [flashcardsDue, setFlashcardsDue] = useState([]);
  const [progress, setProgress] = useState({ new: 0, learning: 0, due: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy chi tiết collection
        const data = user
          ? await getCollectionById(id)
          : await getPublicCollectionDetail(id);

        setCollection(data);

        if (user && (data.privacy === 1 || user.id === data.user_id)) {
          await postRecentCollection(data.id);
        }

        const flashcards = user
          ? await getDueFlashcards(id)
          : data.flashcards || [];
        setFlashcardsDue(flashcards);

        const progressData = await getCollectionProgress(id);
        setProgress(progressData);
      } catch (err) {
        console.error("Lỗi API:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, t, user]);

  // Trở lại giao diện loading hoặc thông báo lỗi nếu có
  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  const isAuthor = user && user.id === collection.user_id;

  // Hàm để cập nhật collection từ modal
  const handleUpdateCollection = (updatedCollection) => {
    setCollection((prevCollection) => ({
      ...prevCollection,
      ...updatedCollection,
    }));
  };

  return (
    <div className="std-detail-container">
      <OwnSet
        collection={collection}
        isAuthor={isAuthor}
        onUpdate={handleUpdateCollection}
      />

      <MemoFlash
        isStudy={true}
        flashcards={flashcardsDue}
        collectionId={collection.id}
        collectionTag={collection.tag}
        progress={progress}
        onUpdateProgress={setProgress}
      />
    </div>
  );
}

export default StudyFlashcard;
