// features/kyc/admin/pages/AdminKYCDashboard.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const AdminKYCDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-yellow-500">Admin KYC Dashboard</h1>
      <p className="text-gray-300 mb-6">Review and manage user KYC submissions and verification status.</p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/kycApproved")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold p-4 rounded-xl transition shadow"
        >
          ⏳ Review Approvals
        </button>
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-gray-800 hover:bg-gray-700 text-white font-semibold p-4 rounded-xl border border-gray-700 transition"
        >
          👥 View All Users
        </button>
      </div>
    </div>
  );
};

export default AdminKYCDashboard;
