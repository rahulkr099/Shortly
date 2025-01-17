import { useState } from 'react';
import { requestResetPassword } from '../api/auth';
import { ToastContainer } from 'react-toastify';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await requestResetPassword(email);
      // console.log('response in reset token',response);
      if (response.success) {
        setMessage(response.message);
        setError('');
      } else {
        setError(response.message);
        setMessage('');
      }
    } catch (err) {
      setError(`An error occurred. Please try again. ${err}`);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-slate-400">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
       {message && <p className="text-green-500 text-3xl">{message}</p>} 
       {error && <p className="text-red-500 text-3xl">{error}</p>} 
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold" htmlFor='email'>Email:</label>
          <input
            type="email"
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full"
            autoComplete='email'
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {loading? 'Please Wait...':'Send Reset Link'}
        </button>
      </form>
      <ToastContainer/>
    </div>
  );
};

export default ResetPasswordRequest;
