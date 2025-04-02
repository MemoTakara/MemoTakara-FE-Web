import { useState, useEffect } from "react";
import { Table, Button, Space, message } from "antd";
import { getUsers, toggleUserStatus, deleteUser } from "@/api/admin";
import FormattedDate from "@/components/formatted-date";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

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
    { title: "Tên", dataIndex: "name", render: (text) => text || "(Không có)" },
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
      <Button type="primary" style={{ marginBottom: 16 }}>
        Thêm người dùng
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default UserManagement;
