import "./index.css";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { getCollectionProgress } from "@/api/flashcard";
import BtnBlue from "@/components/btn/btn-blue";

const DashboardCard = ({ collection, setAuthor }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState({ new: 0, learning: 0, due: 0 });

  useEffect(() => {
    if (!setAuthor) return;

    const fetchProgress = async () => {
      try {
        const data = await getCollectionProgress(collection.id);
        setProgress(data);
      } catch (err) {
        console.error("Lỗi khi lấy tiến độ:", err);
      }
    };

    fetchProgress();
  }, [collection.id, setAuthor]);

  return (
    <div className="dashboard_card_container">
      <div className="dashboard_card_title">{collection.collection_name}</div>

      {setAuthor && (
        <div>
          <div className="dashboard_card_status">
            <Tooltip // new
              placement="bottomRight"
              title={t("tooltip.new_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_new">{progress.new}</div>
            </Tooltip>

            <Tooltip // learning
              placement="bottomRight"
              title={t("tooltip.learning_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_learn">
                {progress.learning}
              </div>
            </Tooltip>

            <Tooltip // due
              placement="bottomRight"
              title={t("tooltip.due_card")}
              arrow={true}
            >
              <div className="dashboard_card_status_due">{progress.due}</div>
            </Tooltip>
          </div>
        </div>
      )}

      {setAuthor ? (
        <div className="dashboard_card_footer">
          <div className="set-item-collection-des">
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
                fontSize: "var(--small-size)",
                borderRadius: "var(--small-btn-radius)",
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
                fontSize: "var(--small-size)",
                borderRadius: "var(--small-btn-radius)",
              }}
            />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DashboardCard;
