import "./index.css";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import BtnBlue from "@/components/btn/btn-blue";

const DashboardCard = ({ collections, setCollections }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState("");

  //Tooltip
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
          <div className="dashboard_card_title">{collection.title}</div>

          <div className="dashboard_card_status">
            <Tooltip //new
              placement="bottomRight"
              title={t("tooltip.new_card")}
              arrow={mergedArrow}
            >
              <div className="dashboard_card_status_new">{collection.new}</div>
            </Tooltip>

            <Tooltip //learning
              placement="bottomRight"
              title={t("tooltip.learning_card")}
              arrow={mergedArrow}
            >
              <div className="dashboard_card_status_learn">
                {collection.learning}
              </div>
            </Tooltip>

            <Tooltip //due
              placement="bottomRight"
              title={t("tooltip.due_card")}
              arrow={mergedArrow}
            >
              <div className="dashboard_card_status_due">{collection.due}</div>
            </Tooltip>
          </div>

          <div className="dashboard_card_footer">
            {/* create by */}
            <div
              style={{
                fontStyle: "italic",
                fontSize: "16px",
                // fontWeight: "var(--header-weight-size)",
                alignContent: "center",
                flex: "1",
              }}
            >
              {collection.create_by}
            </div>

            <Link //study now
              to="/study_detail"
              className="dashboard_card_link"
              onClick={() => setActive("study_sets")}
            >
              <BtnBlue
                textKey="study_now"
                style={{
                  fontSize: "12px",
                  fontWeight: "var(--header-weight-size)",
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
