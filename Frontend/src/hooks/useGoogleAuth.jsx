import { useEffect, useState } from 'react'
import fetchWithAuth from '../api/fetchWithAuth'
import {BASEURL} from '../utils/constants'

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
  }, [])
  return { isGoogleAuth, setIsGoogleAuth };
}

export default useGoogleAuth