import { useEffect, useState } from "react";
import { message, Button, Form, Input, Modal, Table } from "antd";
import { getNotifications, sendNotification } from "@/api/notification";

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Error fetching notifications", error);
      message.error("Failed to fetch notifications");
    }
  };

  const handleSendNotification = async (values) => {
    try {
      await sendNotification(values);
      message.success("Notification sent successfully");
      form.resetFields();
      setIsModalVisible(false);
      fetchNotifications();
    } catch (error) {
      message.error("Failed to send notification");
      console.error("Error sending notification", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Nội dung",
      dataIndex: "message",
      key: "message",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_read",
      key: "is_read",
      render: (isRead) => (isRead ? "Read" : "Unread"),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={showModal} style={{ marginBottom: 16 }}>
        Tạo thông báo mới
      </Button>

      <Modal
        title="Send Notification"
        visible={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>,
        ]}
      >
        <Form layout="vertical" form={form} onFinish={handleSendNotification}>
          <Form.Item
            name="user_id"
            label="User ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="sender_id" label="Sender ID">
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="data" label="Data">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Table
        dataSource={notifications}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }} // Bạn có thể tùy chỉnh số lượng bản ghi trên một trang
      />
    </div>
  );
};

export default NotificationManager;
