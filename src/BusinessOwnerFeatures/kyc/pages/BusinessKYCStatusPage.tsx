// BusinessOwnerFeatures/kyc/pages/BusinessKYCStatusPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinessKYCStatus } from "../slices/kycBusinessSlice";
import Kyc from "../components/Kyc";
import BusinessKYCStatus from "../components/BusinessKYCStatus";

const BusinessKYCStatusPage: React.FC = () => {
  const dispatch = useDispatch();
  const { kycStatus, loading, error } = useSelector(
    (state: any) => state.kyc.business,
  );

  useEffect(() => {
    dispatch(fetchBusinessKYCStatus());
  }, [dispatch]);

  return (
    <div className="p-6">
      {/* Navigation Header */}
      <Kyc />

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BusinessKYCStatus kycData={kycStatus} loading={loading} />
      </div>

      {/* Info Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-black mb-3 flex items-center gap-2">
            <span className="text-yellow-600">📋</span> Why KYC is Required
          </h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Compliance with financial regulations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Build trust with potential investors</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></span>
              <span>Required to post investment opportunities</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="font-bold text-black mb-3 flex items-center gap-2">
            <span className="text-gray-600">⏱️</span> Processing Time
          </h3>
          <p className="text-sm text-gray-700 mb-3">
            KYC verification typically takes <strong>24-48 hours</strong> after
            submission.
          </p>
          <div className="text-xs text-gray-500">
            <p>• You'll receive email notifications for status updates</p>
            <p>• Support: kyc-support@ethiodiaspora.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessKYCStatusPage;
