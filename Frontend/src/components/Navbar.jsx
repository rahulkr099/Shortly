import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BASEURL } from '../utils/constants';

const Navbar = ({ isAuthenticated, setIsAuthenticated, isGoogleAuth, setIsGoogleAuth }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (!isGoogleAuth && !isAuthenticated) return;

      const url = isGoogleAuth
        ? `${BASEURL}/google/auth/revoke`
        : `${BASEURL}/logout`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });

      const result = await response.json();
      console.log("logout", result);

      if (response.ok && result.success) {
        setTimeout(() => {
          if (isGoogleAuth) {
            setIsGoogleAuth(false);
            localStorage.removeItem('googleAccessToken');
            localStorage.removeItem('user-info');
            sessionStorage.removeItem("hasSubmittedAfterLogin");
          } else {
            setIsAuthenticated(false);
            ['loggedInUser', 'accessToken', 'refreshToken'].forEach((key) => localStorage.removeItem(key));
            sessionStorage.removeItem("hasSubmittedAfterLogin");
          }
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      console.error('Error while logging out', error);
    }
  };

  return (
    <nav className="text-xl bg-white dark:bg-gray-800 shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <ul className="flex justify-around items-center p-1">
        <li>
          <Link
            to="/home"
            className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
          >
            Home
          </Link>
        </li>
        {isAuthenticated || isGoogleAuth ? (
          <button
            className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
            onClick={handleLogout}
          >
            Log Out
          </button>
        ) : (
          <div className="flex gap-4">
            <li>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
              >
                Signup
              </Link>
            </li>
          </div>
        )}
      </ul>
    </nav>
  );
};

// Define prop types for Navbar
Navbar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  setIsAuthenticated: PropTypes.func.isRequired,
  isGoogleAuth: PropTypes.bool,
  setIsGoogleAuth: PropTypes.func,
};

export default Navbar;