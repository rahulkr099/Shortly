import PropTypes from 'prop-types';
import { getUserAnalytics } from "../utils/getAnalytics";

function AnalyticsButton({ theme, setUi }) {
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          const analyticsData = await getUserAnalytics();
          setUi((prev) => ({
            ...prev,
            modal: true,
            analytics: analyticsData.urlEntry,
          }));
        } catch (error) {
          console.error("Error fetching analytics:", error);
        }
      }}
      className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-green-500 hover:bg-green-600 text-white" : "bg-green-600 hover:bg-green-700 text-white"}`}
    >
      Analytics
    </button>
  );
}
AnalyticsButton.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
  setUi: PropTypes.func,

}
export default AnalyticsButton;