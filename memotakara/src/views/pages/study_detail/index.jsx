// public collection nhưng chưa sở hữu, chỉ được XEM thôi, KHÔNG có học
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getCollectionById } from "@/api/collection"; // API để lấy danh sách collection công khai
import LoadingPage from "@/views/error-pages/LoadingPage";
import PublicSet from "@/components/set-item/public-set"; // Component hiển thị thông tin collection
import MemoCard from "@/components/cards/card"; // Component hiển thị thông tin flashcards
import MemoFlash from "@/components/cards/flashcard";

function StudyDetail({ isPublic }) {
  const { t } = useTranslation();
  const { id } = useParams();
  console.log("param id: ", id);

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        setLoading(true);
        const data = await getCollectionById(id);
        console.log("data: ", data);
        setCollection(data);
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

  return (
    <div className="std-detail-container">
      <PublicSet collection={collection} />

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
        isPublic={isPublic} // Không cho phép học trong chế độ công khai
      />
    </div>
  );
}

export default StudyDetail;
