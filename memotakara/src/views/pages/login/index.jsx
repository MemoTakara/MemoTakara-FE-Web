import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Form, Input, Button, Checkbox, message } from "antd";
import BtnBlue from "@/components/btn/btn-blue";

function Login() {
  //message
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const openLoginMessage = (values) => {
    const key = "updatable";
    messageApi.loading({ content: "Loading...", key });
    setTimeout(() => {
      messageApi.success({ content: "Login Success!", key, duration: 2 });
      setTimeout(() => {
        localStorage.setItem("username", values.username);
        navigate("/dashboard");
      }, 2000); // Thời gian chờ để hiển thị thông báo trước khi chuyển hướng
    }, 1000);
  };

  return (
    <div className="login_container">
      <div className="login_header">
        Welcome back! Please enter your details.
      </div>

      <Form
        name="normal_login"
        className="login_form"
        initialValues={{
          remember: true,
        }}
        style={{
          width: 400,
        }}
        onFinish={openLoginMessage}
      >
        {/* username */}
        <Form.Item
          layout="vertical"
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Enter your username",
            },
          ]}
          style={{ height: "60px" }}
        >
          <Input placeholder="Username" />
        </Form.Item>

        {/* pass */}
        <Form.Item
          layout="vertical"
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Enter your password",
            },
          ]}
          style={{ height: "60px" }}
        >
          <Input.Password type="password" placeholder="Password" />
        </Form.Item>

        {/* checkbox - forgot pass*/}
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ fontSize: "16px" }}>Remember me</Checkbox>
          </Form.Item>

          <Link className="login_form_forgot" to="/forgot_password">
            Forgot password?
          </Link>
        </Form.Item>

        {/* login */}
        <Form.Item>
          {contextHolder}
          {/* <BtnBlue defaultText="LOG IN" /> */}
          <Button type="primary" className="login_btn_login" htmlType="submit">
            LOG IN
          </Button>
        </Form.Item>
      </Form>

      {/* another option */}
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

      {/* sign up */}
      <div className="switch_to_register" style={{ fontSize: "18px" }}>
        Don't have account?
        <span>
          <Link
            className="login_link"
            to="/register"
            style={{ textDecoration: "underline" }}
          >
            Sign up now!
          </Link>
        </span>
      </div>
    </div>
  );
}

export default Login;
