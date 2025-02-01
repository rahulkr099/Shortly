import PropTypes from 'prop-types';
function SearchBar({ searchQuery, setSearchQuery, theme }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search URLs..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className={`p-2 border rounded-md shadow-sm focus:ring-2 focus:outline-none ${theme === "light" ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500 bg-white" : "border-gray-600 focus:ring-blue-400 focus:border-blue-400 bg-gray-700"}`}
      />
    </div>
  );
}

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};
export default SearchBar;