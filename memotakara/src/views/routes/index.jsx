import "@/main.css";
import { createBrowserRouter } from "react-router-dom";
import UserLayout from "@/components/layout/UserLayout";
import GuestLayout from "@/components/layout/GuestLayout";
import ProtectedRoute from "@/views/routes/ProtectedRoute";

import LandingPage from "@/views/pages/landing_page";
import Register from "@/views/pages/register";
import Login from "@/views/pages/login";
import Dashboard from "@/views/pages/dashboard";
import Statistics from "@/views/pages/statistics";
import Settings from "@/views/pages/settings";
import StudySets from "@/views/pages/study_sets";
import CreateCollection from "@/views/pages/create_collection";
import StudyDetail from "@/views/pages/study_detail";
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
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/",
    element: <ProtectedRoute requiredRole="user" />,
    children: [
      {
        path: "/",
        element: <UserLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />,
          },
          {
            path: "/statistics",
            element: <Statistics />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/study_sets",
            element: <StudySets />,
          },
          {
            path: "/create_collection",
            element: <CreateCollection />,
          },
          {
            path: "/study_detail",
            element: <StudyDetail />,
          },
        ],
      },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <ProtectedRoute requiredRole="admin" />,
  // },
]);

export default router;
