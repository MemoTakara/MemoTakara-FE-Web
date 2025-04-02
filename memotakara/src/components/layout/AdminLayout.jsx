import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import ChangePasswordOverlay from "@/components/change-pass";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate(); // Khai báo hook useNavigate để điều hướng
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  //Log out
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    console.log(user?.username); // Xem tên người dùng
    await logout(); // Đăng xuất
    navigate("/login");
  };

  // Xác định key dựa trên đường dẫn hiện tại
  const currentKey = (() => {
    if (location.pathname.startsWith("/users")) return "1";
    if (location.pathname.startsWith("/notifications")) return "2";
    if (location.pathname.startsWith("/collections")) return "3";
    if (location.pathname.startsWith("/flashcards")) return "4";
    return "1"; // Mặc định active vào User Manager
  })();

  return (
    <Layout>
      <Header
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: 0,
          background: colorBgContainer,
        }}
      >
        <div
          className="header_name"
          style={{ fontSize: "var(--logo-size)", marginLeft: "30px" }}
        >
          MemoTakara
        </div>
        <button
          style={{
            background: colorBgContainer,
            border: "none",
            alignItems: "center",
            height: "100%",
            paddingRight: "20px",
            cursor: "pointer",
          }}
          onClick={() => setIsOverlayOpen(true)}
        >
          Đổi Mật Khẩu
        </button>
        <ChangePasswordOverlay
          isOpen={isOverlayOpen}
          onClose={() => setIsOverlayOpen(false)}
        />
        <button
          style={{
            background: colorBgContainer,
            border: "none",
            alignItems: "center",
            height: "100%",
            paddingRight: "20px",
            cursor: "pointer",
          }}
          onClick={handleLogout}
        >
          Đăng xuất
        </button>
      </Header>
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline" selectedKeys={[currentKey]}>
            <Menu.Item key="1" onClick={() => navigate("/users")}>
              Quản lý người dùng
            </Menu.Item>
            <Menu.Item key="2" onClick={() => navigate("/notifications")}>
              Quản lý thông báo
            </Menu.Item>
            <Menu.Item key="3" onClick={() => navigate("/collections")}>
              Quản lý Collection
            </Menu.Item>
            <Menu.Item key="4" onClick={() => navigate("/flashcards")}>
              Quản lý Flashcard
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 636,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
