import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { handleError, handleSuccess } from '../utils/utils';
import { ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const location = useLocation(); // Access query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Extract token from query params
  const email = queryParams.get('email'); // Extract email from query params

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [theme, setTheme] = useState('dark'); // Default theme is dark

  const navigate = useNavigate();

  // Toggle theme between dark and light
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  // Apply theme class to the root element
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(password, confirmPassword, token, email);
      if (response.success) {
        handleSuccess(response.message);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        handleError(response.message);
      }
    } catch (err) {
      handleError(`An error occurred. Please try again. ${err}`);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-colors duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}>
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-2 rounded-full focus:outline-none ${theme === 'light' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </button>

      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Set New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              New Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md font-semibold ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            Reset Password
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPassword;