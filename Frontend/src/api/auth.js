import {BASEURL} from '../utils/constants'
export const requestResetPassword = async (email) => {
  const response = await fetch(`${BASEURL}/reset-password-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include', //Include cookies
    body: JSON.stringify({ email }),
  });
  return response.json();
};

export const resetPassword = async (password, confirmPassword, token, email) => {
  const response = await fetch(`${BASEURL}/reset-password?token=${token}&email=${email}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmPassword, email }),
    credentials: 'include', // Include cookies
  });
  return response.json();
};
