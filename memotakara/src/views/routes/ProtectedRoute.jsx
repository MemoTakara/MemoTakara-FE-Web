import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import LoadingPage from "@/views/error-pages/LoadingPage";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, token } = useAuth();

  // Kiểm tra nếu token chưa có hoặc user chưa được tải
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return <LoadingPage />;
  }

  // Kiểm tra role nếu có yêu cầu
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
