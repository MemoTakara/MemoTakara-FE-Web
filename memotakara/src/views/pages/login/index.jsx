import "./index.css";
import google_icon from "@/assets/img/google_icon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import BtnBlue from "@/components/btn/btn-blue";

function Login() {
  const { login } = useAuth(); // Lấy hàm login từ context
  const [messageApi] = message.useMessage();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    const key = "loginMessage";

    try {
      await login(values.email, values.password);
      messageApi.success({
        content: "Login Successful!",
        key,
        duration: 2,
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      messageApi.error({ content: "Login  Failed", key, duration: 2 });
    }
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
        onFinish={handleLogin}
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
          <Input placeholder="Email" />
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
          {/* {contextHolder} */}
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
