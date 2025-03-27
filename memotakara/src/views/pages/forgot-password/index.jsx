import "./index.css";
import { useTranslation } from "react-i18next";
import { Form, Input } from "antd";
import { Link } from "react-router-dom";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

function ForgotPassword() {
  const { t } = useTranslation();
  const handleForgotPass = {};

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
            label={t("views.pages.forgot-password.des1")}
            name="email"
            rules={[
              { type: "email", message: t("views.pages.login.email_invalid") },
              {
                required: true,
                message: t("views.pages.login.email_required"),
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input placeholder={t("views.pages.login.email_placeholder")} />
          </Form.Item>

          {/* code */}
          <Form.Item
            layout="vertical"
            label={t("views.pages.forgot-password.enter_code")}
            hasFeedback
            // validateStatus="success"
            rules={[
              {
                required: true,
                message: t("views.pages.forgot-password.code_required"),
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input.OTP />
          </Form.Item>

          {/* resend */}
          <Form.Item>
            <div className="forgot-resend-code">
              {t("views.pages.forgot-password.resend_code")}
            </div>
          </Form.Item>

          {/* continue */}
          <Form.Item>
            <Link to="/reset-password">
              <BtnBlue
                textKey="continue"
                style={{
                  width: "400px",
                  fontSize: "var(--header-size)",
                  fontWeight: "var(--header-weight-size)",
                  borderRadius: "var(--button-border-radius)",
                }}
              />
            </Link>
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
