import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import BtnBlue from "@/components/btn/btn-blue";

const DashboardCard = ({ collection, setAuthor }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("");

  return (
    <div className="dashboard_card_container">
      <div className="dashboard_card_title">{collection.collection_name}</div>

      {setAuthor && (
        <div>
          <div className="dashboard_card_status">
            <Tooltip //new
              placement="bottomRight"
              title={t("tooltip.new_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_new">
                {collection.flashcard}
              </div>
            </Tooltip>

            <Tooltip //learning
              placement="bottomRight"
              title={t("tooltip.learning_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_learn">0</div>
            </Tooltip>

            <Tooltip //due
              placement="bottomRight"
              title={t("tooltip.due_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_due">0</div>
            </Tooltip>
          </div>
        </div>
      )}

      {setAuthor ? (
        <div className="dashboard_card_footer">
          <div
            className="set-item-collection-des"
            style={{
              flex: "1",
              fontSize: "16px",
            }}
          >
            {t("components.header.search_user1")}{" "}
            {collection.user?.role === "admin"
              ? "MemoTakara"
              : collection.user?.username ||
                t("components.header.search_user2")}
          </div>

          <Link
            to={`/public-study-set/${collection.id}`}
            className="dashboard_card_link"
            onClick={() => setActive("study_sets")}
            style={{ marginLeft: "auto" }} // Để nút nằm ở bên phải
          >
            <BtnBlue
              textKey="study_now"
              style={{
                fontSize: "12px",
                borderRadius: "15px",
              }}
            />
          </Link>
        </div>
      ) : (
        <div className="dashboard_card_footer">
          <Link
            to={`/public-study-set/${collection.id}`}
            className="dashboard_card_link"
            onClick={() => setActive("study_sets")}
            style={{ marginLeft: "auto" }} // Để nút nằm ở bên phải
          >
            <BtnBlue
              textKey="see-details"
              style={{
                fontSize: "12px",
                borderRadius: "15px",
              }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
