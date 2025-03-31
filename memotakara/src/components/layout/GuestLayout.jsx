import "./index.css";
import GuestHeader from "@/components/header/GuestHeader";
import Footer from "@/components/footer";
import { Outlet } from "react-router-dom";

function GuestLayout() {
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
