// features/kyc/admin/pages/AdminKYCDashboard.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKYCSummary, fetchPendingKYC } from "../slices/kycAdminSlice";
import AdminKYCStats from "../components/AdminKYCStats";
import AdminKYCTable from "../components/AdminKYCTable";
import { useNavigate } from "react-router-dom";

const AdminKYCDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { summary, pendingSubmissions, loading } = useSelector(
    (state: any) => state.kycAdmin,
  );

  useEffect(() => {
    dispatch(fetchKYCSummary());
    dispatch(fetchPendingKYC());
  }, [dispatch]);

  if (loading) return <div>Loading admin dashboard...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin KYC Dashboard</h1>

      {/* Stats Cards */}
      <AdminKYCStats summary={summary} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/kyc/pending")}
          className="bg-yellow-500 text-white p-4 rounded-lg hover:bg-yellow-600"
        >
          ⏳ Review Pending ({summary?.pendingCount || 0})
        </button>
        <button
          onClick={() => navigate("/admin/kyc/all")}
          className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600"
        >
          📋 All Submissions ({summary?.totalSubmissions || 0})
        </button>
        <button
          onClick={() => navigate("/admin/kyc/rejected")}
          className="bg-red-500 text-white p-4 rounded-lg hover:bg-red-600"
        >
          ❌ Rejected ({summary?.rejectedCount || 0})
        </button>
      </div>

      {/* Recent Pending Submissions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">
          Recent Pending Submissions
        </h2>
        <AdminKYCTable submissions={pendingSubmissions.slice(0, 5)} />
        {pendingSubmissions.length > 5 && (
          <button
            onClick={() => navigate("/admin/kyc/pending")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            View all {pendingSubmissions.length} pending →
          </button>
        )}
      </div>
    </div>
  );
};
