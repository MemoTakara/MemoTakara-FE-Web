import "@/main.css";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/views/routes/ProtectedRoute";

import GuestLayout from "@/components/layout/GuestLayout";
import PublicList from "@/components/set-item/public-set-list";

import UserLayout from "@/components/layout/UserLayout";
import LandingPage from "@/views/pages/landing_page";
import Register from "@/views/pages/register";
import Login from "@/views/pages/login";
import ForgotPassword from "@/views/pages/forgot-password";
import Dashboard from "@/views/pages/dashboard";
import Statistics from "@/views/pages/statistics";
import Settings from "@/views/pages/settings";
import StudySets from "@/views/pages/study_sets";
import CreateCollection from "@/views/pages/create_collection";
import StudyDetail from "@/views/pages/study_detail";

import LoadingPage from "@/views/error-pages/LoadingPage";
import NotAuthorized from "@/views/error-pages/NotAuthorized";
import NotFound from "@/views/error-pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
      },
      {
        path: "public-collection",
        element: <PublicList />,
      },
      {
        path: "public-collection/:id",
        element: <StudyDetail isPublic={true} />,
      },
    ],
  },
  {
    path: "",
    element: <ProtectedRoute requiredRole="user" />,
    children: [
      {
        element: <UserLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "statistics",
            element: <Statistics />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "study_sets",
            element: <StudySets />,
          },
          {
            path: "create_collection",
            element: <CreateCollection />,
          },
          {
            path: "public-study-set/:id",
            element: <StudyDetail isPublic={true} />,
          },
        ],
      },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedRoute requiredRole="admin" />,
    children: [
      {
        index: true,
        element: <div>Admin Panel - Coming Soon</div>, // Tạm thời hiển thị thông báo
      },
    ],
  },
  {
    path: "/not-authorized",
    element: <NotAuthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/loading",
    element: <LoadingPage />,
  },
]);

export default router;
