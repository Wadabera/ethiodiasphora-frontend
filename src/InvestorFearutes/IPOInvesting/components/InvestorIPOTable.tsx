// InvestorFeatures/IPOInvesting/components/InvestorIPOTable.tsx

import React from "react";
import {type InvestorIPO } from "../types/investorIPOtypes";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";

interface Props {
  ipos: InvestorIPO[];
  loading: boolean;
  onViewDetails: (ipo: InvestorIPO) => void;
  onSubscribe: (ipo: InvestorIPO) => void;
}

export const InvestorIPOTable: React.FC<Props> = ({
  ipos = [],
  loading,
  onViewDetails,
  onSubscribe,
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

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const days = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const getStatusBadge = (ipo: InvestorIPO) => {
    if (ipo.status === "announced") {
      const days = Math.ceil(
        (new Date(ipo.startDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      );
      return (
        <span className="px-3 py-1 bg-blue-900/30 text-blue-500 rounded-full text-xs font-medium border border-blue-800">
          Starts in {days} days
        </span>
      );
    }

    if (ipo.status === "open") {
      const days = getDaysRemaining(ipo.endDate);
      return (
        <span className="px-3 py-1 bg-green-900/30 text-green-500 rounded-full text-xs font-medium border border-green-800">
          {days} days left
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-gray-800 text-gray-400 rounded-full text-xs font-medium border border-gray-700">
        {ipo.status.toUpperCase()}
      </span>
    );
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

  if (ipos.length === 0) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-medium text-white mb-2">No IPOs Found</h3>
        <p className="text-gray-400">
          There are no IPOs matching your criteria.
        </p>
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
                Company
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Offer Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Lot Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Subscription
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Timeline
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {ipos.map((ipo) => {
              const isOpen = ipo.status === "open";
              const isAnnounced = ipo.status === "announced";

              return (
                <tr
                  key={ipo._id}
                  className="hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">
                      {ipo.companyName}
                    </div>
                    <div className="text-xs text-gray-500">{ipo.sector}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    {ipo.symbol}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatCurrency(ipo.offerPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white">{ipo.lotSize} shares</div>
                    <div className="text-xs text-gray-500">
                      Min: {ipo.minimumLot} lot
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white">
                      {ipo.totalSubscribed?.toLocaleString() || 0} shares
                    </div>
                    <div className="text-xs text-gray-500">
                      {ipo.subscriptionRatio}x subscribed
                    </div>
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(ipo)}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs text-gray-400">
                      Start: {formatDate(ipo.startDate)}
                    </div>
                    <div className="text-xs text-gray-400">
                      End: {formatDate(ipo.endDate)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onViewDetails(ipo)}
                        className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium"
                      >
                        Details
                      </button>
                      {isOpen && (
                        <button
                          onClick={() => onSubscribe(ipo)}
                          className="text-green-500 hover:text-green-400 text-sm font-medium"
                        >
                          Subscribe
                        </button>
                      )}
                      {isAnnounced && (
                        <span className="text-gray-500 text-sm">
                          Coming Soon
                        </span>
                      )}
                      {ipo.mySubscription && (
                        <SubscriptionStatusBadge
                          status={ipo.mySubscription.status}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
