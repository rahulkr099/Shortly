import PropTypes from 'prop-types';

function Header({ loggedInUser, theme }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold">
        <span className={`${theme === "light" ? "text-fuchsia-500" : "text-blue-400"}`}>{loggedInUser || "Guest"}! </span>
        Welcome to <span className="underline">Shortly</span>
      </h1>
    </div>
  );
}

Header.propTypes = {
  loggedInUser: PropTypes.string,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
};
export default Header;