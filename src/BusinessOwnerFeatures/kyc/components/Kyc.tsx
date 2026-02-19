// BusinessOwnerFeatures/kyc/components/Kyc.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Kyc: React.FC = () => {
  const location = useLocation();
  const isSubmitPage = location.pathname.includes("/kyc/submit");
  const isStatusPage = location.pathname.includes("/kyc") && !isSubmitPage;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">KYC Verification</h1>
          <p className="text-gray-600">
            Verify your business to post investments
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            to="/business/kyc"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isStatusPage
                ? "bg-black text-yellow-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            KYC Status
          </Link>
          <Link
            to="/business/kyc/submit"
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isSubmitPage
                ? "bg-black text-yellow-500"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Submit KYC
          </Link>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-6 flex items-center">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isStatusPage
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>
          <div
            className={`ml-2 text-sm ${
              isStatusPage ? "text-black font-medium" : "text-gray-500"
            }`}
          >
            Check Status
          </div>
        </div>

        <div className="w-12 h-0.5 bg-gray-300 mx-2"></div>

        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isSubmitPage
                ? "bg-yellow-500 text-black"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>
          <div
            className={`ml-2 text-sm ${
              isSubmitPage ? "text-black font-medium" : "text-gray-500"
            }`}
          >
            Submit/Resubmit
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kyc;
