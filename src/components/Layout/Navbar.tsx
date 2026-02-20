// components/Layout/Navbar.tsx
import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800 bg-black">
      {/* Logo - Click to go to Home */}
      <Link to="/" className="flex items-center cursor-pointer">
        <div className="text-2xl font-bold font-montserrat tracking-wider">
          <span className="bg-[#FFD700] rounded-lg p-3 text-3xl text-[#1A1A1A]">
            ET
          </span>
          <span className="text-[#FFD700] text-sm ml-2">EthioDiaspora</span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div className="flex gap-4">
        {/* Hub - Goes to MarketExchange */}
        <Link to="/market-exchange">
          <button className="bg-[#1A1A1A] text-[#FFD700] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFD700] hover:text-[#000000]">
            Hub
          </button>
        </Link>

        {/* Invest Now - Goes to Investment Opportunities */}
        <Link to="/invest">
          <button className="bg-[#1A1A1A] text-[#FFD700] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFD700] hover:text-[#000000]">
            Invest now
          </button>
        </Link>

        {/* View Market - Goes to MarketExchange */}
        <Link to="/market-exchange">
          <button className="bg-[#1A1A1A] text-[#FFD700] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFD700] hover:text-[#000000]">
            View Market
          </button>
        </Link>

        {/* NEW: Send Money - Goes to Remittance */}
            {/* <Link to="/send-money">
              <button className="bg-[#FFD700] text-[#1A1A1A] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#000000] hover:text-[#FFD700]">
                Send Money
              </button>
            </Link> */}
        <Link to="/send-money">
          <button className="bg-[#1A1A1A] text-[#FFD700] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFD700] hover:text-[#000000]">
            Send Money
          </button>
        </Link>

        {/* Login Button */}
        <Link to="/login">
          <button className="bg-[#1A1A1A] text-[#FFD700] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#FFD700] hover:text-[#000000]">
            Login
          </button>
        </Link>

        {/* Get Started - Goes to Register */}
        <Link to="/register">
          <button className="bg-[#FFD700] text-[#1A1A1A] font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-[#000000] hover:text-[#FFD700]">
            Get Started
          </button>
        </Link>
      </div>
    </nav>
  );
}
