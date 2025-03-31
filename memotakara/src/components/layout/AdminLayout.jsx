import { Outlet, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const { Header, Sider, Content } = Layout;
const AdminLayout = () => {
  const navigate = useNavigate(); // Khai báo hook useNavigate để điều hướng
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
          // alignItems: "end",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            height: "100%",
            paddingRight: "20px",
            cursor: "pointer",
          }}
        >
          <UserOutlined style={{ fontSize: "20px" }} />
        </div>
      </Header>
      <Layout>
        <Sider>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1" onClick={() => navigate("/users")}>
              User Manager
            </Menu.Item>
            <Menu.Item key="2" onClick={() => navigate("/notifications")}>
              Notification Manager
            </Menu.Item>
            <Menu.Item key="3" onClick={() => navigate("/collections")}>
              Collection Manager
            </Menu.Item>
            <Menu.Item key="4" onClick={() => navigate("/flashcards")}>
              Flashcard Manager
            </Menu.Item>
          </Menu>
        </Sider>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
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
