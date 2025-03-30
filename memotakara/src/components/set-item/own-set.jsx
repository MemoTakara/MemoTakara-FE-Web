// set while study
import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faCodePullRequest,
  faRepeat,
  faBook,
} from "@fortawesome/free-solid-svg-icons";
import { getCollectionDetail } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

const OwnSet = ({ collectionId }) => {
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
            {t("views.pages.study_detail.collection-des")}
            {collection.description ||
              t("views.pages.study_detail.no-description")}
          </div>
        </div>

        {/* tổng số flashcard */}
        <div className="set-item-footer set-item-totalcard">
          {collection.flashcards ? collection.flashcards.length : 0}{" "}
          {t("views.pages.study_detail.totalcard")}
        </div>
      </div>

      {/* line */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "#00000080",
          margin: "15px 0",
        }}
      ></div>

      <div className="set-item-bottom">
        <Link to={`/study_detail/${collection.id}`} className="set-item-link">
          <FontAwesomeIcon
            icon={faPencil}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.edit-icon")}
        </Link>

        <Link to={`/study_detail/${collection.id}`} className="set-item-link">
          <FontAwesomeIcon
            icon={faCodePullRequest}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.merge-icon")}
        </Link>
        <Link to={`/study_detail/${collection.id}`} className="set-item-link">
          <FontAwesomeIcon
            icon={faRepeat}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.flashcard-icon")}
        </Link>

        <Link to={`/study_detail/${collection.id}`} className="set-item-link">
          <FontAwesomeIcon
            icon={faBook}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.test-icon")}
        </Link>
      </div>
    </div>
  );
};

export default OwnSet;
