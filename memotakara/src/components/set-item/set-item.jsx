// set in folder (list of own-set)
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getOwnCollections } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

const SetItem = ({ collectionId }) => {
  const { t } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        setLoading(true);
        const collections = await getOwnCollections();
        setCollection(
          collections.find((col) => col.id === collectionId) || null
        );
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu collection:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId, t]);

  if (loading) return <LoadingPage />;
  if (error) return <div>{error}</div>; // Hiển thị lỗi nếu có
  if (!collection) {
    return <div>{t("views.pages.study_detail.no-collection-data")}</div>; // Kiểm tra nếu không tìm thấy collection
  }

  return (
    <div className="set-item-container">
      <div className="set-item-above">
        <div className="set-item-header">
          <Link
            className="set-item-collection-name"
            to={`/public-study-set/${collection.id}`}
          >
            {collection.collection_name}
          </Link>

          <div
            style={{
              fontSize: "20px",
              color: "var(--color-text-disabled)",
            }}
          >
            {collection.flashcards ? collection.flashcards.length : 0}{" "}
            {t("views.pages.study_detail.totalcard")}
          </div>
        </div>

        <div className="set-item-footer">
          <FontAwesomeIcon
            icon={faTrashCan}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-error-button)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SetItem;
