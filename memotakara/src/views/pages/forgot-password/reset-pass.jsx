import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/api/user";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleResetPass = async (values) => {
    setLoading(true);
    try {
      const response = await resetPassword(token, email, values.password);
      messageApi.success(
        response.message || t("views.pages.forgot-password.reset-success")
      );
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      const errorMessage =
        err.error ||
        err.message ||
        t("views.pages.forgot-password.reset-error");
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-wrap">
        <div className="forgot-header">
          {t("views.pages.forgot-password.reset")}
        </div>

        <Form
          className="forgot-form"
          style={{
            width: 400,
          }}
          onFinish={handleResetPass}
        >
          {/* new pass */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.settings.new-pass-placeholder")}
            name="password"
            style={{ height: "60px" }}
            rules={[
              {
                required: true,
                messageApi: t("views.pages.register.password_required"),
              },
              {
                min: 8,
                messageApi: t("views.pages.register.password_min_length", {
                  length: 8,
                }),
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* re-enter pass */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.register.password_confirm_placeholder")}
            name="password_confirmation"
            style={{ height: "60px" }}
            hasFeedback
            rules={[
              {
                required: true,
                messageApi: t("views.pages.register.password_confirm_required"),
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

          <Form.Item>
            {contextHolder}
            <BtnBlue
              textKey="continue"
              style={{
                width: "400px",
                fontSize: "var(--body-size)",
                fontWeight: "var(--header-weight-size)",
                borderRadius: "var(--button-border-radius)",
              }}
              disabled={loading}
              htmlType="submit"
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
          <Link
            to="/login"
            style={{
              textDecoration: "none",
              color: "#000",
            }}
          >
            <BtnWhite
              textKey="back_to_login"
              style={{
                width: "400px",
                fontSize: "var(--body-size)",
                marginTop: "15px",
              }}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
