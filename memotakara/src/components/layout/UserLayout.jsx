import "./index.css";
import UserHeader from "@/components/header/UserHeader";
import Footer from "@/components/footer";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function UserLayout() {
  const { token, user } = useAuth();

  // Nếu đã có token nhưng chưa lấy xong user -> Chờ lấy user
  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <div>Chờ lấy user...</div>;
  }

  return (
    <div className="container">
      <div className="header">
        <UserHeader />
      </div>
      <div className="body">
        <Outlet />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default UserLayout;
