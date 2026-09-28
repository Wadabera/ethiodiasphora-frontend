// BusinessOwnerFeatures/kyc/pages/BusinessKYCSubmit.tsx
import React from "react";
import Kyc from "../components/Kyc";
import { Link } from "react-router-dom";

const BusinessKYCSubmit: React.FC = () => {
  return (
    <div className="p-6 text-white min-h-screen">
      {/* Navigation Header */}
      <Kyc />

      {/* Main Container */}
      <div className="bg-gray-800/80 rounded-xl shadow border border-gray-700 p-8 max-w-2xl mx-auto text-center mt-6">
        <h2 className="text-2xl font-bold text-yellow-500 mb-4">Complete Business KYC</h2>
        <p className="text-gray-300 mb-6">
          Submit your official company details and tiered KYC verification (Basic, Intermediate, Advanced) directly through our unified KYC portal.
        </p>
        <Link
          to="/business/kyc"
          className="inline-block px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl transition"
        >
          Go to Multi-Tier KYC Form →
        </Link>
      </div>
    </div>
  );
};

export default BusinessKYCSubmit;
