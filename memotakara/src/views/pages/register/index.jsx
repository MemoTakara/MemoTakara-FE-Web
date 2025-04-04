import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Form, Input, Checkbox, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    const key = "registerMessage";
    try {
      await register(
        values.username,
        values.email,
        values.password,
        values.password_confirmation
      );
      messageApi.success({
        content: t("views.pages.register.noti_success"),
        key,
        duration: 2,
      });
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      messageApi.error({
        content:
          error.response?.data?.message || t("views.pages.register.noti_error"),
        key,
        duration: 2,
      });
    }
  };

  return (
    <div className="register_container">
      <div className="register_header">{t("views.pages.register.header")}</div>
      <div className="register_form">
        <Form
          layout="horizontal"
          style={{
            width: 400,
          }}
          onFinish={handleRegister}
        >
          {/* email */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.register.email_placeholder")}
            name="email"
            rules={[
              {
                type: "email",
                message: t("views.pages.register.email_invalid"),
              },
              {
                required: true,
                message: t("views.pages.register.email_required"),
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input />
          </Form.Item>

          {/* username */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.register.username_placeholder")}
            name="username"
            rules={[
              {
                required: true,
                message: t("views.pages.register.username_required"),
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input />
          </Form.Item>

          {/* pass */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.register.password_placeholder")}
            name="password"
            style={{ height: "60px" }}
            rules={[
              {
                required: true,
                message: t("views.pages.register.password_required"),
              },
              {
                min: 8, // Độ dài tối thiểu
                message: t("views.pages.register.password_min_length", {
                  length: 8,
                }), // Thông báo khi không đủ 8 ký tự
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* re-enter pass */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.register.password_confirm_placeholder")}
            name="password_confirmation"
            style={{ height: "60px" }}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("views.pages.register.password_confirm_required"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      t("views.pages.register.password_confirm_invalid")
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* checkbox */}
          {/* <Form.Item style={{ textAlign: "center" }}>
            <Checkbox style={{ fontSize: "16px" }}>
              I agree to{" "}
              <span
                style={{
                  fontWeight: "var(--header-weight-size)",
                  textDecoration: "underline",
                }}
              >
                Terms of Service
              </span>{" "}
              and{" "}
              <span
                style={{
                  fontWeight: "var(--header-weight-size)",
                  textDecoration: "underline",
                }}
              >
                Privacy Policy.
              </span>
            </Checkbox>
          </Form.Item> */}

          {/* sign up */}
          <Form.Item style={{ textAlign: "center" }}>
            {contextHolder}
            <BtnBlue
              textKey="register"
              style={{
                width: "400px",
                fontSize: "var(--body-size)",
                fontWeight: "var(--header-weight-size)",
                borderRadius: "var(--button-border-radius)",
              }}
            />
          </Form.Item>
        </Form>
      </div>

      {/* another option: copy login page */}
      <div>
        <div
          style={{
            fontWeight: "var(--header-weight-size)",
            fontSize: "var(--body-size)",
            textAlign: "center",
          }}
        >
          {t("views.pages.register.or")}
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
        />
      </div>

      {/* login */}
      <div className="switch_to_login" style={{ fontSize: "18px" }}>
        {t("views.pages.register.login")}
        <span>
          <Link
            className="register_link"
            to="/login"
            style={{ textDecoration: "underline" }}
          >
            {t("views.pages.register.login_now")}
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
