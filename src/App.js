import {
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";
import Output from "./pages/Output";
import "mapbox-gl/dist/mapbox-gl.css";
import Landing from "./pages/Landing";
import About from "./pages/About";
import "react-toastify/dist/ReactToastify.css";
import NeedHelp from "./pages/NeedHelp";
import ContactUs from "./pages/ContactUs";
import Testing from "./pages/Testing";
import MedicalAffairsLanding from "./pages/MedicalAffairs";
import Research from "./pages/Research";
import TermsAndConditions from "./pages/TermsAndConditions";
import { useEffect } from "react";
import useGA4PageTracking from "./Hooks/useGA4PageTracking";
import { Outlet } from "react-router-dom";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <Landing />,
        path: "/",
      },
      {
        element: <About />,
        path: "/about",
      },
      {
        path: "/medicalAffairs",
        element: <MedicalAffairsLanding />,
      },
      {
        path: "/rnd",
        element: <Research />,
      },
      {
        path: "/nonprofit",
        element: <Landing />,
      },
      {
        path: "/termsandconditions",
        element: <TermsAndConditions />,
      },
      {
        element: <ContactUs />,
        path: "/contactus",
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Home />,
          },
          {
            path: "/help",
            element: <NeedHelp />,
          },
          {
            path: "/testing",
            element: <Testing />,
          },

          {
            path: "outputs",
            children: [
              {
                path: "/outputs/:id",
                element: <Output />,
              },
            ],
          },
        ],
      },
      {
        path: "/auth",
        element: <Login />,
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router}>
      <RouterOutlet />
    </RouterProvider>
  );
}

export default App;

const RouterOutlet = () => {
  useGA4PageTracking();
  return <Outlet />;
};
