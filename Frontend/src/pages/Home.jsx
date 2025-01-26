import { useCallback, useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../utils";
import Overlays from "../components/Overlays";
import { useSetAtom } from "jotai";
import { uiAtom } from "../../state";
import PropTypes from "prop-types";
import { createShortUrl } from "../utils/createShortUrl";
import { getAnalytics } from "../utils/getAnalytics";
import { getUserAnalytics } from "../utils/getAnalytics";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUrlData, clearUrlData } from '../../containers/urlSlice';

function Home({ isGoogleAuth, isAuthenticated }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setUi = useSetAtom(uiAtom);
  const [loggedInUser, setLoggedInUser] = useState("");
  const { originalUrl, customNanoId } = useSelector((state) => state.url);
  const [shortUrls, setShortUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shortUrlForQRCode, setShortUrlForQRCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark"); // Default theme is dark

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  // Apply theme class to the root element
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!originalUrl) {
        handleError("Please enter a valid URL!");
        return;
      }

      // Check if user is authenticated via either method
      if (!isAuthenticated && !isGoogleAuth) {
        dispatch(setUrlData({ originalUrl, customNanoId }));
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const result = await createShortUrl(originalUrl, customNanoId);
        setShortUrls((prev) => [
          ...prev,
          {
            shortId: result.id,
            shortUrl: result.shortUrl,
            redirectUrl: originalUrl,
            message: result.message,
          },
        ]);
        setMessage(result.message);
        setError("");
        setShortUrlForQRCode(result.shortUrl);
        handleSuccess("Short URL generated successfully!");
        // Reset the input fields after successful generation
        dispatch(clearUrlData());
      } catch (error) {
        console.error("Something went wrong in generate URL", error);
        setError("Failed to generate short URL");
        handleError("Failed to generate short URL");
      } finally {
        setIsLoading(false);
      }
    }, [originalUrl, customNanoId, isAuthenticated, navigate, dispatch, isGoogleAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("loggedInUser"));
      if (user) {
        setLoggedInUser(user.firstName || "Guest");
        handleSuccess(`Welcome, ${user.firstName || "Guest"}!`);
      } else {
        handleError("User not logged in!");
      }

      const hasSubmitted = sessionStorage.getItem("hasSubmittedAfterLogin");
      if (originalUrl && !hasSubmitted) {
        sessionStorage.setItem("hasSubmittedAfterLogin", "true");
        handleSubmit(new Event("submit"));
      }
    }

    if (isGoogleAuth) {
      const user = JSON.parse(localStorage.getItem("user-info"));
      if (user) {
        setLoggedInUser(user.firstName || "Guest");
        handleSuccess(`Welcome, ${user.firstName || "Guest"}!`);
      } else {
        handleError("User not logged in!");
      }
      const hasSubmitted = sessionStorage.getItem("hasSubmittedAfterLogin");
      if (originalUrl && !hasSubmitted) {
        sessionStorage.setItem("hasSubmittedAfterLogin", "true");
        handleSubmit(new Event("submit"));
      }
    }

  }, [isAuthenticated, isGoogleAuth, handleSubmit, originalUrl]);

  const userStatus = async () => {
    try {
      const status = await getUserAnalytics();
      console.log("userStatus", status);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
    }
  };

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"}`}>
      <Overlays />
      <div className="max-w-4xl mx-auto">
        {/* Theme Toggle Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full focus:outline-none ${theme === "light" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">
            <span className={`${theme === "light" ? "text-fuchsia-500" : "text-blue-400"}`}>{loggedInUser || "Guest"}! </span>
            Welcome to <span className="underline">Shortly</span>
          </h1>
        </div>

        {/* URL Input Form */}
        <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium">
                Enter your Original URL
              </label>
              <input
                id="url"
                type="text"
                name="url"
                value={originalUrl}
                onChange={(e) => dispatch(setUrlData({ originalUrl: e.target.value, customNanoId }))}
                placeholder="https://example.com"
                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
              />
            </div>
            <div>
              <label htmlFor="customNanoId" className="block text-sm font-medium">
                Enter Custom Short URL (Optional)
              </label>
              <input
                id="customNanoId"
                type="text"
                name="customNanoId"
                value={customNanoId}
                onChange={(e) => dispatch(setUrlData({ originalUrl, customNanoId: e.target.value }))}
                placeholder="Enter your custom short URL"
                className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} disabled:opacity-50`}
              >
                {isLoading ? "Generating..." : "Generate"}
              </button>
              <button
                type="button"
                onClick={userStatus}
                className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
              >
                Analytics
              </button>
            </div>
          </form>
          {message && <p className={`mt-4 text-sm ${theme === "light" ? "text-green-600" : "text-green-400"}`}>{message}</p>}
          {error && <p className={`mt-4 text-sm ${theme === "light" ? "text-red-600" : "text-red-400"}`}>{error}</p>}
        </div>

        {/* Display Short URLs */}
        <div className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
          <h2 className="text-xl font-semibold mb-4">Generated Short URLs</h2>
          {shortUrls.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-400">
              <thead>
                <tr>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-700 text-gray-100"}`}>
                    No.
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-700 text-gray-100"}`}>
                    Short URL
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === "light" ? "bg-gray-200 text-gray-900" : "bg-gray-700 text-gray-100"}`}>
                    Analytics
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === "light" ? "divide-gray-200 bg-white" : "divide-gray-700 bg-gray-800"}`}>
                {shortUrls.map((url, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 text-sm ${theme === "light" ? "text-gray-900" : "text-gray-100"}`}>{index + 1}</td>
                    <td className={`px-6 py-4 text-sm ${theme === "light" ? "text-blue-500 hover:text-blue-600" : "text-blue-400 hover:text-blue-300"}`}>
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">
                        {url.shortUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        className={`py-1 px-3 rounded-md ${theme === "light" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                        onClick={async () => {
                          try {
                            const analyticsData = await getAnalytics(url.shortId);
                            setUi((prev) => ({
                              ...prev,
                              modal: true,
                              analytics: analyticsData,
                            }));
                          } catch (error) {
                            console.error("Error fetching analytics:", error);
                          }
                        }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>No short URLs generated yet.</p>
          )}
        </div>

        {/* QR Code Generator */}
        {shortUrlForQRCode && (
          <div className="mt-8">
            <QRCodeGenerator url={shortUrlForQRCode} />
          </div>
        )}
      </div>
    </div>
  );
}

Home.propTypes = {
  isGoogleAuth: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

export default Home;