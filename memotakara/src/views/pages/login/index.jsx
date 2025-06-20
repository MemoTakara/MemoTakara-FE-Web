import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Checkbox, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

function Login() {
  const { t } = useTranslation();
  const { login, user, getGoogleRedirect } = useAuth(); // Lấy hàm login từ context
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, [user, navigate]);

  const handleLogin = async (values) => {
    const key = "loginMessage";
    try {
      await login(values.email, values.password);
      messageApi.success({
        content: t("views.pages.login.noti_success"),
        key,
        duration: 2,
      });
    } catch (error) {
      let errorMessage;
      switch (error.response?.data?.message) {
        case "Email not found":
          errorMessage = t("views.pages.login.noti_error1");
          break;
        case "Invalid password":
          errorMessage = t("views.pages.login.noti_error2");
          break;
        case "User account not active":
          errorMessage = t("views.pages.login.noti_error3");
          break;
        default:
          errorMessage = t("views.pages.login.noti_error");
          break;
      }
      messageApi.error({
        content: errorMessage,
        key,
        duration: 2,
      });
    }
  };

  const googleRedirect = async () => {
    const key = "loginMessage";
    try {
      const response = await getGoogleRedirect();
      window.location.href = response;
      console.log("Login: Get Google redirects successfully!");
    } catch {
      let errorMessage;
      switch (error.response?.data?.message) {
        case "User account not active":
          errorMessage = t("views.pages.login.noti_error3");
          break;
        default:
          errorMessage = t("views.pages.login.noti_error");
          break;
      }
      messageApi.error({
        content: errorMessage,
        key,
        duration: 2,
      });
      console.error("Login: Error get Google redirect");
    }
  };

  return (
    <div className="login_container">
      <div className="login_header">{t("views.pages.login.header")}</div>

      <Form
        name="normal_login"
        className="login_form"
        initialValues={{
          remember: true,
        }}
        style={{
          width: 400,
        }}
        onFinish={handleLogin}
      >
        {/* email */}
        <Form.Item
          layout="vertical"
          label={t("views.pages.login.email_placeholder")}
          name="email"
          rules={[
            { type: "email", message: t("views.pages.login.email_invalid") },
            { required: true, message: t("views.pages.login.email_required") },
          ]}
          style={{ height: "60px" }}
        >
          <Input placeholder={t("views.pages.login.email_placeholder")} />
        </Form.Item>

        {/* pass */}
        <Form.Item
          layout="vertical"
          label={t("views.pages.login.password_placeholder")}
          name="password"
          rules={[
            {
              required: true,
              message: t("views.pages.login.password_required"),
            },
          ]}
          style={{ height: "60px" }}
        >
          <Input.Password
            type="password"
            placeholder={t("views.pages.login.password_placeholder")}
          />
        </Form.Item>

        {/* checkbox - forgot pass*/}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ fontSize: "var(--normal-font-size)" }}>
              {t("views.pages.login.remember_me")}
            </Checkbox>
          </Form.Item>

          <Link className="login_form_forgot" to="/forgot_password">
            {t("views.pages.login.forgot_password")}
          </Link>
        </Form.Item>

        {/* login */}
        <Form.Item>
          {contextHolder}
          <BtnBlue
            textKey="login"
            style={{
              width: "400px",
              fontSize: "var(--body-size)",
              fontWeight: "var(--header-weight-size)",
              borderRadius: "var(--button-border-radius)",
            }}
          />
        </Form.Item>
      </Form>

      {/* another option */}
      <div>
        <div
          style={{
            fontWeight: "var(--header-weight-size)",
            fontSize: "var(--body-size)",
            textAlign: "center",
          }}
        >
          {t("views.pages.login.or")}
        </div>
        <BtnWhite
          textKey="login_with_google"
          style={{
            width: "400px",
            fontSize: "var(--body-size)",
            margin: "15px",
          }}
          iconSrc={google_icon}
          iconAlt="Google icon"
          onClick={googleRedirect}
        />
      </div>

      {/* sign up */}
      <div className="switch_to_register" style={{ fontSize: "18px" }}>
        {t("views.pages.login.register")}
        <span>
          <Link
            className="login_link"
            to="/register"
            style={{ textDecoration: "underline" }}
          >
            {t("views.pages.login.register_now")}
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
