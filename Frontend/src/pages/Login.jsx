import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { handleError, handleSuccess } from "../../utils";
import PropTypes from 'prop-types'
import GoogleLogin from "./GoogleLogin";

function Login({ setIsAuthenticated, GoogleAuthWrapper }) {
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false); // Loading state for better UX
  const navigate = useNavigate();

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

    setLoading(true); // Set loading state

    try {
      const response = await fetch("http://localhost:4000/api/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", },
          credentials: 'include', //Include cookies in the request
          body: JSON.stringify(loginInfo),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        const { accessToken, user } = result;
        handleSuccess(result.message);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("loggedInUser", user.email);
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
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-4 text-xl flex flex-col justify-center items-center h-screen bg-gradient-to-r from-violet-400 to-fuchsia-400">
      <h1 className="text-3xl text-center underline mb-4">Login Page</h1>
      <div className="m-4 border-2 p-4 border-purple-400 rounded-xl shadow-2xl bg-purple-300 backdrop-filter backdrop-blur-lg bg-opacity-50">
        <form
          className="flex flex-col justify-center items-start"
          onSubmit={handleLogin}
        >
          <div className="mb-4 w-full">
            <label
              className="text-xl block mb-2"
              htmlFor="email"
            >
              Email:
            </label>

            <input
              className="w-96 p-2 border-2 border-orange-400 rounded-lg outline-blue-400 placeholder:text-xl bg-slate-300 placeholder:text-slate-800"
              onChange={handleChange}
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={loginInfo.email}
              autoComplete="email"
              required
            />
          </div>
          <div className="mb-4 w-full">
            <label
              className="text-xl block mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="w-96 p-2 border-2 border-orange-400 rounded-lg outline-blue-400 placeholder:text-xl bg-slate-300 placeholder:text-slate-800"
              onChange={handleChange}
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="w-full text-center">
            <button
              className="text-xl bg-green-400 p-2 rounded-lg  text-black hover:text-white w-40"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
          <span className="mt-4 text-center block">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-700 hover:text-white transition"
            >
              Signup
            </Link>
          </span>
          <span>
            Don’t know the password?
            <Link
              to='/reset-password-token'
              className="text-blue-700 hover:text-white transition"
            >Forgot Password</Link>
          </span>
        </form>
        <div className="text-center">
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
