import "./index.css";
import UserHeader from "@/components/header/UserHeader";
import Footer from "@/components/footer";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/views/error-pages/LoadingPage";

function UserLayout() {
  const { token, user, logout } = useAuth();

  //  nếu mất token -> điều hướng về /login, nhưng user vẫn chưa bị xóa khỏi
  if (!token) {
    logout(); // Xóa user khỏi AuthContext
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <LoadingPage />;
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
