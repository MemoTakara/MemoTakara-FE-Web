import "./index.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { forgotPassword } from "@/api/user";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

function ForgotPassword() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [waitTime, setWaitTime] = useState(0);
  const [messageApi, contextHolder] = message.useMessage();

  const handleForgotPass = async (values) => {
    setLoading(true);
    setWaitTime(0);
    try {
      // Gửi yêu cầu gửi email reset mật khẩu
      await forgotPassword(values.email);
      messageApi.success(t("views.pages.forgot-password.noti_success"));
      setWaitTime(60);

      const countdown = setInterval(() => {
        setWaitTime((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.error ||
        error.message ||
        t("views.pages.forgot-password.noti_error");
      messageApi.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-wrap">
        <div className="forgot-header">
          {t("views.pages.forgot-password.header")}
        </div>

        <Form
          className="forgot-form"
          style={{
            width: 400,
          }}
          onFinish={handleForgotPass}
        >
          {/* email */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.forgot-password.des")}
            name="email"
            rules={[
              {
                type: "email",
                messageApi: t("views.pages.login.email_invalid"),
              },
              {
                required: true,
                messageApi: t("views.pages.login.email_required"),
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input placeholder={t("views.pages.login.email_placeholder")} />
          </Form.Item>

          {waitTime > 0 && (
            <div
              style={{
                color: "red",
                textAlign: "right",
                marginBottom: "3%",
              }}
            >
              {t("views.pages.forgot-password.wait_for")} {waitTime}
              {t("s")}
            </div>
          )}

          {/* continue */}
          <Form.Item>
            <BtnBlue
              textKey="continue"
              style={{
                width: "400px",
                fontSize: "var(--body-size)",
                fontWeight: "var(--header-weight-size)",
                borderRadius: "var(--button-border-radius)",
              }}
              disabled={loading || waitTime > 0}
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
}

export default ForgotPassword;
