import "./index.css";
import google_icon from "../../../img/google_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Form, Input, Button, Checkbox, message } from "antd";
import BtnBlue from "../../../components/btn/btn-blue";

function Register() {
  //message
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const openRegisterMessage = () => {
    const key = "updatable";
    messageApi.loading({ content: "Loading...", key });
    setTimeout(() => {
      messageApi.success({ content: "Sign Up Success!", key, duration: 2 });
      setTimeout(() => {
        navigate("/login");
      }, 2000); // Thời gian chờ để hiển thị thông báo trước khi chuyển hướng
    }, 1000);
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
          onFinish={openRegisterMessage}
        >
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
            label="Re-enter password"
            name="re_enter_password"
            style={{ height: "60px" }}
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Re-enter password",
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
            {/* <BtnBlue defaultText="SIGN UP" /> */}
            <Button
              type="primary"
              className="register_btn_register"
              onClick={openRegisterMessage}
            >
              SIGN UP
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* another option: copy login page */}
      <div>
        <div
          style={{ fontWeight: "600", fontSize: "16px", marginLeft: "40px" }}
        >
          OR
        </div>
        <div className="login_option">
          <div>
            <img
              src={google_icon}
              alt="Google Icon"
              style={{
                width: "27px",
                height: "30px",
                paddingTop: "4px",
                cursor: "pointer",
              }}
            />
          </div>
          <div>
            <FontAwesomeIcon
              style={{
                fontSize: "28px",
                color: "#1877F2",
                paddingLeft: "20px",
                cursor: "pointer",
              }}
              icon={faFacebook}
            />
          </div>
        </div>
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
