import { useState, useEffect } from 'react';
import fetchWithAuth from '../api/fetchWithAuth';
import refreshToken from '../api/refreshToken';
import { BASEURL } from '../utils/constants';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
    const accessToken =  localStorage.getItem('accessToken');
    // console.log('acessToken in useAuth.jsx from localStorage',accessToken)
    if(!accessToken){ return 'localstorage has no token'}

      const response = await fetchWithAuth(`${BASEURL}/auth/status`, "notgoogle");

      const data = await response.json(); // Parse response as JSON
      console.log('Response from useAuth.jsx:', data);
      // console.log('useAuth"s message:', data.message);
      if (response.ok && data.success) {
        // setIsAuthenticated(!!accessToken); // Set true if accessToken exists
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
    checkLoginStatus();
    // Set up token refresh logic
    const refreshInterval = setInterval(async () => {
      const newAccessToken = await refreshToken();
      // console.log('Response in setInterval from refreshtoken:', newAccessToken);
      if (!newAccessToken) {
        setIsAuthenticated(false);
        clearInterval(refreshInterval);
      }
    }, 3 * 60 * 1000); // Refresh token every 40 minutes
    return () => clearInterval(refreshInterval);
  }, []);
  
  return { isAuthenticated, setIsAuthenticated };
};
export default useAuth;
