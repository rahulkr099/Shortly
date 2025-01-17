import { useEffect, useState } from "react";
import { handleError, handleSuccess } from "../../utils";
import Overlays from '../components/Overlays';
import { useSetAtom } from 'jotai';
import { uiAtom } from '../../state';
import PropTypes from 'prop-types';

function Home({ isGoogleAuth, isAuthenticated }) {
  const setUi = useSetAtom(uiAtom);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [originalUrl, setOriginalUrl] = useState(""); // For input URL
  const [shortUrls, setShortUrls] = useState([]); // To store generated URLs
  // const [analytics, setAnalytics] = useState([]); // Table data for analytics

  useEffect(() => {
    // Determine logged-in user from localStorage
    if (isAuthenticated) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setLoggedInUser(user.firstName || "Guest");
        handleSuccess(`Welcome, ${user.firstName || "Guest"}!`);
      } else {
        handleError("User not logged in!");
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
    }
  }, [isAuthenticated, isGoogleAuth]);

  // Handle input change for URL
  function handleChange(e) {
    setOriginalUrl(e.target.value);
  }

  // Handle form submission to generate a short URL
  async function handleSubmit(e) {
    e.preventDefault();

    if (!originalUrl) {
      handleError("Please enter a valid URL!");
      return;
    }

    try {
      const fetchUrl = "http://localhost:4000/shorten"; // Replace with actual endpoint
      const response = await fetch(fetchUrl, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: originalUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate short URL");
      }

      const result = await response.json();
      setShortUrls((prev) => [...prev, { shortId: result.id, redirectUrl: originalUrl, clicks: 0 }]);
      setOriginalUrl(""); // Clear the input field
      handleSuccess("Short URL generated successfully!");
    } catch (error) {
      console.error("Something went wrong in generate URL", error);
      handleError("Failed to generate short URL");
    }
  }

  return (
    <div className="bg-slate-300 w-screen h-screen">
      <Overlays />
      <div className="p-2">
        {/* Header Section */}
        <div className="flex items-center justify-around">
          <h1 className="text-2xl font-bold">
            Welcome, {loggedInUser || "Guest"}!
          </h1>
          <button
            className="border-2 border-orange-600 bg-orange-400 p-1 rounded-md hover:bg-orange-500 hover:text-gray-100"
            onClick={() =>
              setUi((prev) => ({ ...prev, modal: true }))
            }
          >
            Toggle Modal
          </button>
        </div>
      </div>
      <div className="p-4">
        <h1>Shortify</h1>
        <p>Generated URL will appear below:</p>
        <p className="text-blue-500">
          {/* {shortUrls ? (
            <a href={shortUrls} target="_blank" rel="noopener noreferrer">
              {shortUrls}
            </a>
          ) : (
            "No URL generated yet."
          )} */}

        </p>
        <div className="mb-6">
          <form onSubmit={handleSubmit}>
            <label htmlFor="url" className="block mb-2">
              Enter your Original URL
            </label>
            <input
              id="url"
              type="text"
              name="url"
              value={originalUrl}
              onChange={handleChange}
              placeholder="https://example.com"
              className="border rounded p-2 w-96 mb-4 mr-2"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Generate
            </button>
          </form>
        </div>
        {/* Display Short URLs */}
        <div>
          <table className="w-full border-collapse border-2 border-green-400 shadow-inner shadow-green-400">
            <thead>
              <tr>
                <th className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">S. No.</th>
                <th className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">Redirect URL</th>
                <th className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">Shorted Url</th>
                <th className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">Clicks</th>
              </tr>
            </thead>
            <tbody>
              {shortUrls.map((url, index) => (
                <tr key={index} className="">
                  <td className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">{index + 1}</td>
                  <td className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">{url.redirectUrl}</td>
                  <td className="border-2 border-green-400 shadow-inner shadow-green-400 p-2">
                    <a href={`http://localhost:4000/${url.shortId}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      {`http://localhost:4000/${url.shortId}`}
                    </a>
                  </td>
                  <td className="text-center border-2 border-green-400 shadow-inner shadow-green-400 p-2">{url.clicks}</td>
                </tr>
              ))}
              {shortUrls.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-4 border-2 border-green-400 shadow-inner shadow-green-400">
                    No short URLs generated yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
