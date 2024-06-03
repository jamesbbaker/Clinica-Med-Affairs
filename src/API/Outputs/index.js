import axios from "axios";
import { refreshTokenFunction } from "../../context/AuthContext";

export async function getDataStats(endPoint, token, refreshToken) {
  console.log(token)
  return new Promise(function(resolve, reject) {
    axios
    .get(`https://clinica-server.replit.app/${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(async function (response) {
      // handle success
      if (response.data) {
        const userData = response.data
        resolve(userData)
      } else {
        if (response.status === 401) {
          // Unauthorized error
          // Refresh the token
          const refreshedToken = await refreshTokenFunction(refreshToken);
          if (refreshedToken) {
            // Retry fetching with the new token
            await getDataStats(refreshedToken, refreshToken);
          } else {
            console.error("Failed to refresh token");
            reject("error")
            // Handle token refresh failure
          }
        } else {
          console.error("Failed to fetch user data:", response.statusText);
          reject("error")
        }
      }
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  })

}
