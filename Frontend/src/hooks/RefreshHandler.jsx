import { useEffect} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types'

function RefreshHandler({ setIsAuthenticated, isAuthenticated , isGoogleAuth, setIsGoogleAuth }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if a token exists in localStorage
    // const token = localStorage.getItem("token");
    if (isAuthenticated) {
      setIsAuthenticated(true);
      // console.log('authenticate', isAuthenticated)
      // Redirect to home if accessing public routes
      const publicRoutes = ["/", "/login", "/signup"];
      if (publicRoutes.includes(location.pathname)) {
        navigate("/home", { replace: false });
      }
    } else if (isGoogleAuth) {
      setIsGoogleAuth(true);
      // console.log('authenticate', isGoogleAuth)

      // Redirect to home if accessing public routes
      const publicRoutes = ["/", "/login", "/signup"];
      if (publicRoutes.includes(location.pathname)) {
        navigate("/home", { replace: true });
      }
    } else {
      setIsGoogleAuth(false)
    }
  }, [location.pathname, setIsAuthenticated, navigate, isAuthenticated , isGoogleAuth,setIsGoogleAuth]);

  // No UI rendering for this component
  return null;
}
// Define prop types for RefreshHandler
RefreshHandler.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isGoogleAuth:PropTypes.bool.isRequired,
  setIsGoogleAuth: PropTypes.func.isRequired
};
export default RefreshHandler;
