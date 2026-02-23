// src/components/Layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";

export default function MarketNavbar() {
  const handleDownloadApp = () => {
    // Detect if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.open(
          "https://apps.apple.com/app/ethio-diaspora/id123456789",
          "_blank",
        );
      } else if (/Android/i.test(navigator.userAgent)) {
        window.open(
          "https://play.google.com/store/apps/details?id=com.ethiodiaspora.app",
          "_blank",
        );
      }
    } else {
      // On desktop, open play store
      window.open(
        "https://play.google.com/store/apps/details?id=com.ethiodiaspora.app",
        "_blank",
      );
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800 bg-gray-900">
      {/* Logo */}
      <Link to="/" className="flex items-center cursor-pointer">
        <div className="text-2xl font-bold font-montserrat tracking-wider">
          <span className="bg-yellow-500 rounded-lg p-3 text-3xl text-gray-900">
            ET
          </span>
          <span className="text-yellow-500 text-sm ml-2">EthioDiaspora</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-4">
        <Link to="/market-exchange">
          <button className="bg-gray-800 text-yellow-500 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-gray-900">
            Hub
          </button>
        </Link>

        <Link to="/invest">
          <button className="bg-gray-800 text-yellow-500 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-gray-900">
            Invest now
          </button>
        </Link>

        <Link to="/currency">
          <button className="bg-gray-800 text-yellow-500 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-gray-900">
            Currency
          </button>
        </Link>

        <Link to="/send-money">
          <button className="bg-gray-800 text-yellow-500 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-gray-900">
            Send Money
          </button>
        </Link>

        {/* Download App Button */}
        <button
          onClick={handleDownloadApp}
          className="bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-400 flex items-center gap-2"
        >
          <Smartphone className="w-4 h-4" />
          Download App
        </button>

        <Link to="/login">
          <button className="bg-gray-800 text-yellow-500 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-500 hover:text-gray-900">
            Login
          </button>
        </Link>

        <Link to="/register">
          <button className="bg-yellow-500 text-gray-900 font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-yellow-400">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
