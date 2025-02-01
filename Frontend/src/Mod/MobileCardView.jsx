import { useState } from "react";
import { BarChart } from "lucide-react";
import AnalyticsCard from "./AnalyticsCard";
import PropTypes from 'prop-types'

const MobileCardView = ({ filteredAnalytics, theme }) => {
  const [expanded, setExpanded] = useState({});
  const [expandAll, setExpandAll] = useState(false);

  const toggleExpand = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleExpandAll = () => {
    const newState = !expandAll;
    setExpandAll(newState);
    setExpanded(filteredAnalytics.reduce((acc, _, idx) => ({ ...acc, [idx]: newState }), {}));
  };

  return (
    <div className="md:hidden flex flex-col overflow-y-auto max-h-[calc(100vh-150px)] bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
      <div className="sticky top-0 z-10 bg-gray-200 dark:bg-gray-600 p-3 flex items-center justify-between text-gray-800 dark:text-gray-200 rounded-t-lg">
        <div className="flex items-center gap-2">
          <BarChart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          <span className="font-semibold">Analytics Data</span>
        </div>
        <button className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" onClick={toggleExpandAll}>
          {expandAll ? "Collapse All" : "Expand All"}
        </button>
      </div>
      <div className="space-y-4 p-3">
        {filteredAnalytics.length > 0 ? (
          filteredAnalytics.map((detail, index) => (
            <AnalyticsCard key={index} detail={detail} index={index} expanded={expanded} toggleExpand={toggleExpand} theme={theme}/>
          ))
        ) : (
          <div className="text-center p-4 text-red-500 bg-red-50 dark:bg-red-900 dark:text-red-200 rounded-lg">
            No matching results found.
          </div>
        )}
      </div>
    </div>
  );
};

MobileCardView.propTypes = {
  filteredAnalytics: PropTypes.array.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};

export default MobileCardView;