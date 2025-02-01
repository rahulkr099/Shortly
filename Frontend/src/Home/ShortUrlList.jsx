import PropTypes from 'prop-types';
import CopyButton from "../components/CopyButton";
import { getAnalytics } from "../utils/getAnalytics";

function ShortUrlList({ filteredShortUrls, theme, setUi }) {
  return (
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
              <CopyButton text={url.shortUrl} theme={theme} />
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
          </div>
        </div>
      ))}
    </div>
  );
}
ShortUrlList.propTypes = {
  filteredShortUrls: PropTypes.arrayOf(
    PropTypes.shape({
      shortId: PropTypes.string.isRequired,
      shortUrl: PropTypes.string.isRequired,
      redirectUrl: PropTypes.string.isRequired,
      message: PropTypes.string,
    })
  ).isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
  setUi: PropTypes.func.isRequired,
};
export default ShortUrlList;