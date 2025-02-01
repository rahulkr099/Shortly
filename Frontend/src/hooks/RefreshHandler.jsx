import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

function RefreshHandler({ isAuthenticated, isGoogleAuth }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RefreshHandler triggered');
    console.log('Auth State:', { isAuthenticated, isGoogleAuth });

    const publicRoutes = ["/", "/login", "/signup", "/home"];
    const isOnPublicRoute = publicRoutes.includes(location.pathname);

    if (isAuthenticated || isGoogleAuth) {
      // Redirect to home if user is authenticated and on a public route (except /home)
      if (isOnPublicRoute && location.pathname !== "/home") {
        navigate("/home", { replace: true });
      }
    } else {
      // Redirect to login if unauthenticated and trying to access restricted routes (excluding /home)
      if (!isOnPublicRoute && location.pathname !== "/home") {
        navigate("/login", { replace: true });
      }
    }
  }, [isAuthenticated, isGoogleAuth, location.pathname, navigate]);

  return null; // No UI rendering for this component
}

// Define prop types for RefreshHandler
RefreshHandler.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isGoogleAuth: PropTypes.bool.isRequired,
  setIsGoogleAuth: PropTypes.func.isRequired
};

export default RefreshHandler;