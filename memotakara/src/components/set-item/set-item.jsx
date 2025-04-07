import "./index.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

const SetItem = ({ collection, onDelete }) => {
  const { t } = useTranslation();

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
            style={{ fontSize: "20px", color: "var(--color-text-disabled)" }}
          >
            {collection.flashcards?.length || 0}{" "}
            {t("views.pages.study_detail.totalcard")}
          </div>
        </div>

        <div className="set-item-footer">
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={() => onDelete(collection.id)}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-error-button)",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SetItem;
