import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AdminIPOTable } from "../components/AdminIPOTable";
import { AdminIPODetailsModal } from "../components/AdminIPODetailsModal";
import { AdminApproveIPOForm } from "../components/AdminApproveIPOForm";
import { AdminRejectIPOForm } from "../components/AdminRejectIPOForm";
import { AdminIPOStatsCards } from "../components/AdminIPOStatsCards";
import {
  fetchPendingIPOs,
  // fetchAdminIPOStats,
  fetchIPODetails,
  approveIPO,
  rejectIPO,
  setFilters,
  clearSelectedIPO,
  clearActionStates,
} from "../slice/adminIPOSlice";
import type { AdminIPO } from "../types/adminIPOtypes";
import type { RootState } from "@/store/store";

export const AdminIPOPendingPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<AdminIPO | null>(null);

  const {
    ipos,
    loading,
    pagination,
    selectedIPO: detailsIPO,
    stats,
    statsLoading,
    filters,
    actionLoading,
    actionSuccess,
    actionError,
  } = useSelector((state: RootState) => state.adminIPO);

  useEffect(() => {
    dispatch(fetchPendingIPOs(filters) as any);
    dispatch(fetchAdminIPOStats() as any);
  }, [dispatch, filters]);

  useEffect(() => {
    if (detailsIPO) {
      setSelectedIPO(detailsIPO);
    }
  }, [detailsIPO]);

  useEffect(() => {
    if (actionSuccess) {
      setShowApprove(false);
      setShowReject(false);
      dispatch(clearActionStates());
      dispatch(fetchPendingIPOs(filters) as any);
      dispatch(fetchAdminIPOStats() as any);
    }
  }, [actionSuccess, dispatch, filters]);

  useEffect(() => {
    if (actionError) {
      // Toast would be shown here
      console.error(actionError);
    }
  }, [actionError]);

  const handleViewDetails = (ipo: AdminIPO) => {
    dispatch(fetchIPODetails(ipo._id) as any);
    setShowDetails(true);
  };

  const handleApprove = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowApprove(true);
  };

  const handleReject = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowReject(true);
  };

  const handleApproveSubmit = (data: { notes: string }) => {
    if (selectedIPO) {
      dispatch(
        approveIPO({
          ipoId: selectedIPO._id,
          notes: data.notes,
          approved: true,
        }) as any,
      );
    }
  };

  const handleRejectSubmit = (data: { reason: string; notes?: string }) => {
    if (selectedIPO) {
      dispatch(
        rejectIPO({
          ipoId: selectedIPO._id,
          reason: data.reason,
          notes: data.notes,
        }) as any,
      );
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters({ ...newFilters, status: "pending_approval" }));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page, status: "pending_approval" }));
  };

  const pendingCount = ipos.length;

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Tabs */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#FFD700]">
              IPO Approval Queue
            </h1>
            <button
              onClick={() => navigate("/admin/ipo/all")}
              className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800"
            >
              View All IPOs
            </button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 border-b border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => navigate("/admin/ipo/pending")}
              className="py-2 px-1 border-b-2 border-[#FFD700] text-[#FFD700] font-medium text-sm"
            >
              Pending Approval ({pendingCount})
            </button>
            <button
              onClick={() => navigate("/admin/ipo/all?status=announced")}
              className="py-2 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium text-sm"
            >
              Announced
            </button>
            <button
              onClick={() => navigate("/admin/ipo/all?status=open")}
              className="py-2 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium text-sm"
            >
              Open
            </button>
            <button
              onClick={() => navigate("/admin/ipo/all?status=rejected")}
              className="py-2 px-1 border-b-2 border-transparent text-gray-400 hover:text-gray-300 font-medium text-sm"
            >
              Rejected
            </button>
          </nav>
        </div>

        {/* Stats */}
        <AdminIPOStatsCards stats={stats} loading={statsLoading} />

        {/* Pending Alert */}
        {pendingCount > 0 && (
          <div className="bg-yellow-900/30 border border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⏳</span>
              <div>
                <p className="text-yellow-400 font-medium">
                  {pendingCount} IPO{pendingCount !== 1 ? "s" : ""} pending your
                  review
                </p>
                <p className="text-sm text-yellow-500/70">
                  Average response time target: 24 hours
                </p>
              </div>
            </div>
          </div>
        )}

        {/* IPOs Table */}
        <AdminIPOTable
          ipos={ipos}
          loading={loading}
          onViewDetails={handleViewDetails}
          onApprove={handleApprove}
          onReject={handleReject}
          showActions={true}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Modals */}
        {showDetails && selectedIPO && (
          <AdminIPODetailsModal
            ipo={selectedIPO}
            isOpen={showDetails}
            onClose={() => {
              setShowDetails(false);
              dispatch(clearSelectedIPO());
            }}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {showApprove && selectedIPO && (
          <AdminApproveIPOForm
            ipo={selectedIPO}
            onSubmit={handleApproveSubmit}
            onCancel={() => setShowApprove(false)}
            loading={actionLoading}
          />
        )}

        {showReject && selectedIPO && (
          <AdminRejectIPOForm
            ipo={selectedIPO}
            onSubmit={handleRejectSubmit}
            onCancel={() => setShowReject(false)}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};
