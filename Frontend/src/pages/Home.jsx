import { useCallback, useEffect, useState } from "react";
import { handleError, handleSuccess } from "../utils/utils";
import Overlays from "../Mod/Overlays";
import { useSetAtom } from "jotai";
import { uiAtom } from "../Mod/state";
import PropTypes from "prop-types";
import { createShortUrl } from "../utils/createShortUrl";
import QRCodeGenerator from "../components/QRCodeGenerator";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { setUrlData, clearUrlData } from '../containers/urlSlice';
import ThemeToggleButton from '../Home/ThemeToggleButton'
import Header from "../Home/Header";
import UrlForm from "../Home/UrlForm";
import SearchBar from "../Home/SearchBar";
import ShortUrlTable from "../Home/ShortUrlTable";
import ShortUrlList from "../Home/ShortUrlList";

function Home({ isGoogleAuth, isAuthenticated }) {
  const dispatch = useDispatch();
  const setUi = useSetAtom(uiAtom);
  const [loggedInUser, setLoggedInUser] = useState("");
  const { originalUrl, customNanoId, expiresAt } = useSelector((state) => state.url);
  const [shortUrls, setShortUrls] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [shortUrlForQRCode, setShortUrlForQRCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [searchQuery, setSearchQuery] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const navigate = useNavigate();

   // Clear message and error after 3 seconds
   useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

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
        dispatch(setUrlData({ originalUrl, customNanoId, expiresAt }));
        navigate("/login");
        return;
      }

      setIsLoading(true);
      try {
        const result = await createShortUrl(originalUrl, customNanoId, expiresAt);
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
    }, [originalUrl, customNanoId, isAuthenticated, navigate, dispatch, isGoogleAuth, expiresAt]);

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

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  }

  const filteredShortUrls = shortUrls.filter((url) =>
    url.redirectUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen p-4 transition-colors duration-300 ${theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"}`}>
      <Overlays theme={theme}/>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>

        <Header loggedInUser={loggedInUser} theme={theme} />

        <div className="flex flex-col md:flex-row md:justify-around gap-14">
          <div className="w-full md:w-2/3">
            <UrlForm
              originalUrl={originalUrl}
              customNanoId={customNanoId}
              expiresAt={expiresAt}
              isChecked={isChecked}
              handleCheckboxChange={handleCheckboxChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              theme={theme}
              dispatch={dispatch}
              message={message}
              error={error}
              setUi={setUi}
            />

            <div className={`p-6 rounded-lg shadow-md ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
              <h2 className="text-xl font-semibold mb-4">Generated Short URLs</h2>
              <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} theme={theme} />
              {filteredShortUrls.length > 0 ? (
                <>
                  <ShortUrlTable filteredShortUrls={filteredShortUrls} theme={theme} setUi={setUi} />
                  <ShortUrlList filteredShortUrls={filteredShortUrls} theme={theme} setUi={setUi} />
                </>
              ) : (
                <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>No short URLs generated yet.</p>
              )}
            </div>
          </div>
          {shortUrlForQRCode && (
            <QRCodeGenerator url={shortUrlForQRCode} />
          )}
        </div>
      </div>
    </div>
  );
}
Home.propTypes = {
  isGoogleAuth:PropTypes.bool.isRequired,
  isAuthenticated:PropTypes.bool.isRequired,
}
export default Home;