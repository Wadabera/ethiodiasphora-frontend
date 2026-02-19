// InvestorFeatures/IPOInvesting/pages/BrowseIPOsPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { InvestorIPOTable } from "../components/InvestorIPOTable";
import { IPOFilters } from "../components/IPOFilters";
import { SubscribeIPOForm } from "../components/SubscribeIPOForm";
import SubscriptionDetailsModal from "../components/SubscriptionDetailsModal";
import {
  browseIPOs,
  getIPODetails,
  subscribeToIPO,
  setBrowseFilters,
  clearSelectedIPO,
  clearSubscribeState,
} from "../slice/investorIPOSlice";
import type { InvestorIPO, SubscribeRequest } from "../types/investorIPOtypes";
import type { RootState } from "@/store/store";

export const BrowseIPOsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [showDetails, setShowDetails] = useState(false);
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [selectedIPO, setSelectedIPO] = useState<InvestorIPO | null>(null);

  // ✅ SAFE DESTRUCTURING with default values
  const {
    ipos = [], // Default to empty array
    selectedIPO: detailsIPO = null,
    browseLoading = false,
    browseError = null,
    browsePagination = { page: 1, limit: 10, total: 0, totalPages: 0 },
    browseFilters = { page: 1, limit: 10 },
    subscribing = false,
    subscribeError = null,
    subscribeSuccess = false,
  } = useSelector((state: RootState) => state?.investorIPO || {});

  // ✅ DEBUG: Log what we're getting
  useEffect(() => {
    console.log("📊 Investor - ipos:", ipos);
    console.log("📊 Investor - ipos length:", ipos?.length);
    console.log(
      "📊 Investor - ipos type:",
      Array.isArray(ipos) ? "array" : typeof ipos,
    );
  }, [ipos]);

  // ✅ SAFE sectors calculation with null check
  const sectors = React.useMemo(() => {
    if (!Array.isArray(ipos) || ipos.length === 0) {
      return [];
    }
    const sectorSet = new Set(
      ipos
        .map((ipo) => ipo?.sector)
        .filter((sector): sector is string => Boolean(sector)),
    );
    return Array.from(sectorSet);
  }, [ipos]);

  // ✅ SAFE counts with null checks
  const openCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "open").length
    : 0;

  const announcedCount = Array.isArray(ipos)
    ? ipos.filter((ipo) => ipo?.status === "announced").length
    : 0;

  useEffect(() => {
    // Set initial filters from URL
    const status = searchParams.get("status") as any;
    const sector = searchParams.get("sector") as any;
    if (status || sector) {
      dispatch(setBrowseFilters({ status, sector }));
    }
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Fetch IPOs with current filters
    dispatch(browseIPOs(browseFilters) as any);
  }, [dispatch, browseFilters]);

  useEffect(() => {
    if (detailsIPO) {
      setSelectedIPO(detailsIPO);
    }
  }, [detailsIPO]);

  useEffect(() => {
    if (subscribeSuccess) {
      setShowSubscribe(false);
      dispatch(clearSubscribeState());
      dispatch(browseIPOs(browseFilters) as any);
    }
  }, [subscribeSuccess, dispatch, browseFilters]);

  const handleViewDetails = (ipo: InvestorIPO) => {
    if (ipo?._id) {
      dispatch(getIPODetails(ipo._id) as any);
      setShowDetails(true);
    }
  };

  const handleSubscribe = (ipo: InvestorIPO) => {
    setSelectedIPO(ipo);
    setShowSubscribe(true);
  };

  const handleSubscribeSubmit = (data: SubscribeRequest) => {
    dispatch(subscribeToIPO(data) as any);
  };

  const handleFilterChange = (newFilters: Partial<typeof browseFilters>) => {
    dispatch(setBrowseFilters(newFilters));
  };

  const handlePageChange = (page: number) => {
    dispatch(setBrowseFilters({ page }));
  };

  const handleRefresh = () => {
    dispatch(browseIPOs(browseFilters) as any);
  };

  // ✅ Determine what to render
  const renderContent = () => {
    if (browseLoading) {
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
            There are no IPOs available at the moment.
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
      <InvestorIPOTable
        ipos={ipos}
        loading={browseLoading}
        onViewDetails={handleViewDetails}
        onSubscribe={handleSubscribe}
      />
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Refresh Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#FFD700]">Browse IPOs</h1>
            <p className="text-gray-400 mt-2">
              Explore and subscribe to available Initial Public Offerings
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

        {/* Quick Stats - Only show if we have IPOs */}
        {Array.isArray(ipos) && ipos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Open IPOs</p>
              <p className="text-2xl font-bold text-white">{openCount}</p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Upcoming IPOs</p>
              <p className="text-2xl font-bold text-white">{announcedCount}</p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Total Available</p>
              <p className="text-2xl font-bold text-white">
                {browsePagination?.total || 0}
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {browseError && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded">
            {browseError}
          </div>
        )}

        {/* Filters - Only show sectors if we have them */}
        <IPOFilters
          filters={browseFilters}
          onFilterChange={handleFilterChange}
          sectors={sectors}
        />

        {/* IPO Table or Empty State */}
        {renderContent()}

        {/* Pagination */}
        {Array.isArray(ipos) &&
          ipos.length > 0 &&
          browsePagination?.totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(browsePagination.page - 1)}
                  disabled={browsePagination.page === 1}
                  className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-gray-400">
                  Page {browsePagination.page || 1} of{" "}
                  {browsePagination.totalPages || 1}
                </span>
                <button
                  onClick={() => handlePageChange(browsePagination.page + 1)}
                  disabled={
                    browsePagination.page === browsePagination.totalPages
                  }
                  className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

        {/* Details Modal */}
        {showDetails && selectedIPO && (
          <SubscriptionDetailsModal
            subscription={selectedIPO as any}
            isOpen={showDetails}
            onClose={() => {
              setShowDetails(false);
              dispatch(clearSelectedIPO());
            }}
          />
        )}

        {/* Subscribe Modal */}
        {showSubscribe && selectedIPO && (
          <SubscribeIPOForm
            ipo={selectedIPO}
            onSubmit={handleSubscribeSubmit}
            onCancel={() => setShowSubscribe(false)}
            loading={subscribing}
            error={subscribeError}
          />
        )}
      </div>
    </div>
  );
};
