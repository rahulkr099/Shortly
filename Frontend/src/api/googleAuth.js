const BASE_URL = 'http://localhost:4000/api/v1';
export const googleAuth = async (code) => {
  try {
    const response = await fetch(`${BASE_URL}/google/auth?code=${code}`, {
      method: 'GET',
      credentials: 'include',
    });
//  console.log(response.ok)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log('googleAuth api:',data);
    return data;
  } catch (error) {
    console.error('Error during Google authentication:', error);
    throw error;
  }
};
