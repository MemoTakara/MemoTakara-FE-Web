// public collection nhưng chưa sở hữu, chỉ được XEM thôi, KHÔNG có học
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getPublicCollections } from "@/api/collection"; // API để lấy danh sách collection công khai
import LoadingPage from "@/views/error-pages/LoadingPage";
import PublicSet from "@/components/set-item/public-set"; // Component hiển thị thông tin collection
import MemoCard from "@/components/cards/card"; // Component hiển thị thông tin flashcards

function StudyDetail({ isPublic }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        setLoading(true);
        const data = await getPublicCollections(); // Lấy danh sách các collection công khai

        // Tìm collection theo ID từ params
        const selectedCollection = data.find((col) => String(col.id) === id);

        if (!selectedCollection) {
          setError(t("views.pages.study_detail.no-collection-data"));
          return;
        }

        setCollection(selectedCollection); // Lưu thông tin collection vào state
      } catch (err) {
        console.error("Lỗi API:", err);
        setError(t("views.pages.study_detail.error-loading")); // Thông báo lỗi
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
      {/* Hiển thị thông tin collection */}
      <PublicSet collectionId={collection.id} />
      {/* Hiển thị danh sách flashcards nếu có */}
      <MemoCard
        flashcards={collection.flashcards}
        collectionTag={collection.tag}
        isPublic={isPublic} // Không cho phép học trong chế độ công khai
      />
    </div>
  );
}

export default StudyDetail;
