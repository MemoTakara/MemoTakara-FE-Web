import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPublicCollections } from "@/api/collection"; // Lấy thông tin về collection và tác giả
import { getFlashcardsByCollection } from "@/api/flashcard"; // Lấy thông tin flashcards -> tính tổng
import LoadingPage from "@/views/error-pages/LoadingPage";

const PublicSet = ({ collectionId }) => {
  const { t } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [collectionList, flashcardData] = await Promise.all([
          getPublicCollections(),
          getFlashcardsByCollection(collectionId),
        ]);

        const foundCollection = collectionList.find(
          (col) => col.id === collectionId
        );
        setCollection(foundCollection || null);
        setFlashcards(flashcardData);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionId]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>;
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>;
  }

  return (
    <div className="set-item-container">
      <div className="set-item-above">
        <div className="set-item-header">
          <div className="set-item-collection-name">
            {collection.collection_name}
          </div>

          <div className="set-item-collection-des">
            {t("components.header.search_user1")}{" "}
            {collection.user?.role === "admin"
              ? "MemoTakara"
              : collection.user?.username ||
                t("components.header.search_user2")}
          </div>

          <div className="set-item-collection-des">
            {t("views.pages.study_detail.collection-des")}{" "}
            {collection.description
              ? collection.description
              : t("views.pages.study_detail.no-description")}
          </div>
        </div>

        <div className="set-item-footer set-item-totalcard">
          {flashcards.length} {t("views.pages.study_detail.totalcard")}
        </div>
      </div>
    </div>
  );
};

export default PublicSet;
