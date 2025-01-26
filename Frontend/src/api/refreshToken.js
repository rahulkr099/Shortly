import { BASEURL } from "../utils/constants";

// refreshToken.js
const refreshToken = async (type) => {
  
  const endpoint = type === "google" ? "/google/auth/refresh" : "/refresh-token";

  try {
    const response = await fetch(`${BASEURL}${endpoint}`, {
      method: type === "google" ? "GET" : "POST",
      credentials: "include",
    });

    const responseClone = response.clone();
    const clonedData = await responseClone.json();
    // console.log(`Response from refreshToken (${type}):`, clonedData);
    // console.log("refreshToken's message:", clonedData.message);

    if (!response.ok) {
      console.error("Failed to get Refresh Token:", response);
      throw new Error("Token Refreshing Failed");
    }

    const tokenKey = type === "google" ? "googleAccessToken" : "accessToken";
    const token = clonedData[tokenKey];

    if (token) {
      localStorage.setItem(tokenKey, token);
      return token;
    } else {
      console.error("No access token in response payload.");
      return null;
    }
  } catch (error) {
    console.error(`Error during refreshing token (${type}):`, error);
    return null; // Return null if refresh fails
  }
};
export default refreshToken;
