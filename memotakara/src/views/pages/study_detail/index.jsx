// public collection nhưng chưa sở hữu, chỉ được XEM thôi, KHÔNG có học
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { postRecentCollection } from "@/api/recentCollection";
import { getCollectionById, getPublicCollectionDetail } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";
import PublicSet from "@/components/set-item/public-set"; // Component hiển thị thông tin collection
import MemoCard from "@/components/cards/card"; // Component hiển thị thông tin flashcards
import MemoFlash from "@/components/cards/flashcard";

function StudyDetail({ isPublic, isEditFC }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        setLoading(true);
        const data = user
          ? await getCollectionById(id)
          : await getPublicCollectionDetail(id);
        setCollection(data);

        // Nếu là public hoặc là owner, thì lưu lịch sử
        if (user && (data.privacy === 1 || user.id === data.user_id)) {
          await postRecentCollection(data.id);
        }
      } catch (err) {
        console.error("Lỗi API:", err);
        setError(t("views.pages.study_detail.error-loading"));
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [id, t]);

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
      <PublicSet
        collection={collection}
        isPublic={isPublic}
        isAuthor={isAuthor}
        onUpdate={handleUpdateCollection}
      />

      <MemoFlash
        flashcards={collection.flashcards}
        collectionTag={collection.tag}
      />

      <div className="std-detail-flashcards-title">
        {t("views.pages.study_detail.flashcards-title")}
      </div>

      <MemoCard
        flashcards={collection.flashcards}
        collectionTag={collection.tag}
        isEditFC={isEditFC}
      />
    </div>
  );
}

export default StudyDetail;
