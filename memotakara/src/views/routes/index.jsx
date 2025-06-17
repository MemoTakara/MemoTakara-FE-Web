import "@/main.css";
import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "@/views/routes/ProtectedRoute";

import GuestLayout from "@/components/layout/GuestLayout";
import PublicList from "@/views/pages/study_sets/public-collection";

import UserLayout from "@/components/layout/UserLayout";
import LandingPage from "@/views/pages/landing_page";
import Register from "@/views/pages/register";
import Login from "@/views/pages/login";
import GooglePage from "@/views/pages/login/google";
import ForgotPassword from "@/views/pages/forgot-password";
import ResetPassword from "@/views/pages/forgot-password/reset-pass";
import Dashboard from "@/views/pages/dashboard";
import ProgressPage from "@/views/pages/progress";
import Settings from "@/views/pages/settings";
import StudySets from "@/views/pages/study_sets";
import RecentList from "@/views/pages/study_sets/recent-collection";
import StudyDetail from "@/views/pages/study_detail";
import StudyFlashcard from "@/views/pages/study/flashcard";
import StudyTyping from "@/views/pages/study/typing";

import AdminLayout from "@/components/layout/AdminLayout";
import UserManagement from "@/views/admin-pages/user";
import NotificationManagement from "@/views/admin-pages/notification";
import CollectionManagement from "@/views/admin-pages/collection";
import FlashcardManagement from "@/views/admin-pages/flashcard";

import LoadingPage from "@/views/error-pages/LoadingPage";
import NotAuthorized from "@/views/error-pages/NotAuthorized";
import NotFound from "@/views/error-pages/NotFound";
import SM2FlashcardComponent from "@/views/test";

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
        path: "google",
        element: <GooglePage />,
      },
      {
        path: "forgot_password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "public-collection",
        element: <PublicList isPublic={true} />,
      },
      {
        path: "public-collection/:id",
        element: <StudyDetail isPublic={true} isEditFC={false} />,
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
            path: "progress",
            element: <ProgressPage />,
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
            path: "recent-collection",
            element: <RecentList />,
          },
          {
            path: "public-study-set",
            element: <PublicList isPublic={false} />,
          },
          {
            path: "public-study-set/:id",
            element: <StudyDetail isPublic={false} isEditFC={false} />,
          },
          {
            path: "collection-study/flashcard/:id",
            element: <StudyFlashcard isPublic={false} isEditFC={false} />,
          },
          {
            path: "collection-study/typing/:id",
            element: <StudyTyping isPublic={false} isEditFC={false} />,
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
  {
    path: "/test",
    element: <SM2FlashcardComponent />,
  },
]);

export default router;
