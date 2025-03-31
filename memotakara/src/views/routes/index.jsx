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

import AdminLayout from "@/components/layout/AdminLayout";
import UserManagement from "@/views/admin-pages/user";
import NotificationManagement from "@/views/admin-pages/notification";
import CollectionManagement from "@/views/admin-pages/collection";
import FlashcardManagement from "@/views/admin-pages/flashcard";

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
    path: "",
    element: <ProtectedRoute requiredRole="admin" />, // Kiểm tra quyền trước khi vào Admin Layout
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: "users",
            element: <UserManagement />,
          },
          {
            path: "notifications",
            element: <NotificationManagement />,
          },
          {
            path: "collections",
            element: <CollectionManagement />,
          },
          {
            path: "flashcards",
            element: <FlashcardManagement />,
          },
        ],
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
