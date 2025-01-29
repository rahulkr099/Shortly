import { BASEURL } from "../utils/constants";

const refreshToken = async (type) => {
  const tokenKeys = type === "google"
    ? { refresh: "googleRefreshToken", access: "googleAccessToken", endpoint: "/google/auth/refresh" }
    : { refresh: "refreshToken", access: "accessToken", endpoint: "/refresh-token" };

  const refreshTokenFromStorage = localStorage.getItem(tokenKeys.refresh);

  if (!refreshTokenFromStorage) {
    console.error(`[refreshToken] No ${tokenKeys.refresh} found in localStorage.`);
    return null;
  }

  try {
    const response = await fetch(`${BASEURL}${tokenKeys.endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [tokenKeys.refresh]: refreshTokenFromStorage }),
    });

    const responseData = await response.json();
    console.log(`[refreshToken] Response (${type}):`, responseData);

    if (!response.ok) {
      console.error(`[refreshToken] Failed to refresh token: ${response.status} - ${responseData.message}`);
      throw new Error("Token refresh failed");
    }

    const { [tokenKeys.access]: newAccessToken, [tokenKeys.refresh]: newRefreshToken } = responseData;

    if (newAccessToken && newRefreshToken) {
      localStorage.setItem(tokenKeys.access, newAccessToken);
      localStorage.setItem(tokenKeys.refresh, newRefreshToken);
      console.log(`[refreshToken] Successfully refreshed tokens for ${type}.`);
      return [newAccessToken, newRefreshToken];
    } else {
      console.error("[refreshToken] Response missing required tokens.");
      return null;
    }
  } catch (error) {
    console.error(`[refreshToken] Error during token refresh (${type}):`, error);
    return null;
  }
};

export default refreshToken;
