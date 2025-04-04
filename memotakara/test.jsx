import "./index.css";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import BtnBlue from "@/components/btn/btn-blue";

const DashboardCard = ({ collections }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("");

  // Tooltip
  const [arrow, setArrow] = useState("Show");
  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  return (
    <div>
      {collections.map((collection) => (
        <div key={collection.id} className="dashboard_card_container">
          <div className="dashboard_card_title">
            {collection.collection_name}
          </div>

          <div className="dashboard_card_status">
            {collection.flashcards && collection.flashcards.length > 0 && (
              <Tooltip
                placement="bottomRight"
                title={t("tooltip.flashcard_status")}
                arrow={mergedArrow}
              >
                <div className="dashboard_card_status_flashcard">
                  {collection.flashcards.length} Flashcards
                </div>
              </Tooltip>
            )}
          </div>

          <div className="dashboard_card_footer">
            {/* created by */}
            <div
              style={{
                fontStyle: "italic",
                fontSize: "16px",
                alignContent: "center",
                flex: "1",
              }}
            >
              {collection.created_by}{" "}
              {/* Thay đổi thành thuộc tính phù hợp với dữ liệu collection */}
            </div>
            <Link // Study now
              to={`/study_detail/${collection.id}`} // Chuyến đến chi tiết học tập của collection
              className="dashboard_card_link"
              onClick={() => setActive("study_sets")}
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
        </div>
      ))}
    </div>
  );
};

export default DashboardCard;
