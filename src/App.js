import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";
import Output from "./pages/Output";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
          {
            path: "output",
            element: <Output />,
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
  return <RouterProvider router={router} />;
}

export default App;
