// public collection nhưng chưa sở hữu, chỉ được XEM thôi, KHÔNG có học
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getPublicCollections } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";
import PublicSet from "@/components/set-item/public-set";
import MemoCard from "@/components/cards/card";

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
        const data = await getPublicCollections();
        console.log("Dữ liệu nhận được:", data);

        const selectedCollection = data.find((col) => String(col.id) === id);

        if (!selectedCollection) {
          setError(t("views.pages.study_detail.no-collection-data"));
          return;
        }

        setCollection(selectedCollection);
      } catch (err) {
        console.error("Lỗi API:", err);
        setError("Không thể tải thông tin collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [id, t]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  return (
    <div className="std-detail-container">
      <PublicSet collectionId={collection.id} />
      <MemoCard
        collectionId={collection.id}
        collectionTag={collection.tag}
        isPublic={isPublic}
      />
    </div>
  );
}

export default StudyDetail;
