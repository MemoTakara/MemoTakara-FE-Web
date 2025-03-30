// set in folder
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { getCollectionDetail } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

const SetItem = ({ collectionId }) => {
  const { t } = useTranslation();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        setLoading(true);
        const collectionList = await getCollectionDetail(collectionId);

        // Kiểm tra nếu API trả về mảng
        if (Array.isArray(collectionList)) {
          // Tìm collection theo ID
          const foundCollection = collectionList.find(
            (col) => col.id === collectionId
          );
          setCollection(foundCollection || null);
        } else {
          setCollection(collectionList); // Trường hợp API trả về object
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionDetail();
  }, [collectionId]);

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
            to={`/study_detail/${collection.id}`}
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
