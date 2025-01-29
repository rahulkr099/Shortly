import { BASEURL } from "../utils/constants";

// refreshToken.js
const refreshToken = async (type) => {
  const refreshTokenFromLocalStorage =
    type === "google"
      ? localStorage.getItem("googleRefreshToken")
      : localStorage.getItem("refreshToken");
  console.log("refreshTokenfromlocalstorgae", refreshTokenFromLocalStorage);
  if (!refreshTokenFromLocalStorage) {
    console.error("No refresh token available in localStorage.");
    return null;
  }
  const endpoint =
    type === "google" ? "/google/auth/refresh" : "/refresh-token";

  try {
    const response = await fetch(`${BASEURL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // Specify JSON format
      },
      body:
        type === "google"
          ? JSON.stringify({ googleRefreshToken: refreshTokenFromLocalStorage })
          : JSON.stringify({ refreshToken: refreshTokenFromLocalStorage }), // Send the token as a JSON object
    });

    const responseClone = response.clone();
    const clonedData = await responseClone.json();
    console.log(`Response from refreshToken.js (${type}):`, clonedData);
    console.log("refreshToken's message:", clonedData.message);

    if (!response.ok) {
      console.error("Failed to get Refresh Token:", response);
      throw new Error("Token Refreshing Failed");
    }

    // const tokenKey = type === "google" ? "googleAccessToken" : "accessToken";
    // const token = clonedData[tokenKey];

    if (type === "google") {
      const { googleAccessToken, googleRefreshToken } = clonedData;

      if (googleAccessToken && googleRefreshToken) {
        localStorage.setItem("googleAccessToken", googleAccessToken);
        localStorage.setItem("googleRefreshToken", googleRefreshToken);
        console.log(
          "google access token is generated using google refresh token"
        );
        return [googleAccessToken, googleRefreshToken];
      }
    } else {
      const { accessToken, refreshToken } = clonedData;

      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        console.log("access token is generated using refresh token");
        return [accessToken, refreshToken];
      } else {
        console.error("No access token in response payload.");
        return null;
      }
    }
  } catch (error) {
    console.error(`Error during refreshing token (${type}):`, error);
    return null; // Return null if refresh fails
  }
};
export default refreshToken;
