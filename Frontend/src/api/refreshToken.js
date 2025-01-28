import { BASEURL } from "../utils/constants";

// refreshToken.js
const refreshToken = async (type) => {
  const refreshTokenFromLocalStorage = localStorage.getItem('refreshToken')
  console.log('refreshTokenfromlocalstorgae',refreshTokenFromLocalStorage)
  if (!refreshTokenFromLocalStorage && type !== "google") {
    console.error("No refresh token available in localStorage.");
    return null;
  }
  const endpoint = type === "google" ? "/google/auth/refresh" : "/refresh-token";

  try {
    const response = await fetch(`${BASEURL}${endpoint}`, {
      method: type === "google" ? "GET" : "POST",
      credentials: "include",
      body: type == "google" 
        ?undefined : JSON.stringify({ refreshToken: refreshTokenFromLocalStorage }) // Send the token as a JSON object
        ,
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
    const {accessToken, refreshToken} = clonedData;

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken',refreshToken);
      console.log('access token is generated using refresh token')
      return [accessToken,refreshToken];
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
