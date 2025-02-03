import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../hooks/ThemeContext';

function ThemeToggleButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isChecked, setIsChecked] = useState(theme === 'dark');

  // Sync local state with context when theme changes
  useEffect(() => {
    setIsChecked(theme === 'dark');
  }, [theme]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    toggleTheme(); // Toggle the theme in context
  };

  return (
    <div>
      <label className="flex cursor-pointer select-none items-center w-16">
        <div className="relative right-6">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div
            className={`box block h-9 w-8 items-center text-xl p-1 rounded-md focus:outline-none transition duration-300 ${
              isChecked ? 'bg-black text-gray-800' : 'bg-gray-100  text-white'
            }`}
          >
            {isChecked ? '🌙' : '☀️'}
          </div>
        </div>
      </label>
    </div>
  );
}

export default ThemeToggleButton;
