import { createBrowserRouter } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import GuestLayout from "@/components/layout/GuestLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

import LandingPage from "@/views/pages/landing_page";
import Register from "@/views/pages/register";
import Login from "@/views/pages/login";
import Dashboard from "@/views/pages/dashboard";
import AdminDashboard from "@/views/pages/admin_dashboard";
import Statistics from "@/views/pages/statistics";
import Settings from "@/views/pages/settings";
import StudySets from "@/views/pages/study_sets";
import NotAuthorized from "@/views/error-pages/NotAuthorized";

const router = createBrowserRouter([
  {
    path: "/not-authorized",
    element: <NotAuthorized />,
  },
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute requiredRole="user" />, // 🟢 Chỉ user mới vào được
    children: [
      {
        path: "/dashboard",
        element: (
          <UserLayout>
            <Dashboard />
          </UserLayout>
        ),
      },
      { path: "/statistics", element: <Statistics /> },
      { path: "/settings", element: <Settings /> },
      { path: "/study_sets", element: <StudySets /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin" />, // 🔴 Chỉ admin mới vào được
    children: [
      {
        path: "/dashboard",
        element: (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        ),
      },
    ],
  },
]);

export default router;
