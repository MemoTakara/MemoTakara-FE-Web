import { useState, useEffect } from "react";
import { getUsers, toggleUserStatus, deleteUser } from "@/api/admin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error);
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await toggleUserStatus(id);
      fetchUsers(); // Refresh danh sách sau khi thay đổi
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái người dùng:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?"))
      return;

    try {
      await deleteUser(id);
      fetchUsers(); // Refresh danh sách sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
    }
  };

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.is_active ? "Hoạt động" : "Bị khóa"}</td>
              <td>
                <button onClick={() => handleToggleUser(user.id)}>
                  {user.is_active ? "Khóa" : "Mở khóa"}
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
