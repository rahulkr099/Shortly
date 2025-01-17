import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useState } from 'react';
import { handleError, handleSuccess } from '../../utils';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({ firstName: '', lastName: '', email: '', password: '', role: '' });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, role } = signupInfo;

    if (!firstName || !lastName || !email || !password, !role) {
      return handleError('All fields are required');
    }

    try {
      const url = "http://localhost:4000/api/v1/signup"
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      // console.log('result :',result)
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
    <div className='text-2xl p-4 flex flex-col h-screen justify-center items-center bg-auto bg-no-repeat bg-center bg-[url("/7639.jpg")]'>
      <h1 className='text-3xl underline text-center'>Signup</h1>
      <div>
        <form onSubmit={handleSignup} className='flex flex-col justify-center items-start border-2 border-blue-400 m-4 p-6 rounded-lg shadow-2xl bg-gradient-to-r from-sky-400 to-indigo-300'>
          <div className='flex flex-col'>
            <label htmlFor='firstName' id='firstName-label'>First Name:</label>
            <input
              className='outline-blue-400 mt-1 mb-3 placeholder:text-2xl p-1 border-2 border-orange-400 rounded-lg'
              onChange={handleChange}
              id='firstName'
              type='text'
              name='firstName'
              aria-labelledby='firstName-label'
              autoFocus
              placeholder='John'
              value={signupInfo.firstName}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='lastName' id='lastName-label'>Last Name:</label>
            <input
              className='outline-blue-400 mt-1 mb-3 placeholder:text-2xl p-1 border-2 border-orange-400 rounded-lg'
              onChange={handleChange}
              id='lastName'
              type='text'
              name='lastName'
              aria-labelledby='lastName-label'

              placeholder='Doe'
              value={signupInfo.lastName}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='email' id='email-label'>Email</label>
            <input
              className='outline-blue-400 mt-1 mb-3 placeholder:text-2xl p-1 border-2 border-orange-400 rounded-lg'
              onChange={handleChange}
              id='email'
              type='email'
              name='email'
              aria-labelledby='email-label'

              autoComplete='email'
              placeholder='example@mail.com'
              value={signupInfo.email}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor='password' id='password-label'>Password</label>
            <input
              className='outline-blue-400 mt-1 mb-2 placeholder:text-2xl p-1 border-2 border-orange-400 rounded-lg'
              onChange={handleChange}
              id='password'
              type='password'
              name='password'
              aria-labelledby='password-label'

              autoComplete='current-password'
              placeholder='At least 6 characters'
              value={signupInfo.password}
            />
          </div>
          <div>
            <h5>Role: </h5>
            <input
              type="radio"
              name="role"
              id="user"
              value="user"
              onChange={handleChange}
              checked={signupInfo.role === 'user'}
            />
            <label htmlFor="user"> User </label>
            <input
              type="radio"
              name="role"
              id="admin"
              value="admin"
              onChange={handleChange}
              checked={signupInfo.role === 'admin'}
            />
            <label htmlFor="admin"> Admin </label>
          </div>

          <div className='w-full text-center'>
            <button type='submit' className='text-white m-1 border border-green-400 rounded-lg p-1 bg-green-400 hover:text-black'>Signup</button>
          </div>
          <span>Already Have an account?
            <Link to='/login' className='hover:text-white'> Login</Link>
          </span>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}
export default Signup;
