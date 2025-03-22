import "@/main.css";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/components/main_layout";
import LandingPage from "@/views/pages/landing_page";
import Register from "@/views/pages/register";
import Login from "@/views/pages/login";
import Dashboard from "@/views/pages/dashboard";
import Statistics from "@/views/pages/statistics";
import Settings from "@/views/pages/settings";
import StudySets from "@/views/pages/study_sets";
import CreateCollection from "@/views/pages/create_collection";
import StudyDetail from "@/views/pages/study_detail";
// import ErrorPage from "@/views/pages/error_page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout component={<LandingPage />} />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <MainLayout component={<Register />} />,
  },
  {
    path: "/login",
    element: <MainLayout component={<Login />} />,
  },
  {
    path: "/dashboard",
    element: <MainLayout component={<Dashboard />} />,
  },
  {
    path: "/statistics",
    element: <MainLayout component={<Statistics />} />,
  },
  {
    path: "/settings",
    element: <MainLayout component={<Settings />} />,
  },
  {
    path: "/study_sets",
    element: <MainLayout component={<StudySets />} />,
  },
  {
    path: "/create_collection",
    element: <MainLayout component={<CreateCollection />} />,
  },
  {
    path: "/study_detail",
    element: <MainLayout component={<StudyDetail />} />,
  },
]);

export default router;
