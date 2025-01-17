import { useState } from 'react';
import { useLocation, useNavigate} from 'react-router-dom';
import { resetPassword } from '../api/auth';
import { handleError, handleSuccess } from '../../utils';
import { ToastContainer } from 'react-toastify';

const ResetPassword = () => {
  const location = useLocation(); // Access query parameters from the URL
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token'); // Extract token from query params
  const email = queryParams.get('email'); // Extract email from query params

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  // console.log('token in frontend:',token,'email in frontend:',email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await resetPassword(password, confirmPassword, token, email);
      if (response.success) {
        handleSuccess(response.message)
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
    <div className="container mx-auto p-4 bg-slate-400">
      <h1 className="text-2xl font-bold mb-4">Set New Password</h1>
      {/* {message && <p className="text-green-600">{message}</p>} */}
      {/* {error && <p className="text-red-600">{error}</p>} */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">New Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <div>
          <label className="block font-semibold">Confirm Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default ResetPassword;
