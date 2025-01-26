import { useEffect, useState } from "react";
import { FaDownload, FaShareAlt } from "react-icons/fa";
import {URL} from '../utils/constants'
import PropTypes from 'prop-types';

const QRCodeGenerator = ({ url }) => {
  const [qrCode, setQrCode] = useState("");

  const generateQRCode = async (url) => {
    if (!url) {
      alert("Please enter a URL!");
      return;
    }
    try {
      const response = await fetch(`${URL}/url/generate-qr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ url }),
      });
      if (response.ok) {
        const data = await response.json();
        setQrCode(data.qrCode); // Assuming backend sends a base64-encoded QR code
      } else {
        console.error("Failed to generate QR code");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    const fetchQRCode = async () => {
      await generateQRCode(url);
    };

    if (url) {
      fetchQRCode();
    }
  }, [url]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrcode.png";
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "QR Code",
          text: "Scan this QR Code!",
          url: qrCode,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      console.log("Navigator share not supported. Showing fallback.");
      const fallbackMessage =
        "Sharing is not supported on this browser. You can copy the QR code link and share it manually.";
      alert(fallbackMessage);
    }
  };

  return (
    <div className="text-start mt-12 p-4">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        QR Code Generated
      </h1>

      {/* QR Code Container */}
      <div className="relative inline-block mt-2.5">
        {qrCode && (
          <>
            {/* QR Code Image */}
            <img
              src={qrCode}
              alt="QR Code"
              className="block w-64 h-64 rounded-lg shadow-lg border-2 border-gray-200 dark:border-gray-600"
            />

            {/* Overlay with Buttons */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg">
              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="mx-2.5 p-2.5 bg-white hover:bg-blue-200 rounded-full cursor-pointer flex items-center justify-center shadow-md transition-colors"
              >
                <FaDownload className="text-xl text-gray-800" />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="mx-2.5 p-2.5 bg-white hover:bg-blue-200 rounded-full cursor-pointer flex items-center justify-center shadow-md transition-colors"
              >
                <FaShareAlt className="text-xl text-gray-800" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
QRCodeGenerator.propTypes = {
  url: PropTypes.string.isRequired,
  
};
export default QRCodeGenerator;