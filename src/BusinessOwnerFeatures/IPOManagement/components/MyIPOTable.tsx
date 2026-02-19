// src/features/business/IPOManagement/components/MyIPOTable.tsx

import React from "react";
import { type IPO } from "../types/businessIPOtypes";
import { IPOStatusBadge } from "./IPOStatusBadge";

interface MyIPOTableProps {
  ipos: IPO[];
  loading: boolean;
  onViewDetails: (ipo: IPO) => void;
}

const MyIPOTable: React.FC<MyIPOTableProps> = ({
  ipos = [],
  loading,
  onViewDetails,
}) => {
  const formatDate = (date: string) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) return "ETB 0";
    return `ETB ${amount.toLocaleString()}`;
  };

  const calculateSubscriptionRatio = (ipo: IPO) => {
    if (!ipo.totalSubscribed || !ipo.totalShares) return 0;
    return (ipo.totalSubscribed / ipo.totalShares).toFixed(2);
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!Array.isArray(ipos) || ipos.length === 0) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-xl font-medium text-white mb-2">No IPOs Found</h3>
        <p className="text-gray-400">You haven't created any IPOs yet.</p>
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
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Sector / Industry
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Offer Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Issue Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Shares
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
            {ipos.map((ipo) => (
              <tr
                key={ipo._id || ipo.id}
                className="hover:bg-[#1A1A1A] transition-colors"
              >
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-white">
                    {ipo.symbol}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-white">{ipo.sector || "N/A"}</div>
                  <div className="text-xs text-gray-500">
                    {ipo.industry || "N/A"}
                  </div>
                </td>
                <td className="px-4 py-3 text-white">
                  {formatCurrency(ipo.offerPrice)}
                </td>
                <td className="px-4 py-3 text-white">
                  {formatCurrency(ipo.issueSize)}
                </td>
                <td className="px-4 py-3">
                  <div className="text-white">
                    {ipo.totalShares?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-gray-500">
                    {ipo.totalSubscribed
                      ? `${ipo.totalSubscribed.toLocaleString()} subscribed`
                      : "No subscriptions"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <IPOStatusBadge status={ipo.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs text-gray-400">
                    Start: {formatDate(ipo.startDate)}
                  </div>
                  <div className="text-xs text-gray-400">
                    End: {formatDate(ipo.endDate)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onViewDetails(ipo)}
                    className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium transition-colors"
                  >
                    View Details →
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

export default MyIPOTable;
