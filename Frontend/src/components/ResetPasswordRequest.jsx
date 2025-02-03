import { useState, useContext } from 'react';
import { requestResetPassword } from '../api/auth';
import { ToastContainer } from 'react-toastify';
import { ThemeContext } from '../hooks/ThemeContext';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const {theme} = useContext(ThemeContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await requestResetPassword(email);
      if (response.success) {
        setMessage(response.message);
        setError('');
      } else {
        setError(response.message);
        setMessage('');
      }
    } catch (err) {
      setError(`An error occurred. Please try again. ${err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col justify-center items-center transition-colors duration-300 ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-gray-100'}`}>

      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <h1 className={`text-3xl font-bold mb-6 text-center ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Reset Password</h1>

        {/* Display Messages */}
        {message && (
          <p className={`text-center text-lg mb-4 ${theme === 'light' ? 'text-green-600' : 'text-green-400'}`}>
            {message}
          </p>
        )}
        {error && (
          <p className={`text-center text-lg mb-4 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}`}>
            {error}
          </p>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              autoComplete="email"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-md font-semibold ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'} disabled:opacity-50`}
          >
            {loading ? 'Please Wait...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResetPasswordRequest;