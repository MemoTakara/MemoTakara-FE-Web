import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h1>{t("views.error-pages.notFound.title")}</h1>
      <p>{t("views.error-pages.notFound.des")}</p>
      <a href="/">{t("views.error-pages.notFound.back_home")}</a>
    </div>
  );
};

export default NotFound;
