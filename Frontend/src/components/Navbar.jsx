// Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types'

const Navbar = ({ isAuthenticated, setIsAuthenticated, isGoogleAuth ,setIsGoogleAuth}) => {

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (!isGoogleAuth && !isAuthenticated) return;

      const url = isGoogleAuth
        ? "http://localhost:4000/api/v1/google/auth/revoke"
        : "http://localhost:4000/api/v1/logout";

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
      });

      const result = await response.json();
      // console.log("logout", result);

      if (response.ok && result.success) {
        setTimeout(() => {
          if (isGoogleAuth) {
            setIsGoogleAuth(false);
            localStorage.removeItem('googleAccessToken');
            localStorage.removeItem('user-info');
          } else {
            setIsAuthenticated(false);
            ['loggedInUser', 'accessToken', 'refreshToken'].forEach((key) => localStorage.removeItem(key));
          }
          navigate('/login');
        }, 1000);
      }
    } catch (error) {
      console.error('Error while logging out', error);
    }
  };
    return (
      <nav className='text-xl bg-blue-500 drop-shadow-xl backdrop-filter backdrop-blur-xl bg-opacity-90 '>
        <ul className='flex justify-around gap-3 p-1 '>
          <li className='hover:text-green-400'><Link to="/home">Home</Link></li>
          {isAuthenticated || isGoogleAuth ? (
            <><button
              className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition hover:text-black"
              onClick={handleLogout}
            >Log Out</button>
            </>) : (
            <div className='flex gap-2'>
              <li className=' hover:text-green-400'><Link to="/login">Login</Link></li>
              <li className=' hover:text-green-400'><Link to="/signup">Signup</Link></li>
            </div>
          )}
        </ul>
      </nav>
    );
  };
  // Define prop types for PrivateRoute
  Navbar.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    setIsAuthenticated: PropTypes.func.isRequired,
    isGoogleAuth: PropTypes.bool,
    setIsGoogleAuth: PropTypes.func,
  };

  export default Navbar;
