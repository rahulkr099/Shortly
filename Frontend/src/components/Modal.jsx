import { useSetAtom } from "jotai";
import { uiAtom } from "../../state";
import PropTypes from 'prop-types';
import { formatTimestamp } from "../utils/formatTimestamp";

const Modal = ({ analytics = [] }) => {
  const setUi = useSetAtom(uiAtom);
  const analyticsArray = Array.isArray(analytics) ? analytics : [analytics];

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-700 bg-opacity-60 p-4 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="relative w-full max-w-4xl h-auto max-h-[80vh] bg-white rounded-lg shadow-lg p-6 dark:bg-gray-800 overflow-hidden">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-3xl focus:outline-none transition-colors"
          onClick={() =>
            setUi((prev) => ({
              ...prev,
              modal: null,
              analytics: null,
            }))
          }
        >
          &times;
        </button>

        {/* Modal Title */}
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          Analytics Modal
        </h2>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-700">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-600">
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Last Visited
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Redirect URL
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Shortened URL
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Total Clicks
                </th>
              </tr>
            </thead>
            <tbody>
              {analyticsArray.length > 0 ? (
                analyticsArray.map((detail, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {formatTimestamp(detail.lastVisited)}
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {detail.redirectUrl}
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {detail.nanoId}
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {detail.totalClicks}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200"
                  >
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
};

Modal.propTypes = {
  analytics: PropTypes.object,
};

export default Modal;