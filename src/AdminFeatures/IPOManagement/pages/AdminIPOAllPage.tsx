// src/features/admin/IPOManagement/pages/AdminIPOAllPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AdminIPOTable } from "../components/AdminIPOTable";
import { AdminIPODetailsModal } from "../components/AdminIPODetailsModal";
import { AdminApproveIPOForm } from "../components/AdminApproveIPOForm";
import { AdminRejectIPOForm } from "../components/AdminRejectIPOForm";
import { AdminOpenIPOForm } from "../components/AdminOpenIPOForm";
import { AdminCloseIPOForm } from "../components/AdminCloseIPOForm";
import { AdminAllotmentForm } from "../components/AdminAllotmentForm";
import { AdminListStockForm } from "../components/AdminListStockForm";
import { AdminIPOStatsCards } from "../components/AdminIPOStatsCards";
import AdminIPOFiltersComponent from "../components/AdminIPOFiltersComponent";
import {
  fetchAllIPOs,
  // ✅ UNCOMMENT THIS LINE - Stats are calculated in the slice, no need for separate fetch
  // fetchAdminIPOStats,  // REMOVE THIS - not needed as stats are calculated from IPOs
  fetchIPODetails,
  approveIPO,
  rejectIPO,
  openIPO,
  closeIPO,
  processAllotment,
  listAsStock,
  setFilters,
  clearSelectedIPO,
  clearActionStates,
} from "../slice/adminIPOSlice";
import type { AdminIPO } from "../types/adminIPOtypes";
import type { RootState } from "@/store/store";

