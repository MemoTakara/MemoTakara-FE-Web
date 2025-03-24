import "./index.css";
import GuestHeader from "@/components/header/GuestHeader";
import Footer from "@/components/footer";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

function GuestLayout() {
  const { token, user } = useAuth();
  if (token) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="header">
        <GuestHeader />
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

export default GuestLayout;
