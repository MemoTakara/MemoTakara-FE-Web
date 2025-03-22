import "./index.css";
import UserHeader from "@/components/header/UserHeader";
import Footer from "@/components/footer";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function UserLayout(props) {
  const { token, user } = useAuth();

  // Nếu đã có token nhưng chưa lấy xong user -> Chờ lấy user
  if (token && user === null) {
    return <div>Loading...</div>;
  }

  if (token && user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="header">
        <UserHeader />
      </div>
      <div className="body" />
      <Outlet />
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
