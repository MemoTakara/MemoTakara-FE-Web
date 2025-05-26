import { useEffect } from "react";
import { Spin } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const GooglePage = () => {
  const { t } = useTranslation();
  const { updateToken, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    updateToken(token);

    if (user) {
      setTimeout(() => {
        // Kiểm tra vai trò và điều hướng
        if (user?.role === "user") {
          navigate("/dashboard");
        } else if (user?.role === "admin") {
          navigate("/users");
        }
      }, 2000);
    }
  }, [updateToken, user, navigate]);

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

export default GooglePage;
