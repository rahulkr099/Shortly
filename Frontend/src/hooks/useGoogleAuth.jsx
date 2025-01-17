import { useEffect, useState } from 'react'
import fetchWithAuth from '../api/fetchWithAuth'

const useGoogleAuth = () => {
  const [isGoogleAuth, setIsGoogleAuth] = useState(false)

  useEffect(() => {
    const checkGoogleAuth = async () => {
      const googleRes = await fetchWithAuth(`http://localhost:4000/api/v1/google/auth/status`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }, "google")

      const googleData = await googleRes.json();
      // console.log('googleData on frontend:', googleData)
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