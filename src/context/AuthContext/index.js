import { createContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  // const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();
  const loginAction = async (data) => {
    try {
      const response = await fetch("https://clinica-server.replit.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      });
      const res = await response.json();
      console.log(res);
      if (res.message == "Login successful") {
        setUser({ ...data });
        // setToken(res.token);
        // localStorage.setItem("site", res.token);
        navigate("/");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    // setToken("");
    localStorage.removeItem("site");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, loginAction, logOut }}>
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
