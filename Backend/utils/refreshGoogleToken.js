import  { oauth2Client } from "./oauth2Client";
export const refreshGoogleToken = async (refreshToken) => {
    try {
      console.log('Trying to check the value of refresh token in refreshGoogleToken')
      oauth2Client.setCredentials({ refresh_token: refreshToken });
      const { credentials } = await oauth2Client.refreshAccessToken();
      console.log('\ncredentials of new refreshAccessToken',credentials)
      return credentials; // Contains new accessToken and expiration time
    } catch (error) {
      console.error('Error refreshing access token:', error.message);
      throw error;
    }
  };
  