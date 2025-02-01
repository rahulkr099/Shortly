import { apiRequest } from "../api/apiRequest";
import { URL } from "./constants";
export async function createShortUrl(originalUrl, customNanoId=null, expiresAt=null) {
  const endpoint = `${URL}/url/shorten`; // Replace with your actual endpoint
  try {
    const response = await apiRequest(endpoint, "POST", { url: originalUrl ,customNanoId:customNanoId, expiresAt:expiresAt});
    console.log("Short URL created successfully:", response);
    return response; // Return the response for further use
  } catch (error) {
    console.error("Error creating short URL:", error.message);
    throw error; // Rethrow the error to handle it in the calling code
  }
}
