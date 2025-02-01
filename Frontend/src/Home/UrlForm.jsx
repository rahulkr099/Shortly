import PropTypes from 'prop-types';
import AnalyticsButton from "./AnalyticsButton";
import { setUrlData } from '../containers/urlSlice';

function UrlForm({ originalUrl, customNanoId, expiresAt, isChecked, handleCheckboxChange, handleSubmit, isLoading, theme, dispatch ,message, error,setUi}) {
   
  
    return (
    <div className={`p-6 rounded-lg shadow-md mb-8 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium">
            Enter your Original URL
          </label>
          <input
            id="url"
            type="text"
            name="url"
            value={originalUrl}
            onChange={(e) => dispatch(setUrlData({ originalUrl: e.target.value, customNanoId }))}
            placeholder="https://example.com"
            className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
              className="mr-1"
            />
            Want to add Custom Url & Expiry Date?
          </label>
          {isChecked && (
            <div>
              <div>
                <label htmlFor="customNanoId" className="block text-sm font-medium mb-1">
                  Enter Custom Short URL (Optional)
                </label>
                <input
                  id="customNanoId"
                  type="text"
                  name="customNanoId"
                  value={customNanoId}
                  onChange={(e) => dispatch(setUrlData({ originalUrl, customNanoId: e.target.value }))}
                  placeholder="Enter your custom short URL"
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
                />
              </div>
              <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium mb-1 mt-2">
                  Expiration Date (Optional)
                </label>
                <input
                  id="expiresAt"
                  type="date"
                  name="expiresAt"
                  value={expiresAt}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => dispatch(setUrlData({ originalUrl, customNanoId, expiresAt: e.target.value }))}
                  className={`mt-1 block w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button
            type="submit"
            disabled={isLoading}
            className={`py-2 px-4 rounded-md ${theme === "light" ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"} disabled:opacity-50`}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <AnalyticsButton theme={theme} setUi={setUi}/>
        </div>
      </form>
      {message && <p className={`mt-4 text-sm ${theme === "light" ? "text-green-600" : "text-green-400"}`}>{message}</p>}
              {error && <p className={`mt-4 text-sm ${theme === "light" ? "text-red-600" : "text-red-400"}`}>{error}</p>}
    </div>
  );
}
UrlForm.propTypes = {
  originalUrl: PropTypes.string.isRequired,
  customNanoId: PropTypes.string,
  expiresAt: PropTypes.string,
  isChecked: PropTypes.bool.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.string,
  error: PropTypes.string,
  setUi: PropTypes.func,
};
export default UrlForm;