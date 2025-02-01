import PropTypes from 'prop-types';

const SearchInput = ({ searchQuery, setSearchQuery }) => {
    return (
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by URL or Shortened URL..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };
  SearchInput.propTypes ={
    searchQuery: PropTypes.string.isRequired,
    setSearchQuery: PropTypes.func.isRequired,
  }
  export default SearchInput;