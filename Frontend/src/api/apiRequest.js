/**
 * Utility function to make API requests.
 * @param {string} url - The endpoint URL.
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.).
 * @param {Object} body - Request body (for POST, PUT).
 * @param {Object} headers - Additional headers (optional).
 * @param {boolean} includeCredentials - Whether to include credentials (default: true).
 * @returns {Promise<Object>} - The parsed JSON response or error details.
 */
export async function apiRequest(url, method = "GET", body = null, headers = {}, includeCredentials = true) {
    try {
      const config = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        credentials: includeCredentials ? "include" : "same-origin",
      }; 
  
      if (body) {
        config.body = JSON.stringify(body);
        console.log("Request Body:", config.body); // Log the request body for debugging
      }
  
      const response = await fetch(url, config);
  
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`API Request Error: ${error.message}`);
      throw error;
    }
  }
  