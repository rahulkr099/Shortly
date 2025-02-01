import PropTypes from 'prop-types';

function ThemeToggleButton({ theme, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full focus:outline-none ${theme === "light" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
ThemeToggleButton.propTypes = {
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
  toggleTheme: PropTypes.func.isRequired,
};
export default ThemeToggleButton;