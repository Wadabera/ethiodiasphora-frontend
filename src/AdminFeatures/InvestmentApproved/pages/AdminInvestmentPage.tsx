// AdminFeatures/InvestmentApproval/pages/AdminInvestmentPage.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import type { Investment } from "@/types/index";

import {
  fetchAdminInvestments,
  approveInvestment,
  rejectInvestment,
  publishInvestment,
  setFilters,
  clearError,
  clearSuccessMessage,
  updateInvestmentManually,
  updateStats,
} from "../slice/AdminInvestmentSlice";
import AdminInvestmentTable from "../components/AdminInvestmentTable";
import AdminRejectModal from "../components/AdminRejectModal";
import AdminInvestmentDetailModal from "../components/AdminInvestmentDetailModal";
import { CheckCircle, AlertCircle, RefreshCw, XCircle } from "lucide-react";

const AdminInvestmentPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    investments,
    filteredInvestments,
    fetchLoading,
    actionLoading,
    error,
    successMessage,
    stats,
    filters,
  } = useAppSelector((state) => state.adminInvestments);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] =
    useState<Investment | null>(null);
  const [localStats, setLocalStats] = useState(stats);

  // Normalize status function
  const normalizeStatus = useCallback((status: string): string => {
    if (!status) return "unknown";
    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "cancelled") return "rejected";
    return lowerStatus;
  }, []);

  // Calculate stats with normalized statuses
  const calculateStats = useCallback(
    (investmentList: Investment[]) => {
      return {
        total: investmentList.length,
        draft: investmentList.filter(
          (inv) => normalizeStatus(inv.status) === "draft",
        ).length,
        pending: investmentList.filter(
          (inv) => normalizeStatus(inv.status) === "pending",
        ).length,
        approved: investmentList.filter(
          (inv) => normalizeStatus(inv.status) === "approved",
        ).length,
        rejected: investmentList.filter((inv) => {
          const status = normalizeStatus(inv.status);
          return status === "rejected";
        }).length,
        published: investmentList.filter(
          (inv) => normalizeStatus(inv.status) === "published",
        ).length,
      };
    },
    [normalizeStatus],
  );

  // Fetch investments on mount
  useEffect(() => {
    dispatch(fetchAdminInvestments());
  }, [dispatch]);

  // Update stats whenever investments change
  useEffect(() => {
    if (investments.length > 0) {
      const newStats = calculateStats(investments);
      setLocalStats(newStats);
      dispatch(updateStats(newStats));
    }
  }, [investments, calculateStats, dispatch]);

  // Clear messages after timeout
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        if (error) dispatch(clearError());
        if (successMessage) dispatch(clearSuccessMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  const handleApprove = async (investment: Investment) => {
    const notes = prompt(
      `Enter approval notes for "${investment.title}" (optional):`,
      "Investment meets all requirements and is approved for publication.",
    );

    if (notes !== null) {
      try {
        // Optimistic update
        dispatch(
          updateInvestmentManually({
            id: investment._id,
            status: "approved",
          }),
        );

        // API call
        await dispatch(
          approveInvestment({
            id: investment._id,
            notes: notes || undefined,
          }),
        ).unwrap();

        // Refresh data after 1 second
        setTimeout(() => {
          dispatch(fetchAdminInvestments());
        }, 1000);

        // Close detail modal if open
        setDetailModalOpen(false);
      } catch (error) {
        console.error("Approval failed:", error);
        alert("Failed to approve investment. Please try again.");

        // Rollback optimistic update
        dispatch(
          updateInvestmentManually({
            id: investment._id,
            status: investment.status,
          }),
        );
      }
    }
  };

  const handleReject = (investment: Investment) => {
    setSelectedInvestment(investment);
    setRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedInvestment) return;

    try {
      console.log("Rejecting investment:", selectedInvestment._id);
      console.log("Reason:", reason);

      // Optimistic update - immediately show as rejected
      dispatch(
        updateInvestmentManually({
          id: selectedInvestment._id,
          status: "rejected",
        }),
      );

      // Update local stats optimistically - FIXED with type assertion
      const updatedInvestments = investments.map((inv) =>
        inv._id === selectedInvestment._id
          ? { ...inv, status: "rejected" as Investment["status"] }
          : inv,
      );
      const newStats = calculateStats(updatedInvestments);
      setLocalStats(newStats);
      dispatch(updateStats(newStats));

      // Make API call
      const result = await dispatch(
        rejectInvestment({
          id: selectedInvestment._id,
          reason,
        }),
      ).unwrap();

      console.log("Reject API success:", result);

      // Force refresh after 2 seconds
      setTimeout(() => {
        dispatch(fetchAdminInvestments());
      }, 2000);

      // Close modals
      setDetailModalOpen(false);
    } catch (error: any) {
      console.error("Reject API error:", error);

      // Show specific error message
      alert(`Rejection failed: ${error.message || error}`);

      // Rollback optimistic update
      dispatch(
        updateInvestmentManually({
          id: selectedInvestment._id,
          status: selectedInvestment.status,
        }),
      );

      // Rollback stats
      const rolledBackStats = calculateStats(investments);
      setLocalStats(rolledBackStats);
      dispatch(updateStats(rolledBackStats));
    } finally {
      setRejectModalOpen(false);
      setSelectedInvestment(null);
    }
  };

  const handlePublish = (investment: Investment) => {
    setSelectedInvestment(investment);
    setPublishModalOpen(true);
  };

  const handlePublishConfirm = async () => {
    if (selectedInvestment) {
      try {
        // Optimistic update
        dispatch(
          updateInvestmentManually({
            id: selectedInvestment._id,
            status: "published",
          }),
        );

        // Update local stats optimistically - FIXED with type assertion
        const updatedInvestments = investments.map((inv) =>
          inv._id === selectedInvestment._id
            ? { ...inv, status: "published" as Investment["status"] }
            : inv,
        );
        const newStats = calculateStats(updatedInvestments);
        setLocalStats(newStats);
        dispatch(updateStats(newStats));

        // API call
        await dispatch(publishInvestment(selectedInvestment._id)).unwrap();

        // Refresh data
        setTimeout(() => {
          dispatch(fetchAdminInvestments());
        }, 1000);

        // Close detail modal if open
        setDetailModalOpen(false);
      } catch (error) {
        console.error("Publish failed:", error);
        alert("Failed to publish investment. Please try again.");

        // Rollback optimistic update
        dispatch(
          updateInvestmentManually({
            id: selectedInvestment._id,
            status: selectedInvestment.status,
          }),
        );
      } finally {
        setPublishModalOpen(false);
        setSelectedInvestment(null);
      }
    }
  };

  // ✅ THIS FUNCTION IS NOW USED in the AdminInvestmentTable
 const handleViewDetails = (investment: Investment) => {
   // investment parameter contains the entire object with _id
   console.log("Investment ID:", investment._id); // This will show the ID
   console.log("Full investment:", investment); // Shows all data

   setSelectedInvestment(investment); // Store the whole object
   setDetailModalOpen(true); 
 };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleRefresh = () => {
    dispatch(fetchAdminInvestments());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Investment Management
            </h1>
            <p className="text-gray-400 mt-2">
              Review, approve, reject, and publish investment submissions
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={fetchLoading}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${fetchLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
        {/* Debug Info */}
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-300 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-gray-400" />
            Click the eye icon to view detailed investment information
          </p>
        </div>
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
              <p className="text-sm font-medium text-green-400">
                {successMessage}
              </p>
            </div>
          </div>
        )}
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="text-2xl font-bold text-white mb-1">
              {localStats.total}
            </div>
            <div className="text-sm text-gray-400">Total Investments</div>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {localStats.draft}
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
              Draft
            </div>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-blue-500/30 transition-colors">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {localStats.pending}
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Pending
            </div>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-green-500/30 transition-colors">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {localStats.approved}
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Approved
            </div>
          </div>

          {/* Rejected Card */}
          <div className="bg-[#0F0F0F] border-2 border-red-500/30 rounded-xl p-4 relative overflow-hidden group hover:border-red-500/50 transition-all">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="text-2xl font-bold text-red-400 mb-1 flex items-center">
                {localStats.rejected}
                {localStats.rejected > 0 && (
                  <span className="ml-2 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                    Needs Review
                  </span>
                )}
              </div>
              <div className="text-sm text-red-400/80 flex items-center font-medium">
                <XCircle className="w-3.5 h-3.5 mr-1.5" />
                Rejected
              </div>
            </div>
          </div>

          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 hover:border-purple-500/30 transition-colors">
            <div className="text-2xl font-bold text-purple-400 mb-1">
              {localStats.published}
            </div>
            <div className="text-sm text-gray-400 flex items-center">
              <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
              Published
            </div>
          </div>
        </div>
        {/* Filters */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search by title or business name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>
        {/* Investments Table - ✅ handleViewDetails IS PASSED HERE */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden">
          {filteredInvestments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-400">No investments found</p>
              {investments.length > 0 && (
                <p className="text-sm text-gray-500 mt-2">
                  Try changing filters to see more investments
                </p>
              )}
            </div>
          ) : (
            <AdminInvestmentTable
              investments={filteredInvestments}
              actionLoading={actionLoading}
              onApprove={handleApprove}
              onReject={handleReject}
              onPublish={handlePublish}
              onViewDetails={handleViewDetails} // ✅ THIS LINE FIXES THE ESLINT WARNING
            />
          )}
        </div>
        {/* Investment Detail Modal */}
        // In your AdminInvestmentPage.tsx, check your modal implementation:
        <AdminInvestmentDetailModal
          isOpen={detailModalOpen}
          onClose={() => {
            setDetailModalOpen(false);
            setSelectedInvestment(null);
          }}
          investment={selectedInvestment} // This should be the investment object
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
        />
        {/* Reject Modal */}
        <AdminRejectModal
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            setSelectedInvestment(null);
          }}
          onConfirm={handleRejectConfirm}
          investmentTitle={selectedInvestment?.title}
          businessName={selectedInvestment?.businessName}
        />
        {/* Publish Modal */}
        {publishModalOpen && selectedInvestment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl">
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">
                  Publish Investment
                </h3>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to publish "{selectedInvestment.title}"?
                  This will make it visible to all investors.
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setPublishModalOpen(false)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePublishConfirm}
                    disabled={actionLoading === selectedInvestment._id}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg transition-all disabled:opacity-50 flex items-center"
                  >
                    {actionLoading === selectedInvestment._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Publishing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Publish Investment
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvestmentPage;
