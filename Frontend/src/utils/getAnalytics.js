import { apiRequest } from "../api/apiRequest";
import { URL } from "./constants";
export async function getAnalytics(nanoId) {
  const endpoint = `${URL}/analytics/${nanoId}`; // Replace with your actual endpoint
  try {
    // console.log("Nano ID passed to getAnalytics:", nanoId);
    const response = await apiRequest(endpoint, "GET");
    console.log("Analytics of website:", response);
    return response; // Return the response for further use
  } catch (error) {
    console.error("Error creating short URL:", error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
}

export async function getUserAnalytics() {
  const endpoint = `${URL}/user/status`; // Replace with your actual endpoint
  try {
    const response = await apiRequest(endpoint, "GET");
    // console.log("Analytics of website:", response);
    return response; // Return the response for further use
  } catch (error) {
    console.error("Error creating short URL:", error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
}