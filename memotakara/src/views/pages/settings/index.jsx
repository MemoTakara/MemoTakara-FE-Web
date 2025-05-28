import "./index.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { changePassword } from "@/api/admin";
import { updateAccount, unlinkGoogleAccount } from "@/api/user";
import BtnBlue from "@/components/btn/btn-blue";

function Settings() {
  const { t } = useTranslation();
  const { user, logout, getGoogleRedirect } = useAuth();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [accountForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.username || "",
    email: user?.email || "",
    googleConnected: user?.google_id !== null,
    oldPassword: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  //Update account button
  const handleAccountUpdate = async () => {
    try {
      const response = await updateAccount({
        name: formData.name,
        username: formData.username,
        email: formData.email,
      });
      messageApi.success(
        response.message || t("components.edit-collection.update-success")
      );
    } catch (error) {
      if (error.errors?.username?.length) {
        messageApi.error(error.errors.username[0]);
      } else {
        messageApi.error(t("components.edit-collection.update-error"));
      }
    }
  };

  // Link Google
  const googleRedirect = async () => {
    try {
      const response = await getGoogleRedirect();
      window.location.href = response;
      console.log("Link: Get Google redirects successfully!");
    } catch {
      messageApi.error({
        content: t("views.pages.settings.link-error"),
        duration: 2,
      });
      console.error("Login: Error get Google redirect");
    }
  };

  // Unlink google
  const handleUnlinkGoogle = async () => {
    try {
      await unlinkGoogleAccount();
      messageApi.success(t("views.pages.settings.unlink-success"));
      setFormData((prev) => ({ ...prev, googleConnected: false }));
    } catch (error) {
      messageApi.error(t("views.pages.settings.unlink-error"));
    }
  };

  // Update password button
  const handlePassUpdate = async () => {
    try {
      const response = await changePassword(
        formData.oldPassword,
        formData.newPassword
      );
      messageApi.success(
        response.message || t("components.edit-collection.update_success")
      );
      passwordForm.resetFields();
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        newPasswordConfirmation: "",
      }));
    } catch (error) {
      let errorMsg;
      switch (error.message) {
        case "The password is incorrect.":
          errorMsg = t("views.pages.settings.current-pass-error");
          break;
        case "Same pass.":
          errorMsg = t("views.pages.settings.pass-error");
          break;
        default:
          errorMsg = t("views.pages.forgot-password.reset-error");
          break;
      }
      messageApi.error({
        content: errorMsg,
        duration: 2,
      });
    }
  };

  //Log out
  const handleLogout = async () => {
    await logout(); // Đăng xuất
    navigate("/login");
  };

  return (
    <div className="setting_container">
      <div className="setting-sidebar">
        <div className="setting-title">{t("views.pages.settings.setting")}</div>
        {["account", "password", "notifications", "appearance"].map((item) => (
          <button
            key={item}
            className="setting-sidebar-item"
            onClick={() =>
              document.getElementById(`setting-${item}`).scrollIntoView()
            }
          >
            {t(`views.pages.settings.${item}`)}
          </button>
        ))}
      </div>

      <div className="setting-content">
        <Button
          type="primary"
          htmlType="submit"
          id="setting-btn-signout"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          {t("buttons.logout")}
        </Button>

        {contextHolder}

        <div className="setting-item" id="setting-account">
          <div className="setting-item-title">
            <div className="setting-item-title-text">
              {t("views.pages.settings.account")}
            </div>
            <BtnBlue textKey="save" onClick={handleAccountUpdate} />
          </div>

          <Form
            form={accountForm}
            layout="horizontal"
            onFinish={handleAccountUpdate}
          >
            <Form.Item
              label={t("views.pages.settings.name_placeholder")}
              name="name"
              style={{ height: "50px" }}
              initialValue={formData.name}
            >
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label={t("views.pages.register.username_placeholder")}
              name="username"
              style={{ height: "50px" }}
              rules={[
                {
                  pattern: /^[a-zA-Z0-9_]+$/,
                  message: t("views.pages.register.username_invalid"),
                },
              ]}
              initialValue={formData.username}
            >
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              layout=""
              label={t("views.pages.settings.email-holder")}
              name="email"
              style={{ height: "50px" }}
              rules={[
                {
                  type: "email",
                  message: t("views.pages.register.email_invalid"),
                },
              ]}
              initialValue={formData.email}
            >
              {formData.googleConnected ? (
                <div className="setting-email">
                  <Input
                    value={formData.email}
                    disabled
                    style={{ flex: 1, marginRight: "2%" }}
                  />
                  <Button danger onClick={handleUnlinkGoogle}>
                    {t("buttons.unlink-google")}
                  </Button>
                </div>
              ) : (
                <div className="setting-email">
                  <Input
                    value={formData.email}
                    style={{ flex: 1, marginRight: "2%" }}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  <BtnBlue textKey="link-google" onClick={googleRedirect} />
                </div>
              )}
            </Form.Item>
          </Form>

          {/* <div className="setting-email">
            <div>Delete</div>
            <Button danger onClick={handleUnlinkGoogle}>
              Xóa
            </Button>
          </div> */}
        </div>

        <div className="setting-item" id="setting-password">
          <div className="setting-item-title">
            <div className="setting-item-title-text">
              {t("views.pages.settings.password")}
            </div>
            <BtnBlue textKey="save" onClick={handlePassUpdate} />
          </div>

          <Form
            form={passwordForm}
            layout="horizontal"
            onFinish={handlePassUpdate}
          >
            <Form.Item
              label={t("views.pages.register.password_placeholder")}
              name="oldPassword"
              rules={[
                {
                  required: true,
                  message: t("views.pages.register.password_required"),
                },
              ]}
            >
              <Input.Password
                value={formData.oldPassword}
                onChange={(e) =>
                  handleInputChange("oldPassword", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label={t("views.pages.settings.new-pass-placeholder")}
              name="newPassword"
              rules={[
                {
                  required: true,
                  message: t("views.pages.register.password_required"),
                },
                {
                  min: 8,
                  message: t("views.pages.register.password_min_length", {
                    length: 8,
                  }),
                },
              ]}
            >
              <Input.Password
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange("newPassword", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label={t("views.pages.register.password_confirm_placeholder")}
              name="newPasswordConfirmation"
              hasFeedback
              rules={[
                {
                  required: true,
                  message: t("views.pages.register.password_confirm_required"),
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      !value ||
                      passwordForm.getFieldValue("newPassword") === value
                    ) {
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
              <Input.Password
                value={formData.newPasswordConfirmation}
                onChange={(e) =>
                  handleInputChange("newPasswordConfirmation", e.target.value)
                }
              />
            </Form.Item>
          </Form>
        </div>

        <div className="setting-item" id="setting-notifications">
          <div className="setting-item-title">
            <div className="setting-item-title-text">
              {t("views.pages.settings.notifications")}
            </div>
            <BtnBlue textKey="save" />
          </div>
        </div>

        <div className="setting-item" id="setting-appearance">
          <div className="setting-item-title">
            <div className="setting-item-title-text">
              {t("views.pages.settings.appearance")}
            </div>
            <BtnBlue textKey="save" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
