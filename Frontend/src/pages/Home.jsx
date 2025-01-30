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
import { ChevronUp, ChevronDown, Copy, BarChart } from 'lucide-react';

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
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

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

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      handleSuccess("Copied to clipboard!");
    });
  };

  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleExpandAll = () => {
    setExpandAll((prev) => !prev);
    setExpandedCards(shortUrls.reduce((acc, _, index) => {
      acc[index] = !expandAll;
      return acc;
    }, {}));
  };

  const filteredShortUrls = shortUrls.filter((url) =>
    url.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"}`}>
      <Overlays />
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full focus:outline-none ${theme === "light" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold">
            <span className={`${theme === "light" ? "text-fuchsia-500" : "text-blue-400"}`}>{loggedInUser || "Guest"}! </span>
            Welcome to <span className="underline">Shortly</span>
          </h1>
        </div>
        <div className="flex flex-col md:flex-row md:justify-around gap-14">
          <div className="w-full md:w-2/3">
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
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} disabled:opacity-50`}
                  >
                    {isLoading ? "Generating..." : "Generate"}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const analyticsData = await getUserAnalytics();
                        setUi((prev) => ({
                          ...prev,
                          modal: true,
                          analytics: analyticsData.urlEntry,
                        }));
                      } catch (error) {
                        console.error("Error fetching analytics:", error);
                      }
                    }}
                    className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
                  >
                    Analytics
                  </button>
                </div>
              </form>
              {message && <p className={`mt-4 text-sm ${theme === "light" ? "text-green-600" : "text-green-400"}`}>{message}</p>}
              {error && <p className={`mt-4 text-sm ${theme === "light" ? "text-red-600" : "text-red-400"}`}>{error}</p>}
            </div>

            <div className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
              <h2 className="text-xl font-semibold mb-4">Generated Short URLs</h2>
              <div className="flex justify-between items-center mb-4">
                <input
                  type="text"
                  placeholder="Search URLs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
                />
                {/* <button
                  onClick={toggleExpandAll}
                  className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
                >
                  {expandAll ? "Collapse All" : "Expand All"}
                </button> */}
              </div>
              {filteredShortUrls.length > 0 ? (
                <>
                  <div className="hidden md:block overflow-x-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-700">
                    <table className="w-full border-collapse min-w-max">
                      <thead>
                        <tr className="bg-gray-200 dark:bg-gray-600">
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">No.</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Short URL</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Analytics</th>
                          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Copy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredShortUrls.map((url, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                          >
                            <td className="p-3 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                            <td className="p-3 text-sm text-gray-700 dark:text-gray-300 break-all">
                              <a
                                href={url.shortUrl}
                                className="text-blue-500 hover:underline break-all"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {url.shortUrl}
                              </a>
                            </td>
                            <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
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
                            <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                              <button
                                onClick={() => handleCopyToClipboard(url.shortUrl)}
                                className={`p-1 rounded-md ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-600 hover:bg-gray-500"}`}
                              >
                                <Copy size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4">
                    {filteredShortUrls.map((url, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg shadow-sm ${theme === "light" ? "bg-gray-50" : "bg-gray-700"}`}
                      >
                        <div className="space-y-2">
                          <div className="flex gap-3">
                            <span className="font-semibold">No.:</span>
                            <span>{index + 1}</span>
                          </div>
                          <div className="flex gap-1">
                            <span className="font-semibold">Short URL:</span>
                            <a
                              href={url.shortUrl}
                              className="text-blue-500 hover:underline break-all"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {url.shortUrl}
                            </a>
                            <button
                              onClick={() => handleCopyToClipboard(url.shortUrl)}
                              className={`p-1 rounded-md ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-600 hover:bg-gray-500"}`}
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                          <div className="flex gap-3">
                            <span className="font-semibold">Analytics:</span>
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
                          </div>
                          {/* <button
                            onClick={() => toggleCard(index)}
                            className={`w-full flex justify-center items-center p-2 rounded-md ${theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-600 hover:bg-gray-500"}`}
                          >
                            {expandedCards[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          {expandedCards[index] && (
                            <div className="mt-2">
                              <p className="text-sm">Additional details can be shown here.</p>
                            </div>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>No short URLs generated yet.</p>
              )}
            </div>
          </div>
          {shortUrlForQRCode && (
            <div className="w-full md:w-1/3 mt-8 md:mt-0">
              <QRCodeGenerator url={shortUrlForQRCode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  isGoogleAuth: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

export default Home;