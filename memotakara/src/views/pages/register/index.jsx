import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Checkbox, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import BtnBlue from "@/components/btn/btn-blue";
import BtnWhite from "@/components/btn/btn-white";

function Register() {
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
        content: "Registration Successful!",
        key,
        duration: 2,
      });
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      messageApi.error({
        content: error.response?.data?.message || "Registration Failed",
        key,
        duration: 2,
      });
    }
  };

  return (
    <div className="register_container">
      <div className="register_header">Sign up in less than 2 minutes.</div>
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
            label="Email"
            name="email"
            rules={[
              { type: "email", message: "Invalid email!" },
              { required: true, message: "Please input your email!" },
            ]}
            style={{ height: "60px" }}
          >
            <Input />
          </Form.Item>

          {/* username */}
          <Form.Item
            layout="vertical"
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your username!",
              },
            ]}
            style={{ height: "60px" }}
          >
            <Input />
          </Form.Item>

          {/* pass */}
          <Form.Item
            layout="vertical"
            label="Password"
            name="password"
            style={{ height: "60px" }}
            rules={[
              {
                required: true,
                message: "Enter your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* re-enter pass */}
          <Form.Item
            layout="vertical"
            label="Confirm the password"
            name="password_confirmation"
            style={{ height: "60px" }}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Confirm the password",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Re-entered password is incorrect!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          {/* checkbox */}
          <Form.Item style={{ textAlign: "center" }}>
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
          </Form.Item>

          {/* sign up */}
          <Form.Item style={{ textAlign: "center" }}>
            {contextHolder}
            <BtnBlue
              defaultText="SIGN UP"
              style={{
                width: "400px",
                fontSize: "var(--header-size)",
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
          OR
        </div>
        <BtnWhite
          defaultText="Continue with Google"
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
        Already have account?
        <span>
          <Link
            className="register_link"
            to="/login"
            style={{ textDecoration: "underline" }}
          >
            Login
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Register;
