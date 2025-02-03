import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { BASEURL } from '../utils/constants';
import { useState, useEffect, useContext } from 'react';
import ThemeToggleButton from '../Home/ThemeToggleButton';
import { ThemeContext } from '../hooks/ThemeContext';


const Navbar = ({ isAuthenticated, setIsAuthenticated, isGoogleAuth, setIsGoogleAuth }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userImage, setUserImage] = useState('');
  const { theme } = useContext(ThemeContext)

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

  // Fetch user avatar when authenticated
  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (isGoogleAuth) {
          const userInfo = JSON.parse(localStorage.getItem('user-info')) || {};
          setUserImage(userInfo.picture || ''); // Default placeholder if missing
          return;
        }

        if (isAuthenticated) {
          const { firstName, lastName } = JSON.parse(localStorage.getItem("loggedInUser")) || {};
          console.log("Fetching avatar for:", firstName, lastName);

          const response = await fetch(`${BASEURL}/avatar/${firstName}/${lastName}`);
          console.log('\nresponse in navbar', response);
          if (!response.ok) {
            throw new Error("Failed to fetch avatar");
          }

          const blob = await response.blob();
          const imageUrl = URL.createObjectURL(blob);

          console.log("Avatar image URL:", imageUrl);
          setUserImage(imageUrl);
        }
      } catch (error) {
        console.error("Error while generating avatar:", error);
      }
    };

    fetchAvatar();
  }, [isAuthenticated, isGoogleAuth]); // Re-run if authentication status changes

  return (

    <nav className={`shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 transition-colors duration-300 ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-100"
      }`}>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-4">
        <div className="flex justify-between h-14 items-center">
          <div className='flex justify-around'>
          {/* <div className="flex items-center"> */}
            <Link
              to="/home"
              className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors text-xl font-bold"
            >
              Home
            </Link>
          </div>
          <div className="flex justify-end absolute right-5">
            <ThemeToggleButton />
          </div>
          {/* </div> */}
          <div className="flex items-center">
            {isAuthenticated || isGoogleAuth ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center focus:outline-none"
                >
                  <img
                    src={userImage}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600"
                  />
                </button>
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-lg font-bold text-gray-700 dark:text-gray-200 hover:text-red-400 dark:hover:text-red-400"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-4">
                {/* <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                >
                  Signup
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    // </div>
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
