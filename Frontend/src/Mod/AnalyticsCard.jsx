import { motion, AnimatePresence } from "framer-motion";
import PropTypes from 'prop-types';
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatTimestamp } from "../utils/formatTimestamp";
import CopyButton from "../components/CopyButton";

const AnalyticsCard = ({ detail, index, expanded, toggleExpand ,theme}) => {
  return (
    <motion.div
      className="p-4 rounded-lg shadow-md bg-white dark:bg-gray-800"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-800 dark:text-gray-200">Number {index + 1}</span>
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
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                {detail?.lastVisited ? `Last Viewed at ${formatTimestamp(detail.lastVisited)}` : "Website hasn't been Viewed"}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Redirect URL:</span>
              <a href={detail.redirectURL} className="text-blue-500 hover:underline break-all dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                {detail.redirectURL}
              </a>
              <CopyButton text={detail.redirectURL} theme={theme}/>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Shortened URL:</span>
              <a href={`https://shortly-klp2.onrender.com/url/${detail.nanoId}`} className="text-blue-500 hover:underline break-all dark:text-blue-400" target="_blank" rel="noopener noreferrer">
                {`https://shortly-klp2.onrender.com/url/${detail.nanoId}`}
              </a>
              <CopyButton text={`https://shortly-klp2.onrender.com/url/${detail.nanoId}`} theme={theme}/>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">Total Clicks:</span>
              <span className="text-gray-700 dark:text-gray-300">{detail.totalClicks}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-gray-800 dark:text-gray-200">User Details:</span>
              <div className="text-gray-700 dark:text-gray-300">
                {detail.visitHistory && detail.visitHistory.length > 0 ? (
                  <div>
                    <p>Browser: {detail.visitHistory[0].browser}</p>
                    <p>Device: {detail.visitHistory[0].device}</p>
                    <p>IP: {detail.visitHistory[0].ip}</p>
                  </div>
                ) : (
                  <p>No visit history</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

AnalyticsCard.propTypes = {
  detail: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  expanded: PropTypes.object.isRequired,
  toggleExpand: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};

export default AnalyticsCard;