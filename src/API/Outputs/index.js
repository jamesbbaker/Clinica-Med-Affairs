import {refreshTokenFunction} from "../../context/AuthContext"

export async function getDataStats(endPoint,token, refreshToken) {
    try {
        const response = await fetch(
          `https://clinica-server.replit.app/${endPoint}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const userData = await response.json();
        return userData
        } else {
          if (response.status === 401) {
            // Unauthorized error
            // Refresh the token
            console.log(refreshToken)
            const refreshedToken = await refreshTokenFunction(refreshToken);
            if (refreshedToken) {
              // Retry fetching with the new token
              await getDataStats(refreshedToken, refreshToken);
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