import "../../main.css";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../../components/main_layout";
import LandingPage from "../pages/landing_page";
import SignUp from "../pages/sign_up";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Statistics from "../pages/statistics";
import Settings from "../pages/settings";
import StudySets from "../pages/study_sets";
import CreateCollection from "../pages/create_collection";
import StudyDetail from "../pages/study_detail";
// import ErrorPage from "../pages/error_page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout component={<LandingPage />} />,
    // errorElement: <ErrorPage />,
  },
  {
    path: "/sign_up",
    element: <MainLayout component={<SignUp />} />,
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
