// InvestorFeatures/IPOInvesting/components/MySubscriptionsTable.tsx

import React from "react";
import {type InvestorSubscription } from "../types/investorIPOtypes";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";

interface Props {
  subscriptions: InvestorSubscription[];
  loading: boolean;
  onViewDetails: (subscription: InvestorSubscription) => void;
}

export const MySubscriptionsTable: React.FC<Props> = ({
  subscriptions = [],
  loading,
  onViewDetails,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse h-16 bg-gray-800 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-medium text-white mb-2">
          No Subscriptions
        </h3>
        <p className="text-gray-400 mb-6">
          You haven't subscribed to any IPOs yet.
        </p>
        <button
          onClick={() => (window.location.href = "/investor/ipo/browse")}
          className="px-4 py-2 bg-[#FFD700] text-[#1A1A1A] font-medium rounded-md hover:bg-[#FFA500]"
        >
          Browse IPOs
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1A1A1A] border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Application #
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Company
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Applied
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Allotted
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Date
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {subscriptions.map((sub) => (
              <tr
                key={sub._id}
                className="hover:bg-[#1A1A1A] transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono text-xs text-gray-400">
                    {sub.applicationNumber.slice(-8)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-white font-medium">
                    {sub.companyName}
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-white">{sub.symbol}</td>
                <td className="px-4 py-3">
                  <div className="text-white">{sub.quantity} shares</div>
                  <div className="text-xs text-gray-500">{sub.lots} lots</div>
                </td>
                <td className="px-4 py-3">
                  {sub.allottedShares ? (
                    <>
                      <div className="text-white">
                        {sub.allottedShares} shares
                      </div>
                      {sub.refundAmount ? (
                        <div className="text-xs text-green-500">
                          Refund: {formatCurrency(sub.refundAmount)}
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="text-white">
                    {formatCurrency(sub.totalAmount)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <SubscriptionStatusBadge status={sub.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-400">
                    {formatDate(sub.createdAt)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onViewDetails(sub)}
                    className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
