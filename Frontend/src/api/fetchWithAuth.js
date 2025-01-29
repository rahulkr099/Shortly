// fetchWithAuth.js
import refreshToken from "./refreshToken";
const fetchWithAuth = async (url, options = {}, type) => {
  const tokenKeys = type === "google" 
  ? ["googleAccessToken", "googleMiddlewareToken"] 
  : ["accessToken"];

const tokens = tokenKeys.map(key => localStorage.getItem(key)).filter(Boolean);

console.log(`${type} tokens in localStorage:`, tokens);

// Construct Authorization header
const authHeader = tokens.length ? { Authorization: `Bearer ${tokens.join(" ")}` } : {};

const headers = {
  'Content-Type': 'application/json',
  ...authHeader,
  ...options.headers,
};


  try {
    const response = await fetch(url, { ...options, headers, credentials: "include" });

    const responseClone = response.clone();
    const clonedData = await responseClone.json();
    console.log(`Response in fetchWithAuth (${type}):`, clonedData, response.status);
    console.log("message:", clonedData.message);

    if (response.status === 401 && !options._retry) {
      console.log("Access token expired. Attempting to refresh token... in fetchWithAuth.js");

      const newToken = await refreshToken(type);
      if (newToken) {
        console.log("Token refreshed successfully. Retrying original request...");
        return fetchWithAuth(url, { ...options, _retry: true }, type);
      }else {
        // Refresh token failed, redirect to login
        // alert('Your session has expired. Please log in again.');
        // window.location.href = '/login';
        console.log('Refresh Token is expired')
      }
    }

    return response;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};
export default fetchWithAuth;
