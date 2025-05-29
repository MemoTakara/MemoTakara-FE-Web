import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Form,
  Input,
  Select,
} from "antd";
import {
  getUsers,
  createUser,
  toggleUserStatus,
  deleteUser,
} from "@/api/admin";
import FormattedDate from "@/components/widget/formatted-date";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      messageApi.error("Lỗi khi tải danh sách người dùng");
    }
    setLoading(false);
  };

  const handleCreateUser = async (user) => {
    try {
      await createUser(user);
      messageApi.success("Thêm mới người dùng thành công");
      setIsModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      messageApi.error("Lỗi khi tạo người dùng");
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      messageApi.success("Cập nhật trạng thái thành công");
      fetchUsers();
    } catch {
      messageApi.error("Lỗi khi thay đổi trạng thái");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
    try {
      await deleteUser(id);
      messageApi.success("Xóa thành công");
      fetchUsers();
    } catch {
      messageApi.error("Lỗi khi xóa người dùng");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Tên", dataIndex: "name", render: (text) => text || "NULL" },
    { title: "Username", dataIndex: "username" },
    { title: "Email", dataIndex: "email" },
    { title: "Vai trò", dataIndex: "role" },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (text) => (text ? "Kích hoạt" : "Khóa"),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      render: (text) => (text ? <FormattedDate dateString={text} /> : "-"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updated_at",
      render: (text) => (text ? <FormattedDate dateString={text} /> : "-"),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button onClick={() => handleToggleUser(record.id)}> Mở/Khóa</Button>
          <Button danger onClick={() => handleDeleteUser(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => setIsModalVisible(true)}
      >
        Thêm người dùng
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
      <Modal
        title="Thêm người dùng mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ type: "string", max: 255 }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Đây là trường bắt buộc" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, min: 8, message: "Mật khẩu tối thiểu 8 ký tự" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" initialValue="user">
            <Select>
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={() => setIsModalVisible(false)}>Huỷ</Button>
              <Button type="primary" htmlType="submit">
                Tạo
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
