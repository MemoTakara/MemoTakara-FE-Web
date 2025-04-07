import "./index.css";
import { useTranslation } from "react-i18next";

const PublicSet = ({ collection }) => {
  const { t } = useTranslation();

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
          {collection.flashcards?.length || 0}{" "}
          {t("views.pages.study_detail.totalcard")}
        </div>
      </div>
    </div>
  );
};

export default PublicSet;
