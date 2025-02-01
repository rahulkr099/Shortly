// import { useSetAtom } from "jotai";
// import { uiAtom } from "../../state";
import PropTypes from 'prop-types';
import { useState } from "react";
import CloseButton from "./CloseButton";
import SearchInput from "./SearchInput";
import DesktopTableView from "./DesktopTableView";
import MobileCardView from "./MobileCardView";

const Modal = ({ analytics = {} ,theme}) => {
  const analyticsArray = Array.isArray(analytics) ? analytics : [analytics];
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAnalytics = analyticsArray.filter((detail) => {
    return (
      detail.redirectURL.toLowerCase().includes(searchQuery.toLowerCase()) ||
      detail.nanoId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-gray-700 bg-opacity-60 p-4 dark:bg-gray-900 dark:bg-opacity-80">
      <div className="relative w-full max-w-7xl h-fit bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800 overflow-y-auto">
        <CloseButton />
        <h2 className="text-center text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Analytics Modal</h2>
        <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="overflow-x-auto rounded-lg shadow-inner bg-gray-50 dark:bg-gray-700">
          <DesktopTableView filteredAnalytics={filteredAnalytics} theme={theme}/>
          <MobileCardView filteredAnalytics={filteredAnalytics} theme={theme}/>
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  analytics: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};

export default Modal;