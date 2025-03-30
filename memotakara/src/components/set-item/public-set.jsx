import "./index.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPublicCollections } from "@/api/collection";
import LoadingPage from "@/views/error-pages/LoadingPage";

const PublicSet = ({ collectionId }) => {
  const { t } = useTranslation();
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      const data = await getPublicCollections();
      setCollection(data);
    };

    fetchCollections();
  }, []);

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

        <div className="set-item-footer set-item-totalcard">
          {collection.flashcards ? collection.flashcards.length : 0}{" "}
          {t("views.pages.study_detail.totalcard")}
        </div>
      </div>
    </div>
  );
};

export default PublicSet;
