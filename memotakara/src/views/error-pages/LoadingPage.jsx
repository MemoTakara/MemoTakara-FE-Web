import { Spin } from "antd";
import { useTranslation } from "react-i18next";

const LoadingPage = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h2>
        <Spin /> {t("views.error-pages.loadingPage.title")}
      </h2>
    </div>
  );
};

export default LoadingPage;
