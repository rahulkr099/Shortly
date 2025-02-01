import PropTypes from 'prop-types';
import { formatTimestamp } from "../utils/formatTimestamp";
import CopyButton from '../components/CopyButton';

const DesktopTableView = ({ filteredAnalytics,theme }) => {
  return (
    <table className="w-full border-collapse min-w-max hidden md:table">
      <thead>
        <tr className="bg-gray-200 dark:bg-gray-600">
          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Last Visited</th>
          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Redirect URL</th>
          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Shortened URL</th>
          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Total Clicks</th>
          <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Visit History</th>
        </tr>
      </thead>
      <tbody>
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((detail, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
              <td className="w-28 p-3 text-sm text-gray-700 dark:text-gray-300">{formatTimestamp(detail.lastVisited)}</td>
              <td className="w-fit p-3 text-sm text-gray-700 dark:text-gray-300 break-all max-w-xs md:max-w-sm lg:max-w-md">
                <a href={detail.redirectURL} className="text-blue-500 hover:underline break-all dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                  {detail.redirectURL}
                </a>
                <CopyButton text={detail.redirectURL} theme={theme}/>
              </td>
              <td className="w-fit p-3 text-sm text-gray-700 dark:text-gray-300 break-words">
                <a href={`https://shortlyapp.in/url/${detail.nanoId}`} className="text-blue-500 hover:underline break-all dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                  {`https://shortlyapp.in/url/${detail.nanoId}`}
                </a>
                <CopyButton text={`https://shortlyapp.in/url/${detail.nanoId}`} theme={theme} />
              </td>
              <td className="w-10 p-3 text-sm text-gray-700 dark:text-gray-300">{detail.totalClicks}</td>
              <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                {detail.visitHistory && detail.visitHistory.length > 0 ? (
                  <div>
                    <p>Browser: {detail.visitHistory[0].browser}</p>
                    <p>Device: {detail.visitHistory[0].device}</p>
                    <p>IP: {detail.visitHistory[0].ip}</p>
                  </div>
                ) : (
                  <p>No visit history</p>
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200">
              No matching results found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

DesktopTableView.propTypes = {
  filteredAnalytics: PropTypes.array.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};

export default DesktopTableView;