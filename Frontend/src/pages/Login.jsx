import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../containers/authSlice";
import { useState } from "react";
import { handleError, handleSuccess } from "../../utils";
import PropTypes from 'prop-types';
import GoogleLogin from "./GoogleLogin";
import { BASEURL } from "../utils/constants";

function Login({ setIsAuthenticated, GoogleAuthWrapper }) {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light"); // State to manage theme
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      return handleError("Email and password are required");
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASEURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(loginInfo),
      });

      const result = await response.json();
      console.log('result in login.jsx',result);
      if (response.ok && result.success) {
        const { accessToken,refreshToken, user } = result;
        handleSuccess(result.message);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken",refreshToken);
        dispatch(loginSuccess(user));
        localStorage.setItem("loggedInUser", JSON.stringify(user));
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        setIsAuthenticated(false);
        const errorMessage = result.errors?.[0] || result.message;
        handleError(errorMessage || "Login failed");
      }
    } catch (error) {
      handleError("Network error. Please try again", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-colors duration-300 ${theme === "light" ? "bg-gray-100 text-gray-900" : "bg-gray-900 text-gray-100"}`}>
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full ${theme === "light" ? "bg-gray-800 text-white" : "bg-white text-gray-800"}`}
      >
        {theme === "light" ? "🌙" : "☀️"}
      </button>
      <h1 className="text-4xl font-bold mb-8">Login Page</h1>
      <div className={`w-full max-w-md p-8 rounded-xl shadow-lg transition-colors duration-300 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              placeholder="Enter your email"
              autoComplete="email"
              required
              className={`w-full p-3 rounded-lg border ${theme === "light" ? "border-gray-300" : "border-gray-600"} focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-blue-500" : "focus:ring-blue-400"} ${theme === "light" ? "bg-white" : "bg-gray-700"}`}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className={`w-full p-3 rounded-lg border ${theme === "light" ? "border-gray-300" : "border-gray-600"} focus:outline-none focus:ring-2 ${theme === "light" ? "focus:ring-blue-500" : "focus:ring-blue-400"} ${theme === "light" ? "bg-white" : "bg-gray-700"}`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-3 rounded-lg font-semibold ${loading ? "bg-blue-300" : theme === "light" ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"} text-white transition-colors`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <span className="text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className={`font-semibold ${theme === "light" ? "text-blue-600 hover:text-blue-800" : "text-blue-400 hover:text-blue-300"} transition-colors`}
              >
                Signup
              </Link>
            </span>
            <span className="block text-sm mt-2">
              Forgot your password?{" "}
              <Link
                to="/reset-password-token"
                className={`font-semibold ${theme === "light" ? "text-blue-600 hover:text-blue-800" : "text-blue-400 hover:text-blue-300"} transition-colors`}
              >
                Reset Password
              </Link>
            </span>
          </div>
        </form>
        <div className="mt-6 text-center">
          <GoogleAuthWrapper>
            <GoogleLogin />
          </GoogleAuthWrapper>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

Login.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
  GoogleAuthWrapper: PropTypes.func,
};

export default Login;