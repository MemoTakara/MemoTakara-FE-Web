import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import { useAuth } from "@/contexts/AuthContext";
import ChangePasswordOverlay from "@/views/admin-pages/change-pass";

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
  const pathToKey = {
    "/users": "1",
    "/notifications": "2",
    "/collections": "3",
    "/flashcards": "4",
  };
  const currentKey = pathToKey[location.pathname] || "1";

  // Menu item
  const items = [
    {
      key: "1",
      label: <span onClick={() => navigate("/users")}>Quản lý người dùng</span>,
    },
    {
      key: "2",
      label: (
        <span onClick={() => navigate("/notifications")}>
          Quản lý thông báo
        </span>
      ),
    },
    {
      key: "3",
      label: (
        <span onClick={() => navigate("/collections")}>Quản lý Collection</span>
      ),
    },
    {
      key: "4",
      label: (
        <span onClick={() => navigate("/flashcards")}>Quản lý Flashcard</span>
      ),
    },
  ];

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
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentKey]}
            items={items}
          />
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
