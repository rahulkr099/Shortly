// fetchWithAuth.js
import refreshToken from "./refreshToken";
const fetchWithAuth = async (url, options = {}, type) => {
  const tokenKey = type === "google" ? "googleAccessToken" : "accessToken";
  // const refreshTokenFn = type === "google" ? require("./refreshGoogleToken") : require("./refreshToken");

  const token = localStorage.getItem(tokenKey);
  // console.log(`${type} token in localStorage:`, token);

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers, credentials: "include" });

    // const responseClone = response.clone();
    // const clonedData = await responseClone.json();
    // console.log(`Response in fetchWithAuth (${type}):`, clonedData, response.status);
    // console.log("message:", clonedData.message);

    if (response.status === 401 && !options._retry) {
      console.log("Access token expired. Attempting to refresh token...");

      const newToken = await refreshToken(type);
      if (newToken) {
        console.log("Token refreshed successfully. Retrying original request...");
        return fetchWithAuth(url, { ...options, _retry: true }, type);
      }
    }

    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};
export default fetchWithAuth;
