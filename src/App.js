import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthProvider from "./context/AuthContext";

const router = createBrowserRouter([
  {
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <DashboardLayout><Home /></DashboardLayout>
      }, {
        path: "/auth",
        element: <Login />
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router}/>
}

export default App;
