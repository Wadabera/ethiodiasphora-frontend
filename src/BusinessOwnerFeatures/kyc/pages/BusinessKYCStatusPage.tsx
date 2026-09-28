// BusinessOwnerFeatures/kyc/pages/BusinessKYCStatusPage.tsx
import React from "react";
import Kyc from "../components/Kyc";
import { Link } from "react-router-dom";

const BusinessKYCStatusPage: React.FC = () => {
  return (
    <div className="p-6">
      {/* Navigation Header */}
      <Kyc />

      {/* Main Content */}
      <div className="bg-gray-800/80 rounded-xl shadow-sm border border-gray-700 p-6 text-white">
        <h2 className="text-xl font-semibold mb-3 text-yellow-500">Business KYC Verification</h2>
        <p className="text-gray-300 mb-6">
          Submit your business verification documents to unlock investment opportunities, project listings, and IPO management.
        </p>
        <Link
          to="/business/kyc"
          className="inline-block px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition"
        >
          Complete KYC Verification →
        </Link>
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-white">
          <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
            <span>📋</span> Why KYC is Required
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Compliance with national financial regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Build verified trust with potential diaspora investors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Required to launch public IPOs and investment listings</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-white">
          <h3 className="font-bold text-gray-200 mb-3 flex items-center gap-2">
            <span>⏱️</span> Processing Time
          </h3>
          <p className="text-sm text-gray-300 mb-3">
            KYC verification is typically reviewed rapidly once submitted.
          </p>
          <div className="text-xs text-gray-400">
            <p>• Fast admin review in Admin Portal</p>
            <p>• Support: support@ethiodiaspora.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessKYCStatusPage;
