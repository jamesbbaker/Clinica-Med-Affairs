import { useEffect } from "react";
import { createContext, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { addMultipleUsers } from "../../features/admin/adminSlice";
import { updateMenu } from "../../features/menu/menuSlice";
import { getDataStats } from "../../API/Outputs";
import { selectLabels } from "../../constants/appConstants";

export const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState(null);
  const [selectedUnmet, setSelectedUnmet] = useState([]);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken")
  );


  const dispatch = useDispatch();

  useEffect(() => {
    getDataStats("get_priorities", accessToken, refreshToken)
    .then((res) => {
      let prioritiesList = res.priorities.split(",").filter(item => item.length)
      setSelectedUnmet(
        prioritiesList.map((item) => ({
          label: selectLabels[item] ? selectLabels[item] : item,
          value: item,
        }))
      );
    })
    .catch((Err) => {
      console.log(Err);
    });
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
      if (res.message === "Login successful") {
        let userData = {
          ...data,
          region: res.region,
          company: res.company,
          admin: res.admin,
          page_view: res.page_view,
          name: res.name
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
        navigate("/dashboard", {
          replace: true
        });
        return;
      } else {
        throw new Error();
      }
    } catch (err) {
      throw new Error();
    }
  };


  const updatePassword =async (data) => {
    try {
      const response = await fetch("https://clinica-server.replit.app/update_password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          email: user.email,
          new_password: data.newPassword
         }),
      });
      const res = await response.json();
      return res
    } catch (err) {
      throw new Error();
    }
  }

  const sendEmail =async (data) => {
    try {
      const response = await fetch("https://clinica-server.replit.app/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message
         }),
      });
      const res = await response.json();
      return res
    } catch (err) {
      console.log(err)
      throw new Error();
    }
  }


  const logOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    dispatch(
      updateMenu({
        currentMenu: "users",
        currentMenuLabel: "Users",
      })
    );
    navigate("/", {replace: true});
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
          logOut()
          // Unauthorized error
          // Refresh the token
          const refreshedToken = await refreshTokenFunction(refreshToken);
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


  

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        user,
        sendEmail,
        selectedUnmet,
        setSelectedUnmet,
        updatePassword,
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




export const refreshTokenFunction = async (refreshToken) => {
  try {
    const response = await fetch(
      "https://clinica-server.replit.app/token/refresh",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
    
        }),
      }
    );
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
