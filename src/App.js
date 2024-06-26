import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";
import Output from "./pages/Output";
import "mapbox-gl/dist/mapbox-gl.css";
import Landing from "./pages/Landing";
import About from "./pages/About";
import 'react-toastify/dist/ReactToastify.css';

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
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <Home />,
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
  return <RouterProvider router={router} />;
}

export default App;
