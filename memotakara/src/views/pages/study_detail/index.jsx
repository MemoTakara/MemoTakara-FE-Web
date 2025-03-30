import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getCollectionDetail } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";
import PublicSet from "@/components/set-item/public-set";
import MemoCard from "@/components/cards/card";

function StudyDetail() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        // Giả sử getCollectionDetail trả về mảng collection
        const data = await getCollectionDetail(); // Dữ liệu toàn bộ
        const selectedCollection = data.find((col) => col.id === parseInt(id)); // Tìm collection theo ID
        setCollection(selectedCollection);
      } catch (err) {
        console.error("Lỗi khi lấy chi tiết collection:", err);
        setError("Không thể tải thông tin collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [id]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  return (
    <div className="std-detail-container">
      <PublicSet collectionId={collection.id} />
      <MemoCard collectionId={collection.id} />
    </div>
  );
}

export default StudyDetail;
