import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ requiredRole }) => {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/not-authorized" replace />;
  }

  // 🟠 Nếu có requiredRole, kiểm tra quyền truy cập
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/not-authorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
