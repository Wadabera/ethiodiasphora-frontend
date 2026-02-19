// import React from "react";
import { Link } from "react-router-dom";
export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-6 border-b border-gray-800">
      <div className="text-2xl font-bold font-montserrat tracking-wider">
        <span className="bg-[#FFD700] rounded-lg p-3 text-3xl text-[#1A1A1A]  ">
          ET
        </span>
        <span className="text-[#FFD700] text-sm ml-2">EthioDiaspora</span>
      </div>
      <div className="flex gap-4">
        <Link to="/login">
          <button className=" bg-[#1A1A1A] text-[#FFD700]  font-semibold py-2 px-6 rounded-lg transition-all duration-300; hover:bg-[#FFD700] hover:text-[#000000] hover:border-0">
            Hub
          </button>
        </Link>
        <Link to="/login">
          <button className=" bg-[#1A1A1A] text-[#FFD700]  font-semibold py-2 px-6 rounded-lg transition-all duration-300; hover:bg-[#FFD700] hover:text-[#000000] hover:border-0">
            Invest now
          </button>
        </Link>
        <Link to="/login">
          <button className=" bg-[#1A1A1A] text-[#FFD700]  font-semibold py-2 px-6 rounded-lg transition-all duration-300; hover:bg-[#FFD700] hover:text-[#000000] hover:border-0">
            View Market
          </button>
        </Link>

        <Link to="/login">
          <button className="btn-dark">Login</button>
        </Link>
        <Link to="/register">
          <button className="btn-gold">Get Started</button>
        </Link>
      </div>
    </nav>
  );
}
