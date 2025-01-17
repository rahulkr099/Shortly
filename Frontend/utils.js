import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// Function to handle success messages
export const handleSuccess = (message) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000, // Auto close after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };


// Function to handle errors
export const handleError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000, // Auto close after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
};
