import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState,useEffect } from 'react';
import { handleError, handleSuccess } from '../../utils';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' });
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, role } = signupInfo;

    if (!firstName || !lastName || !email || !password || !role) {
      return handleError('All fields are required');
    }

    try {
      const url = 'http://localhost:4000/api/v1/signup';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      const { success, message, errors } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate('/login'), 1000);
      } else if (errors) {
        handleError(errors?.[0] || message);
      } else if (!success) {
        handleError(message);
      }
    } catch (err) {
      handleError(`Something went wrong. Please try again. ${err}`);
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

      <h1 className={`text-4xl font-bold mb-8 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>Signup</h1>
      <div className={`w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
        <form onSubmit={handleSignup} className='space-y-6'>
          {/* First Name */}
          <div>
            <label htmlFor='firstName' className='block text-sm font-medium mb-1'>
              First Name:
            </label>
            <input
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              onChange={handleChange}
              id='firstName'
              type='text'
              name='firstName'
              placeholder='John'
              value={signupInfo.firstName}
              autoFocus
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor='lastName' className='block text-sm font-medium mb-1'>
              Last Name:
            </label>
            <input
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              onChange={handleChange}
              id='lastName'
              type='text'
              name='lastName'
              placeholder='Doe'
              value={signupInfo.lastName}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block text-sm font-medium mb-1'>
              Email:
            </label>
            <input
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              onChange={handleChange}
              id='email'
              type='email'
              name='email'
              placeholder='example@mail.com'
              value={signupInfo.email}
              autoComplete='email'
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium mb-1'>
              Password:
            </label>
            <input
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${theme === 'light' ? 'border-gray-300 focus:ring-blue-500 bg-white' : 'border-gray-600 focus:ring-blue-400 bg-gray-700'}`}
              onChange={handleChange}
              id='password'
              type='password'
              name='password'
              placeholder='At least 6 characters'
              value={signupInfo.password}
              autoComplete='current-password'
              required
            />
          </div>

          {/* Role Selection */}
          <div>
            <h5 className='block text-sm font-medium mb-2'>Role:</h5>
            <div className='flex space-x-4'>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='role'
                  id='user'
                  value='user'
                  onChange={handleChange}
                  checked={signupInfo.role === 'user'}
                  className='mr-2'
                />
                User
              </label>
              <label className='flex items-center'>
                <input
                  type='radio'
                  name='role'
                  id='admin'
                  value='admin'
                  onChange={handleChange}
                  checked={signupInfo.role === 'admin'}
                  className='mr-2'
                />
                Admin
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className='w-full text-center'>
            <button
              type='submit'
              className={`w-full py-2 px-4 rounded-md font-semibold ${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            >
              Signup
            </button>
          </div>

          {/* Login Link */}
          <div className='text-center'>
            <span className='text-sm'>
              Already have an account?{' '}
              <Link
                to='/login'
                className={`font-semibold ${theme === 'light' ? 'text-blue-600 hover:text-blue-800' : 'text-blue-400 hover:text-blue-300'}`}
              >
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Signup;