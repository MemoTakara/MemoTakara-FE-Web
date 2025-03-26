import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import logo from "@/assets/img/logo.png";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Form, message, Input } from "antd";
import { GithubFilled, LinkedinFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import BtnBlue from "@/components/btn/btn-blue";

function Footer() {
  const { t } = useTranslation();
  const [active, setActive] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  //Disable button
  const onFieldsChange = (_, allFields) => {
    // Kiểm tra nếu email hợp lệ thì kích hoạt nút submit
    const isValid = allFields.every(
      (field) => field.errors.length === 0 && field.value
    );
    setIsDisabled(!isValid);
  };

  //Send email notification
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";
  const sendEmail = () => {
    messageApi.open({
      key,
      type: "success",
      content: t("components.footer.msg_success"),
      duration: 2,
    });
  };

  return (
    <div class="footer_container">
      <div className="footer_cols">
        <Link
          to="/dashboard"
          className="footer_link"
          onClick={() => setActive("dashboard")}
        >
          <div className="footer_logo">
            <img loading="lazy" src={logo} alt="logo" class="img" />
            <div class="footer_name">MemoTakara</div>
          </div>
        </Link>

        <div className="footer_email">
          <div
            style={{
              width: "380px",
              fontSize: "20px",
              fontWeight: "var(--header-weight-size)",
              marginBottom: "20px",
              wordWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {t("components.footer.send_email_msg")}
          </div>

          <Form
            className="footer_email_send"
            autoComplete="on"
            onFinish={sendEmail}
            onFieldsChange={onFieldsChange}
          >
            <Form.Item
              name="email"
              rules={[
                { type: "email", message: t("components.footer.msg_invalid") },
                {
                  required: true,
                  message: t("components.footer.msg_required"),
                },
              ]}
            >
              <Input
                style={{
                  width: "200px",
                  fontWeight: "545",
                  padding: "5.5px",
                  border: "2px solid var(--color-light-button)",
                  marginRight: "15px",
                }}
                placeholder={t("components.footer.email_placeholder")}
              />
            </Form.Item>

            <Form.Item style={{ fontWeight: "var(--header-weight-size)" }}>
              {contextHolder}
              <BtnBlue
                textKey="subscribe"
                type="submit"
                htmlType="submit"
                disabled={isDisabled}
              />
            </Form.Item>
          </Form>
        </div>

        <div className="footer_support">
          <div
            style={{
              fontSize: "20px",
              textDecoration: "underline",
              fontWeight: "var(--header-weight-size)",
            }}
          >
            {t("components.footer.support")}
          </div>
          <Link className="footer_link">{t("components.footer.about_us")}</Link>
          <Link className="footer_link">
            {t("components.footer.terms_of_condition")}
          </Link>
          <Link className="footer_link">{t("components.footer.help")}</Link>
        </div>
      </div>

      <div class="footer_bottom_row">
        {/* line */}
        <div
          style={{ width: "550px", height: "1px", background: "#000" }}
        ></div>

        <div className="footer_copyright">
          © Copyright{" "}
          <span style={{ fontStyle: "italic" }}>Dinh Thi Hong Phuc</span> 2025
        </div>

        <div className="footer_contact">
          {/* google */}
          <a href="mailto:phuchong292003@gmail.com">
            <img
              src={google_icon}
              alt="Google Icon"
              style={{
                width: "20px",
                height: "24px",
                paddingTop: "4px",
              }}
            />
          </a>

          {/* facebook */}
          <a
            href="https://www.facebook.com/cuhp293"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              style={{
                fontSize: "20px",
                color: "#1877F2",
                paddingLeft: "15px",
                paddingRight: "12px",
              }}
              icon={faFacebook}
            />
          </a>

          {/* github */}
          <a
            href="https://github.com/MemoTakara"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GithubFilled
              style={{
                fontSize: "22px",
                color: "#000",
              }}
            />
          </a>

          {/* LinkedIn */}
          <a
            href="https://www.linkedin.com/in/%C4%91inh-th%E1%BB%8B-h%E1%BB%93ng-ph%C3%BAc-1a922a216/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkedinFilled
              style={{
                fontSize: "22px",
                color: "#2867B2",
                paddingLeft: "12px",
              }}
            />
          </a>
        </div>

        {/* line */}
        <div
          style={{ width: "550px", height: "1px", background: "#000" }}
        ></div>
      </div>
    </div>
  );
}

export default Footer;
