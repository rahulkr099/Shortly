import refreshToken from "./refreshToken";

const fetchWithAuth = async (url, type = "notgoogle", options = {}) => {
  let tokenPayload = {};
  
  if (type === "google") {
    const googleAccessToken = localStorage.getItem("googleAccessToken");
    const googleMiddlewareToken = localStorage.getItem("googleMiddlewareToken");

    if (!googleAccessToken || !googleMiddlewareToken) {
      console.error("Missing Google authentication tokens");
      return Promise.reject("Google authentication tokens missing");
    }

    tokenPayload = { googleAccessToken, googleMiddlewareToken };
  } else {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      console.error("Missing access token");
      return Promise.reject("Access token missing");
    }

    tokenPayload = { accessToken };
  }

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),  // Merge with any additional headers
  };

  const fetchOptions = {
    method: "POST",  // Default to POST if not specified
    credentials: "include",
    headers,
    body: JSON.stringify(tokenPayload),
    ...options,  // Merge other provided options
  };

  try {
    const response = await fetch(url, fetchOptions);

    const responseClone = response.clone();
    const clonedData = await responseClone.json();
    console.log(`Response in fetchWithAuth (${type}):`, clonedData, response.status);
    console.log("message:", clonedData.message);

    if (response.status === 401 && !options._retry) {
      console.log("Access token expired. Attempting to refresh token...");

      const newToken = await refreshToken(type);
      if (newToken) {
        console.log(`Token refreshed successfully. Retrying original request for ${type}`);
        return fetchWithAuth(url, type, { ...options, _retry: true });
      } else {
        console.log("Refresh Token expired. User needs to re-authenticate.");
        return Promise.reject("Session expired, please log in again.");
      }
    }

    return response;
  } catch (error) {
    console.error("Request failed:", error);
    return Promise.reject(error);
  }
};

export default fetchWithAuth;
