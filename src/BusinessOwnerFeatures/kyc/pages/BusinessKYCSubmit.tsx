// BusinessOwnerFeatures/kyc/pages/BusinessKYCSubmit.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { submitBusinessKYC } from "../slices/kycBusinessSlice";
import Kyc from "../components/Kyc";
import BusinessKYCForm from "../components/BusinessKYCForm";

const BusinessKYCSubmit: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { submitting, error } = useSelector((state: any) => state.kyc.business);
  const user = useSelector((state: any) => state.auth.user);

  const handleSubmit = async (formData: any) => {
    try {
      // Add user info to form data
      const kycData = {
        ...formData,
        userId: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: "local_business",
        level: "basic", // Starting with basic level
      };

      await dispatch(submitBusinessKYC(kycData)).unwrap();

      // Navigate back to status page on success
      navigate("/business/kyc", {
        state: {
          message:
            "KYC submitted successfully! It will be reviewed within 24-48 hours.",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to submit KYC:", err);
    }
  };

  // Pre-fill with user data if available
  const initialData = {
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    fullName:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : "",
  };

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

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <BusinessKYCForm
          onSubmit={handleSubmit}
          initialData={initialData}
          isSubmitting={submitting}
        />
      </div>

      {/* Help Section */}
      <div className="mt-8 p-6 bg-black text-yellow-500 rounded-xl">
        <h3 className="font-bold text-lg mb-4">⚠️ Important Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Required Documents:</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Business Registration Certificate
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Tax Identification Certificate
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Valid ID (Passport/National ID)
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Tips for Faster Approval:</h4>
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Ensure all documents are clear and readable
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Documents should be less than 6 months old
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Double-check all information for accuracy
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessKYCSubmit;
