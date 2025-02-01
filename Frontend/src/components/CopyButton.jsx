import { useState } from "react";
import { Copy, Check } from "lucide-react";
import PropTypes from 'prop-types';

const CopyButton = ({ text, theme = "light" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded-md relative ${
        theme === "light" ? "bg-gray-200 hover:bg-gray-300" : "bg-gray-600 hover:bg-gray-500"
      }`}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      {copied && (
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-black text-white px-2 py-1 rounded">
          Copied!
        </span>
      )}
    </button>
  );
};
CopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  theme: PropTypes.oneOf(["dark", "light"]).isRequired,
}
export default CopyButton;
