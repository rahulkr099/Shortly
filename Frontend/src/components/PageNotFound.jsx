import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      {/* 404 Heading */}
      <h1 className="text-6xl font-bold text-red-500 dark:text-red-400 mb-4">
        404
      </h1>
      <h2 className="text-3xl font-semibold mb-8">Page Not Found</h2>

      {/* Description */}
      <p className="text-lg text-center text-gray-700 dark:text-gray-300 mb-8">
        Oops! The page you are looking for does not exist or has been moved.
      </p>

      {/* Back to Login Button */}
      <button
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/login')}
      >
        Go to Login
      </button>
    </div>
  );
};

export default PageNotFound;