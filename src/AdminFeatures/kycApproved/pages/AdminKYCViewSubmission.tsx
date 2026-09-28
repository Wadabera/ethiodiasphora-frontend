// features/kyc/admin/pages/AdminKYCViewSubmission.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminKYCViewSubmission: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">KYC Submission Details</h1>
      <p className="text-gray-300 mb-6">Review KYC submission documents and identity proofs.</p>
      <button
        onClick={() => navigate("/admin/kycApproved")}
        className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg transition"
      >
        ← Back to KYC Approvals
      </button>
    </div>
  );
};

export default AdminKYCViewSubmission;