export const AdminIPOAllPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";

  const [showDetails, setShowDetails] = useState(false);
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showOpen, setShowOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);
  const [showAllotment, setShowAllotment] = useState(false);
  const [showList, setShowList] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<AdminIPO | null>(null);
  const [activeTab, setActiveTab] = useState(statusFilter || "all");
  // ✅ Remove statsError - stats are calculated in the slice

  // ✅ SAFE DESTRUCTURING with defaults
  const {
    ipos = [],
    loading = false,
    pagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
    selectedIPO: detailsIPO = null,
    stats = null,
    statsLoading = false,
    // ✅ statsError is managed in slice
    filters = { page: 1, limit: 10 },
    actionLoading = false,
    actionSuccess = false,
    allotmentResult = null,
  } = useSelector((state: RootState) => state?.adminIPO || {});

  // ✅ DEBUG: Log what we're getting
  useEffect(() => {
    console.log("📊 Redux State - ipos:", ipos);
    console.log("📊 ipos length:", ipos?.length);
    console.log("📊 ipos type:", Array.isArray(ipos) ? "array" : typeof ipos);
    console.log("📊 First 3 items:", ipos?.slice(0, 3));
    console.log("📊 Stats:", stats);
  }, [ipos, stats]);

  // ✅ SAFE counts with null checks
  const pendingCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "pending_approval").length
    : 0;
  const announcedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "announced").length
    : 0;
  const openCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "open").length
    : 0;
  const closedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "closed").length
    : 0;
  const allottedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "allotted").length
    : 0;
  const listedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "listed").length
    : 0;
  const rejectedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "rejected").length
    : 0;

  useEffect(() => {
    if (statusFilter && statusFilter !== "all") {
      dispatch(setFilters({ ...filters, status: statusFilter }));
    }
  }, [statusFilter, dispatch]);

  useEffect(() => {
    // ✅ Fetch IPOs with current filters - stats are automatically calculated in the slice
    dispatch(fetchAllIPOs(filters) as any);

    // ✅ REMOVED: No need to fetch stats separately - they're calculated from IPOs
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
      setShowOpen(false);
      setShowClose(false);
      setShowAllotment(false);
      setShowList(false);

      dispatch(clearActionStates());
      dispatch(fetchAllIPOs(filters) as any);
    }
  }, [actionSuccess, dispatch, filters]);

  const handleViewDetails = (ipo: AdminIPO) => {
    if (ipo?._id) {
      dispatch(fetchIPODetails(ipo._id) as any);
      setShowDetails(true);
    }
  };

  const handleApprove = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowApprove(true);
  };

  const handleReject = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowReject(true);
  };

  const handleOpen = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowOpen(true);
  };

  const handleClose = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowClose(true);
  };

  const handleAllot = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowAllotment(true);
  };

  const handleList = (ipo: AdminIPO) => {
    setSelectedIPO(ipo);
    setShowList(true);
  };

  const handleApproveSubmit = (data: { notes: string }) => {
    if (selectedIPO?._id) {
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
    if (selectedIPO?._id) {
      dispatch(
        rejectIPO({
          ipoId: selectedIPO._id,
          reason: data.reason,
          notes: data.notes,
        }) as any,
      );
    }
  };

  const handleOpenSubmit = (data: { openDate?: string }) => {
    if (selectedIPO?._id) {
      dispatch(
        openIPO({
          ipoId: selectedIPO._id,
          openDate: data.openDate,
        }) as any,
      );
    }
  };

  const handleCloseSubmit = (data: { closeDate?: string }) => {
    if (selectedIPO?._id) {
      dispatch(
        closeIPO({
          ipoId: selectedIPO._id,
          closeDate: data.closeDate,
        }) as any,
      );
    }
  };

  const handleAllotmentSubmit = (data: {
    method: "proportional" | "lottery" | "priority";
    notes?: string;
  }) => {
    if (selectedIPO?._id) {
      dispatch(
        processAllotment({
          ipoId: selectedIPO._id,
          method: data.method,
          notes: data.notes,
        }) as any,
      );
    }
  };

  const handleListSubmit = (data: {
    listingPrice: number;
    exchange: string;
    listingDate?: string;
  }) => {
    if (selectedIPO?._id) {
      dispatch(
        listAsStock({
          ipoId: selectedIPO._id,
          listingPrice: data.listingPrice,
          exchange: data.exchange,
          listingDate: data.listingDate,
        }) as any,
      );
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  };

  const handlePageChange = (page: number) => {
    dispatch(setFilters({ page }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const status = tab === "all" ? "" : tab;
    navigate(`/admin/ipo/all${status ? `?status=${status}` : ""}`);
    dispatch(setFilters({ status, page: 1 }));
  };

  const handleRefresh = () => {
    dispatch(fetchAllIPOs(filters) as any);
  };

  // ✅ Determine what to render
  const renderContent = () => {
    if (loading) {
      return (
        <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFD700] mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading IPOs...</p>
        </div>
      );
    }

    if (!Array.isArray(ipos) || ipos.length === 0) {
      return (
        <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h3 className="text-xl font-medium text-white mb-2">No IPOs Found</h3>
          <p className="text-gray-400">
            There are no IPOs matching your criteria.
          </p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-[#FFD700] text-[#1A1A1A] rounded-md hover:bg-[#FFA500]"
          >
            Refresh
          </button>
        </div>
      );
    }

    return (
      <AdminIPOTable
        ipos={ipos}
        loading={loading}
        onViewDetails={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onOpen={handleOpen}
        onClose={handleClose}
        onAllot={handleAllot}
        onList={handleList}
        showActions={true}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FFD700]">
              IPO Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage all IPOs from creation to listing
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-md text-gray-300 hover:bg-gray-800 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 border-b border-gray-700 overflow-x-auto">
          <nav className="flex flex-nowrap -mb-px space-x-8 min-w-max">
            <button
              onClick={() => handleTabChange("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "all"
                  ? "border-[#FFD700] text-[#FFD700]"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              All ({Array.isArray(ipos) ? ipos.length : 0})
            </button>
            <button
              onClick={() => handleTabChange("pending_approval")}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center whitespace-nowrap ${
                activeTab === "pending_approval"
                  ? "border-yellow-500 text-yellow-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Pending
              {pendingCount > 0 && (
                <span className="ml-2 bg-yellow-900/30 text-yellow-500 px-2 py-0.5 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => handleTabChange("announced")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "announced"
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Announced ({announcedCount})
            </button>
            <button
              onClick={() => handleTabChange("open")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "open"
                  ? "border-green-500 text-green-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Open ({openCount})
            </button>
            <button
              onClick={() => handleTabChange("closed")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "closed"
                  ? "border-gray-500 text-gray-400"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Closed ({closedCount})
            </button>
            <button
              onClick={() => handleTabChange("allotted")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "allotted"
                  ? "border-purple-500 text-purple-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Allotted ({allottedCount})
            </button>
            <button
              onClick={() => handleTabChange("listed")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "listed"
                  ? "border-indigo-500 text-indigo-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Listed ({listedCount})
            </button>
            <button
              onClick={() => handleTabChange("rejected")}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === "rejected"
                  ? "border-red-500 text-red-500"
                  : "border-transparent text-gray-400 hover:text-gray-300"
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </nav>
        </div>

        {/* Pending Alert */}
        {pendingCount > 0 && activeTab !== "pending_approval" && (
          <div className="mb-6 bg-yellow-900/30 border border-yellow-800 p-4 rounded-lg">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-3">⚠️</span>
              <p className="text-yellow-400">
                You have {pendingCount} IPO{pendingCount !== 1 ? "s" : ""}{" "}
                pending approval.{" "}
                <button
                  onClick={() => handleTabChange("pending_approval")}
                  className="font-medium underline hover:text-yellow-300"
                >
                  Review now
                </button>
              </p>
            </div>
          </div>
        )}

        {/* Stats - Now properly calculated from IPOs */}
        <AdminIPOStatsCards
          stats={stats}
          loading={statsLoading}
          // error prop removed as statsError is handled in slice
        />

        {/* Filters */}
        <AdminIPOFiltersComponent
          filters={filters}
          onFilterChange={handleFilterChange}
          totalCount={pagination?.total}
        />

        {/* Allotment Result */}
        {allotmentResult && (
          <div className="mb-6 bg-green-900/30 border border-green-800 p-4 rounded-lg">
            <p className="text-green-400 font-medium">
              {allotmentResult.message}
            </p>
            <p className="text-sm text-green-300 mt-1">
              Allotted:{" "}
              {allotmentResult.summary?.totalSharesAllotted?.toLocaleString() ||
                0}{" "}
              shares · Refund: ETB{" "}
              {allotmentResult.summary?.totalRefundAmount?.toLocaleString() ||
                0}{" "}
              · Notifications: {allotmentResult.summary?.notificationsSent || 0}
            </p>
          </div>
        )}

        {/* Main Content - IPOs Table or Empty State */}
        {renderContent()}

        {/* Pagination */}
        {Array.isArray(ipos) &&
          ipos.length > 0 &&
          pagination?.totalPages > 1 && (
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
                  Page {pagination.page || 1} of {pagination.totalPages || 1}
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
            onOpen={handleOpen}
            onCloseIPO={handleClose}
            onAllot={handleAllot}
            onList={handleList}
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

        {showOpen && selectedIPO && (
          <AdminOpenIPOForm
            ipo={selectedIPO}
            onSubmit={handleOpenSubmit}
            onCancel={() => setShowOpen(false)}
            loading={actionLoading}
          />
        )}

        {showClose && selectedIPO && (
          <AdminCloseIPOForm
            ipo={selectedIPO}
            onSubmit={handleCloseSubmit}
            onCancel={() => setShowClose(false)}
            loading={actionLoading}
          />
        )}

        {showAllotment && selectedIPO && (
          <AdminAllotmentForm
            ipo={selectedIPO}
            onSubmit={handleAllotmentSubmit}
            onCancel={() => setShowAllotment(false)}
            loading={actionLoading}
          />
        )}

        {showList && selectedIPO && (
          <AdminListStockForm
            ipo={selectedIPO}
            onSubmit={handleListSubmit}
            onCancel={() => setShowList(false)}
            loading={actionLoading}
          />
        )}
      </div>
    </div>
  );
};
