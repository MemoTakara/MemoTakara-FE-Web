import { Modal, Form, Input, Button, message } from "antd";
import { changePassword } from "@/api/admin";

const ChangePasswordOverlay = ({ isOpen, onClose }) => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    const { old_password, new_password } = values;

    try {
      const response = await changePassword(old_password, new_password);
      messageApi.success(response.message);
      form.resetFields(); // Reset form sau khi successful
      onClose(); // Đóng modal sau khi thành công
    } catch (error) {
      messageApi.error(error.message || "Đã xảy ra lỗi.");
    }
  };

  return (
    <div>
      {contextHolder}
      <Modal
        title="Đổi Mật Khẩu"
        visible={isOpen}
        onCancel={onClose}
        footer={[
          <Button onClick={onClose}>Đóng</Button>,
          <Button
            type="primary"
            htmlType="submit"
            onClick={handleSubmit}
            style={{ marginRight: "8px" }}
          >
            Đổi Mật Khẩu
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Mật khẩu cũ"
            name="old_password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ!",
              },
              {
                min: 8, // Độ dài tối thiểu
                message: "Mật khẩu tối thiểu cần 8 ký tự!", // Thông báo khi không đủ 8 ký tự
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="new_password"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới!",
              },
              {
                min: 8, // Độ dài tối thiểu
                message: "Mật khẩu tối thiểu cần 8 ký tự!", // Thông báo khi không đủ 8 ký tự
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="new_password_confirmation"
            rules={[
              {
                required: true,
                message: "Vui lòng xác nhận mật khẩu mới!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChangePasswordOverlay;
