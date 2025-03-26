import { useTranslation } from "react-i18next";

const NotAuthorized = () => {
  const { t } = useTranslation();
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
      }}
    >
      <h1>{t("views.error-pages.notAuthorized.title")}</h1>
      <p>
        {t("views.error-pages.notAuthorized.des1")} <br />
        {t("views.error-pages.notAuthorized.des2")}
      </p>
      <a href="/">{t("views.error-pages.notAuthorized.back_home")}</a>
    </div>
  );
};

export default NotAuthorized;
