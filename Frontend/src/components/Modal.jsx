import { useSetAtom } from "jotai";
import { uiAtom } from "../../state";
import PropTypes from 'prop-types';
import { formatTimestamp } from "../utils/formatTimestamp";
import { useState } from "react";
import { ChevronDown, ChevronUp, BarChart, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ analytics = {} }) => {
  const setUi = useSetAtom(uiAtom);
  const analyticsArray = Array.isArray(analytics) ? analytics : [analytics];

  const [expanded, setExpanded] = useState({});
  const [expandAll, setExpandAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExpandAll = () => {
    const newState = !expandAll;
    setExpandAll(newState);
    setExpanded(analyticsArray.reduce((acc, _, idx) => ({ ...acc, [idx]: newState }), {}));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  const filteredAnalytics = analyticsArray.filter((detail) => {
    return (
      detail.redirectURL.toLowerCase().includes(searchQuery.toLowerCase()) ||
      detail.nanoId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-700 bg-opacity-60 p-4 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="relative w-full max-w-7xl h-fit bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800 overflow-y-auto">
        {/* Close Button */}
        <button
          className="absolute top-2 right-4 text-gray-600 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400 text-5xl focus:outline-none transition-colors"
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

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by URL or Shortened URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-700">
          {/* Desktop Table View */}
          <table className="w-full border-collapse min-w-max hidden md:table">
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
              {filteredAnalytics.length > 0 ? (
                filteredAnalytics.map((detail, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                      {formatTimestamp(detail.lastVisited)}
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 break-all max-w-xs md:max-w-sm lg:max-w-md">
                      <a
                        href={detail.redirectURL}
                        className="text-blue-500 hover:underline break-all dark:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {detail.redirectURL}
                      </a>
                      <button
                        onClick={() => copyToClipboard(detail.redirectURL)}
                        className="ml-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-3 text-sm text-gray-700 dark:text-gray-300 break-words">
                    <a
                        href={`https://shortly-klp2.onrender.com/url/${detail.nanoId}`}
                        className="text-blue-500 hover:underline break-all dark:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`https://shortly-klp2.onrender.com/url/${detail.nanoId}`}
                      </a>
                      <button
                        onClick={() => copyToClipboard(`https://shortly-klp2.onrender.com/url/${detail.nanoId}`)}
                        className="ml-2 text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
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
                    No matching results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col overflow-y-auto max-h-[calc(100vh-150px)] bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
            {/* Sticky Header with Expand/Collapse Button */}
            <div className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-600 p-3 flex items-center justify-between text-gray-800 dark:text-gray-200 rounded-t-lg">
              <div className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <span className="font-semibold">Analytics Data</span>
              </div>
              <button
                className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={toggleExpandAll}
              >
                {expandAll ? "Collapse All" : "Expand All"}
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="space-y-4 p-3">
              {filteredAnalytics.length > 0 ? (
                filteredAnalytics.map((detail, index) => (
                  <motion.div
                    key={index}
                    className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-800 dark:text-gray-200">
                        {formatTimestamp(detail.lastVisited)}
                      </span>
                      <button onClick={() => toggleExpand(index)}>
                        {expanded[index] ? (
                          <ChevronUp className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {expanded[index] && (
                        <motion.div
                          className="mt-3 space-y-2"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {/* Redirect URL */}
                          <div className="flex gap-2">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              Redirect URL:
                            </span>
                            <a
                              href={detail.redirectURL}
                              className="text-blue-500 hover:underline break-all dark:text-blue-400"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {detail.redirectURL}
                            </a>
                            <button
                              onClick={() => copyToClipboard(detail.redirectURL)}
                              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Shortened URL */}
                          <div className="flex gap-3">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              Shortened URL:
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                            <a
                        href={`https://shortly-klp2.onrender.com/url/${detail.nanoId}`}
                        className="text-blue-500 hover:underline break-all dark:text-blue-400"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`https://shortly-klp2.onrender.com/url/${detail.nanoId}`}
                      </a>
                            </span>
                            <button
                              onClick={() => copyToClipboard(`https://shortly-klp2.onrender.com/url/${detail.nanoId}`)}
                              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Total Clicks */}
                          <div className="flex gap-3">
                            <span className="font-semibold text-gray-800 dark:text-gray-200">
                              Total Clicks:
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {detail.totalClicks}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded-lg">
                  No matching results found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  analytics: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export default Modal;