import { Navigate, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
// import RefreshHandler from './hooks/RefreshHandler';
import useAuth from './hooks/useAuth'
import Navbar from './components/Navbar';
import PropTypes from 'prop-types';
import ResetPassword from './components/ResetPassword';
import ResetPasswordRequest from './components/ResetPasswordRequest';
import PageNotFound from './components/PageNotFound';
import {GoogleOAuthProvider} from '@react-oauth/google';
import GoogleLogin from './pages/GoogleLogin';
import useGoogleAuth from './hooks/useGoogleAuth';
// PrivateRoute Component
 // This combined guard checks both regular authentication and Google authentication
 const PrivateRoute = ({ element, isAuthenticated, isGoogleAuth }) => {
  if (isAuthenticated || isGoogleAuth) return element;
  return <Navigate to="/login" replace />;

};

function App() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const {isGoogleAuth , setIsGoogleAuth} = useGoogleAuth();
  // console.log('app me isauth ka value',isAuthenticated);

  const GoogleAuthWrapper = () =>{
    return(
      <GoogleOAuthProvider clientId='586582432388-f3jsa99pf0eh5h4ucljdnb31q2qrvub2.apps.googleusercontent.com'>
        <GoogleLogin setIsGoogleAuth={setIsGoogleAuth}></GoogleLogin>
      </GoogleOAuthProvider>
    )
  }
  return (
    <div>
     
      {/* Navbar is available on every page */}
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} isGoogleAuth={isGoogleAuth} setIsGoogleAuth={setIsGoogleAuth}/>

      {/* Ensures the authentication state is refreshed on page load */}
      {/* <RefreshHandler setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} setIsGoogleAuth={setIsGoogleAuth} isGoogleAuth={isGoogleAuth}/> */}
      
      <Routes>
        {/* Redirect root path to login */}
        <Route path="/" element={isAuthenticated || isGoogleAuth ? <Navigate to="/home" /> : <Navigate to="/login" />} />


        {/* Protected route for authenticated users */}
        <Route
          path="/home"
          element={<Home isAuthenticated={isAuthenticated} isGoogleAuth={isGoogleAuth}/>} 
        />
        
        {/* Public routes for Login and Signup */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} GoogleAuthWrapper={GoogleAuthWrapper} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password-token" element={<ResetPasswordRequest />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='*' element={<PageNotFound/>}/>
      </Routes>
      
    </div>
  );
}
// Define prop types for PrivateRoute
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isGoogleAuth:PropTypes.bool,
};
export default App;
