import "./index.css";
import { Form, Button, Input } from "antd";
import { Link } from "react-router-dom";

function ForgotPassword() {
  return (
    <div className="forgot-container">
      <div className="forgot-wrap">
        <h3 className="forgot-header">QUÊN MẬT KHẨU</h3>
        <div className="forgot-des">
          Nhập mã mà hệ thống gửi vào email của bạn
        </div>
        <Form className="forgot-form">
          <Form.Item>
            <Input placeholder="Nhập mã xác nhận" />
          </Form.Item>
          <Form.Item>
            <div className="forgot-resend-code">Gửi lại mã</div>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="forgot-form-button"
            >
              <Link to="/reset-password">TIẾP TỤC</Link>
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
