import { useEffect, useState } from 'react'
import fetchWithAuth from '../api/fetchWithAuth'
import {BASEURL} from '../utils/constants'
import { apiRequest } from '../api/apiRequest';

const useGoogleAuth = () => {
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);


  useEffect(() => {
    const checkGoogleAuth = async () => {

      const googleAccessToken = localStorage.getItem('googleAccessToken');
      const googleMiddlewareToken = localStorage.getItem('googleMiddlewareToken');    

      if(!googleAccessToken && !googleMiddlewareToken) 
        { return 'googleAccessToken and googleMiddlewareToken is missing'}
      
      const googleRes = await fetchWithAuth(`${BASEURL}/google/auth/status`, "google")

      const googleData = await googleRes.json();
      console.log('googleData on frontend:', googleData)
      if (googleData.success) {
        setIsGoogleAuth(true);
      } else {
        setIsGoogleAuth(false);
      }
    }
    checkGoogleAuth();
    const googleTokenInterval = setInterval(async () => {
      const newAccessToken = await apiRequest(`${BASEURL}/google/auth/status`);
      console.log('Response in setInterval from refreshtoken:', newAccessToken);
      
        clearInterval(googleTokenInterval);
      
    }, 3 * 60 * 1000); // Refresh token every 1 hr 30 minutes
    return () => clearInterval(googleTokenInterval);
  
  }, [])
  return { isGoogleAuth, setIsGoogleAuth };
}

export default useGoogleAuth