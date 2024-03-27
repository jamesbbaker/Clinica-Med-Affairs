import { useEffect } from "react";
import { createContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  useEffect(() => {
    // Check if tokens are already stored in local storage on page load
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
    }
    if (storedRefreshToken) {
      setRefreshToken(storedRefreshToken);
    }
  }, []);

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

      if (res.message == "Login successful") {
        setUser({ ...data });
        setAccessToken(res.access_token);
        setRefreshToken(res.refresh_token);
        localStorage.setItem("accessToken", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token);
        navigate("/");
        return;
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, user, loginAction, logOut }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
