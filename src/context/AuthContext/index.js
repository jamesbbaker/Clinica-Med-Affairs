import { useEffect } from "react";
import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { addMultipleUsers } from "../../features/admin/adminSlice";
import { updateMenu } from "../../features/menu/menuSlice";

export const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );

  const dispatch = useDispatch();

  useEffect(() => {
    // Check if tokens are already stored in local storage on page load
    const storedAccessToken = localStorage.getItem("accessToken");

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedAccessToken) {
      setAccessToken(storedAccessToken);
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
        let userData = {
          ...data,
          region: res.region,
          company: res.company,
          admin: res.admin,
          page_view: res.page_view,
        };
        setUser(userData);
        setAccessToken(res.access_token);
        setRefreshToken(res.refresh_token);
        localStorage.setItem("accessToken", res.access_token);
        localStorage.setItem("refreshToken", res.refresh_token);
        localStorage.setItem("user", JSON.stringify(userData));
        if (res.admin) {
          dispatch(
            updateMenu({
              currentMenu: "users",
              currentMenuLabel: "Users",
            })
          );
        } else {
          dispatch(
            updateMenu({
              currentMenu: "home",
              currentMenuLabel: "Home",
            })
          );
        }
        navigate("/dashboard");
        return;
      } else {
        throw new Error();
      }
    } catch (err) {
      throw new Error();
    }
  };

  const refreshTokenFunction = async (refreshToken) => {
    try {
      const response = await fetch(
        "https://clinica-server.replit.app/token/refresh",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh_token: refreshToken,
          }),
        }
      );
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        return data.access_token;
      } else {
        console.error("Failed to refresh token:", response.statusText);
        return null;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      return null;
    }
  };

  const fetchUserData = async (token, refreshToken) => {
    try {
      const response = await fetch(
        "https://clinica-server.replit.app/get_all_users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const userData = await response.json();

        dispatch(addMultipleUsers(userData));
      } else {
        if (response.status === 401) {
          // Unauthorized error
          // Refresh the token
          const refreshedToken = await refreshTokenFunction(refreshToken);
          console.log(refreshToken, "refr");
          if (refreshedToken) {
            // Retry fetching with the new token
            await fetchUserData(refreshedToken, refreshToken);
          } else {
            console.error("Failed to refresh token");
            // Handle token refresh failure
          }
        } else {
          console.error("Failed to fetch user data:", response.statusText);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const logOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(
      updateMenu({
        currentMenu: "users",
        currentMenuLabel: "Users",
      })
    );
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        refreshTokenFunction,
        fetchUserData,
        loginAction,
        logOut,
      }}
    >
      <Outlet />
    </AuthContext.Provider>
  );
};

export default AuthProvider;
