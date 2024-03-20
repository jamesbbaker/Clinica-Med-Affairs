import { createBrowserRouter } from "react-router-dom";
import { Home } from "./pages";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <DashboardLayout>
        <Home />
      </DashboardLayout>
    ),
  },
  {
    path: "/auth",
    element: <Login />,
  },
]);

export default router;
