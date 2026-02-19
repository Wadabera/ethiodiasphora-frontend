// InvestorFeatures/IPOInvesting/pages/MySubscriptionsPage.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MySubscriptionsTable } from "../components/MySubscriptionsTable";
import SubscriptionDetailsModal from "../components/SubscriptionDetailsModal";
import { getMySubscriptions } from "../slice/investorIPOSlice";
import type { InvestorSubscription } from "../types/investorIPOtypes";
import type { RootState } from "@/store/store";

export const MySubscriptionsPage: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedSubscription, setSelectedSubscription] =
    useState<InvestorSubscription | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const {
    subscriptions,
    subscriptionSummary,
    subscriptionsLoading,
    subscriptionsError,
    subscriptionsPagination,
  } = useSelector((state: RootState) => state.investorIPO);

  useEffect(() => {
    dispatch(getMySubscriptions({ page: 1, limit: 10 }) as any);
  }, [dispatch]);

  const handleViewDetails = (subscription: InvestorSubscription) => {
    setSelectedSubscription(subscription);
    setShowDetails(true);
  };

  const handlePageChange = (page: number) => {
    dispatch(
      getMySubscriptions({ page, limit: subscriptionsPagination.limit }) as any,
    );
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#FFD700]">
            My IPO Subscriptions
          </h1>
          <p className="text-gray-400 mt-2">
            Track your IPO applications and allotments
          </p>
        </div>

        {/* Summary Cards */}
        {subscriptionSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Total Subscriptions</p>
              <p className="text-2xl font-bold text-white">
                {subscriptionSummary.totalSubscriptions}
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-yellow-900/50">
              <p className="text-sm text-yellow-500">Pending</p>
              <p className="text-2xl font-bold text-white">
                {subscriptionSummary.pendingSubscriptions}
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-green-900/50">
              <p className="text-sm text-green-500">Allotted</p>
              <p className="text-2xl font-bold text-white">
                {subscriptionSummary.allottedSubscriptions}
              </p>
            </div>
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-purple-900/50">
              <p className="text-sm text-purple-500">Total Invested</p>
              <p className="text-2xl font-bold text-white">
                ETB {subscriptionSummary.totalInvested.toLocaleString()}
              </p>
              {subscriptionSummary.totalRefund > 0 && (
                <p className="text-xs text-green-500 mt-1">
                  Refund: ETB {subscriptionSummary.totalRefund.toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Error Message */}
        {subscriptionsError && (
          <div className="mb-6 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded">
            {subscriptionsError}
          </div>
        )}

        {/* Subscriptions Table */}
        <MySubscriptionsTable
          subscriptions={subscriptions}
          loading={subscriptionsLoading}
          onViewDetails={handleViewDetails}
        />

        {/* Pagination */}
        {subscriptionsPagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() =>
                  handlePageChange(subscriptionsPagination.page - 1)
                }
                disabled={subscriptionsPagination.page === 1}
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-gray-400">
                Page {subscriptionsPagination.page} of{" "}
                {subscriptionsPagination.totalPages}
              </span>
              <button
                onClick={() =>
                  handlePageChange(subscriptionsPagination.page + 1)
                }
                disabled={
                  subscriptionsPagination.page ===
                  subscriptionsPagination.totalPages
                }
                className="px-3 py-1 border border-gray-700 rounded-md text-gray-400 hover:bg-[#2A2A2A] disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        {/* Details Modal */}
        {showDetails && selectedSubscription && (
          <SubscriptionDetailsModal
            subscription={selectedSubscription}
            isOpen={showDetails}
            onClose={() => {
              setShowDetails(false);
              setSelectedSubscription(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
