import PropTypes from 'prop-types';
import CopyButton from "../components/CopyButton";
import { getAnalytics } from "../utils/getAnalytics";

function ShortUrlTable({ filteredShortUrls, theme, setUi }) {
  return (
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
                <CopyButton text={url.shortUrl} theme={theme} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
ShortUrlTable.propTypes = {
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
export default ShortUrlTable;