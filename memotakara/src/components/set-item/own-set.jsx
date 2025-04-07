// set while study
import "./index.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faCodePullRequest,
  faRepeat,
  faKeyboard,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

const OwnSet = ({ collection }) => {
  const { t } = useTranslation();

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

          {/* <div className="set-item-collection-des">
            {t("components.header.search_user1")}{" "}
            {collection.user?.role === "admin"
              ? "MemoTakara"
              : collection.user?.username ||
                t("components.header.search_user2")}
          </div> */}

          <div className="set-item-collection-des">
            {t("views.pages.study_detail.collection-des")}{" "}
            {collection.description
              ? collection.description
              : t("views.pages.study_detail.no-description")}
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
        <Link
          to={`/public-study-set/${collection.id}`}
          className="set-item-link"
        >
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

        <Link
          to={`/public-study-set/${collection.id}`}
          className="set-item-link"
        >
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

        <Link
          to={`/public-study-set/${collection.id}`}
          className="set-item-link"
        >
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

        <Link
          to={`/public-study-set/${collection.id}`}
          className="set-item-link"
        >
          <FontAwesomeIcon
            icon={faKeyboard}
            style={{
              fontSize: "var(--body-size-max)",
              color: "var(--color-light-button)",
              marginBottom: "5px",
            }}
          />
          {t("views.pages.study_sets.typing-icon")}
        </Link>

        <Link
          to={`/public-study-set/${collection.id}`}
          className="set-item-link"
        >
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
