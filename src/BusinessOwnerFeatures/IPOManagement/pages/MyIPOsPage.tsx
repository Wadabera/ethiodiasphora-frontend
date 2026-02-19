// src/features/business/IPOManagement/pages/MyIPOsPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MyIPOTable from "../components/MyIPOTable";
import IPOStatsCards from "../components/IPOStatsCards";
import { IPOStatusBadge } from "../components/IPOStatusBadge";
import {
  fetchMyIPOs,
  fetchBusinessIPOStats,
  setFilters,
  calculateStatsFromCurrentIPOs,
} from "../slice/businessIPOSlice";
import type { IPO } from "../../../types";
import type { RootState } from "@/store/store";
import type { IPOStatus } from "../../../types/index"; // Import IPOStatus from the correct path

// Status configuration
const STATUS_CONFIG: Record<IPOStatus, { label: string; color: string; icon: string }> = {
  pending_approval: { label: 'Pending Approval', color: 'yellow', icon: '⏳' },
  announced: { label: 'Announced', color: 'blue', icon: '📢' },
  open: { label: 'Open', color: 'green', icon: '🔓' },
  closed: { label: 'Closed', color: 'gray', icon: '🔒' },
  allotted: { label: 'Allotted', color: 'purple', icon: '✅' },
  listed: { label: 'Listed', color: 'indigo', icon: '📈' },
  rejected: { label: 'Rejected', color: 'red', icon: '❌' },
};

const MyIPOsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedIPO, setSelectedIPO] = useState<IPO | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Safe destructuring with default values
  const {
    ipos = [],
    loading = false,
    error = null,
    stats = null,
    statsLoading = false,
    statsError = null,
    pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
    filters = { page: 1, limit: 10 },
  } = useSelector((state: RootState) => state.businessIPO || {});

  useEffect(() => {
    // Fetch IPOs with current filters
    dispatch(fetchMyIPOs(filters) as any);

    // Fetch stats (will calculate from all IPOs)
    dispatch(fetchBusinessIPOStats() as any);
  }, [dispatch, filters]);

  // Recalculate stats when IPOs change (as fallback)
  useEffect(() => {
    if (ipos.length > 0 && (!stats || statsError)) {
      dispatch(calculateStatsFromCurrentIPOs());
    }
  }, [ipos, stats, statsError, dispatch]);

  // Get available statuses from stats
  const getAvailableStatuses = () => {
    if (!stats) return [];
    
    const statusMap = [
      { key: 'pending_approval' as IPOStatus, count: stats.pendingApproval },
      { key: 'announced' as IPOStatus, count: stats.announced },
      { key: 'open' as IPOStatus, count: stats.open },
      { key: 'closed' as IPOStatus, count: stats.closed },
      { key: 'allotted' as IPOStatus, count: stats.allotted },
      { key: 'listed' as IPOStatus, count: stats.listed },
      { key: 'rejected' as IPOStatus, count: stats.rejected },
    ];
    
    return statusMap.filter(status => status.count > 0);
  };

  const handleViewDetails = (ipo: IPO) => {
    setSelectedIPO(ipo);
    setShowDetails(true);
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleStatusFilter = (status: string) => {
    dispatch(setFilters({ status: status || undefined, page: 1 }));
  };

  const handleRefresh = () => {
    dispatch(fetchMyIPOs(filters) as any);
    dispatch(fetchBusinessIPOStats() as any);
  };

  const availableStatuses = getAvailableStatuses();

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FFD700]">My IPOs</h1>
            <p className="text-gray-400 mt-2">
              Manage and track all your IPO proposals
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
              title="Refresh data"
            >
              ↻ Refresh
            </button>
            <button
              onClick={() => navigate("/business/ipo/create")}
              className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-medium rounded-md hover:bg-[#FFA500] transition-colors"
            >
              + Create New IPO
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <IPOStatsCards
          stats={stats}
          loading={statsLoading}
          error={statsError}
        />

        {/* Status Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-400 mr-2">Filter by Status:</span>

          {/* All IPOs button */}
          <button
            onClick={() => handleStatusFilter("")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              !filters.status
                ? "bg-[#FFD700] text-[#1A1A1A] font-medium"
                : "bg-[#2A2A2A] text-gray-400 hover:bg-gray-800"
            }`}
          >
            All IPOs {stats?.totalIPOs ? `(${stats.totalIPOs})` : ""}
          </button>

          {/* Dynamic status buttons based on available data */}
          {availableStatuses.map((status) => {
            const config = STATUS_CONFIG[status.key];
            const isActive = filters.status === status.key;

            return (
              <button
                key={status.key}
                onClick={() => handleStatusFilter(status.key)}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-1 ${
                  isActive
                    ? `bg-${config.color}-600 text-white`
                    : "bg-[#2A2A2A] text-gray-400 hover:bg-gray-800"
                }`}
              >
                <span>{config.icon}</span>
                <span>{config.label}</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                    isActive ? "bg-white/20" : "bg-gray-700"
                  }`}
                >
                  {status.count}
                </span>
              </button>
            );
          })}

          {/* Show message if no statuses available */}
          {availableStatuses.length === 0 && !loading && (
            <span className="text-sm text-gray-500 italic">
              No IPOs with data available
            </span>
          )}
        </div>

        {/* Table */}
        <MyIPOTable
          ipos={ipos}
          loading={loading}
          onViewDetails={handleViewDetails}
        />

        {/* Pagination */}
        {!loading && pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>

              <span className="px-3 py-1 text-gray-400">
                Page {pagination.page} of {pagination.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </nav>
          </div>
        )}

        {/* Empty State */}
        {!loading && (!ipos || ipos.length === 0) && (
          <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-medium text-white mb-2">
              {filters.status
                ? `No ${STATUS_CONFIG[filters.status as IPOStatus]?.label || ""} IPOs Found`
                : "No IPOs Found"}
            </h3>
            <p className="text-gray-400 mb-6">
              {filters.status
                ? `You don't have any IPOs with ${STATUS_CONFIG[filters.status as IPOStatus]?.label || filters.status} status.`
                : "You haven't created any IPOs yet."}
            </p>
            {!filters.status && (
              <button
                onClick={() => navigate("/business/ipo/create")}
                className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-medium rounded-md hover:bg-[#FFA500] transition-colors"
              >
                Create Your First IPO
              </button>
            )}
            {filters.status && (
              <button
                onClick={() => handleStatusFilter("")}
                className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-medium rounded-md hover:bg-[#FFA500] transition-colors"
              >
                View All IPOs
              </button>
            )}
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedIPO && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedIPO.companyName || selectedIPO.symbol}
                  </h2>
                  <p className="text-[#FFD700]">{selectedIPO.symbol}</p>
                </div>
                <IPOStatusBadge status={selectedIPO.status} />
              </div>

              <div className="space-y-4">
                {/* Key Information */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Offer Price</p>
                    <p className="text-white font-medium">
                      ETB {selectedIPO.offerPrice?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Issue Size</p>
                    <p className="text-white font-medium">
                      ETB {selectedIPO.issueSize?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Shares</p>
                    <p className="text-white font-medium">
                      {selectedIPO.totalShares?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Lot Size</p>
                    <p className="text-white font-medium">
                      {selectedIPO.lotSize} shares
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Min Lots</p>
                    <p className="text-white font-medium">
                      {selectedIPO.minimumLot}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Max Lots</p>
                    <p className="text-white font-medium">
                      {selectedIPO.maximumLot}
                    </p>
                  </div>
                </div>

                {/* Dates */}
                {(selectedIPO.startDate || selectedIPO.endDate) && (
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {selectedIPO.startDate && (
                      <div>
                        <p className="text-sm text-gray-400">Start Date</p>
                        <p className="text-white">
                          {new Date(selectedIPO.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {selectedIPO.endDate && (
                      <div>
                        <p className="text-sm text-gray-400">End Date</p>
                        <p className="text-white">
                          {new Date(selectedIPO.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Sector/Industry */}
                {(selectedIPO.sector || selectedIPO.industry) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedIPO.sector && (
                      <div>
                        <p className="text-sm text-gray-400">Sector</p>
                        <p className="text-white">{selectedIPO.sector}</p>
                      </div>
                    )}
                    {selectedIPO.industry && (
                      <div>
                        <p className="text-sm text-gray-400">Industry</p>
                        <p className="text-white">{selectedIPO.industry}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {selectedIPO.description && (
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-sm text-gray-400 mb-2">Description</p>
                    <p className="text-white whitespace-pre-wrap">
                      {selectedIPO.description}
                    </p>
                  </div>
                )}

                {/* Prospectus */}
                {selectedIPO.prospectusUrl && (
                  <div className="pt-2">
                    <a
                      href={selectedIPO.prospectusUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#FFD700] hover:underline text-sm inline-flex items-center gap-1"
                    >
                      📄 View Prospectus
                    </a>
                  </div>
                )}

                {/* Rejection Reason */}
                {selectedIPO.rejectionReason && (
                  <div className="bg-red-900/30 border border-red-800 p-3 rounded">
                    <p className="text-sm text-red-400 font-medium mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-red-300 text-sm">
                      {selectedIPO.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Subscription Info (for open/closed IPOs) */}
                {(selectedIPO.status === "open" ||
                  selectedIPO.status === "closed") && (
                  <div className="bg-blue-900/30 border border-blue-800 p-3 rounded">
                    <p className="text-sm text-blue-400 font-medium mb-2">
                      Subscription Information
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-400">Subscribed: </span>
                        <span className="text-white">
                          {selectedIPO.totalSubscribed?.toLocaleString() || 0}{" "}
                          shares
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Amount: </span>
                        <span className="text-white">
                          ETB{" "}
                          {(
                            (selectedIPO.totalSubscribed || 0) *
                            (selectedIPO.offerPrice || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetails(false)}
                  className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
                {(selectedIPO.status === "pending_approval" ||
                  selectedIPO.status === "rejected") && (
                  <button
                    onClick={() =>
                      navigate(`/business/ipo/edit/${selectedIPO.id}`)
                    }
                    className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] rounded-md hover:bg-[#FFA500] transition-colors"
                  >
                    Edit IPO
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIPOsPage;