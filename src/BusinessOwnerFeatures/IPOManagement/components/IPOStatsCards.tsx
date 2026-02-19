// src/features/business/IPOManagement/components/IPOStatsCards.tsx

import React from "react";
import type { BusinessIPOStats } from "../types/businessIPOtypes";

interface IPOStatsCardsProps {
  stats: BusinessIPOStats | null;
  loading: boolean;
  error?: string | null;
}

const IPOStatsCards: React.FC<IPOStatsCardsProps> = ({
  stats,
  loading,
  error,
}) => {
  // Default stats if none provided
  const defaultStats: BusinessIPOStats = {
    totalIPOs: 0,
    pendingApproval: 0,
    announced: 0,
    open: 0,
    closed: 0,
    allotted: 0,
    listed: 0,
    rejected: 0,
    totalSubscribed: 0,
    totalRaised: 0,
  };

  const displayStats = stats || defaultStats;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700 animate-pulse"
          >
            <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-800 p-4 rounded-lg mb-6">
        <p className="text-yellow-500 text-sm">
          ⚠️ Stats temporarily unavailable. Showing basic counts.
        </p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  // Define all possible cards with their status keys and display conditions
  const allCards = [
    {
      title: "Total IPOs",
      value: displayStats.totalIPOs,
      statusKey: "totalIPOs",
      color: "border-blue-900/50",
      textColor: "text-blue-500",
      icon: "📊",
      showIfZero: true, // Always show total IPOs even if zero
    },
    {
      title: "Pending",
      value: displayStats.pendingApproval,
      statusKey: "pendingApproval",
      color: "border-yellow-900/50",
      textColor: "text-yellow-500",
      icon: "⏳",
      showIfZero: false, // Hide if zero
    },
    {
      title: "Announced",
      value: displayStats.announced,
      statusKey: "announced",
      color: "border-blue-900/50",
      textColor: "text-blue-500",
      icon: "📢",
      showIfZero: false,
    },
    {
      title: "Open",
      value: displayStats.open,
      statusKey: "open",
      color: "border-green-900/50",
      textColor: "text-green-500",
      icon: "🔓",
      showIfZero: false,
    },
    {
      title: "Closed",
      value: displayStats.closed,
      statusKey: "closed",
      color: "border-gray-900/50",
      textColor: "text-gray-400",
      icon: "🔒",
      showIfZero: false,
    },
    {
      title: "Allotted",
      value: displayStats.allotted,
      statusKey: "allotted",
      color: "border-purple-900/50",
      textColor: "text-purple-500",
      icon: "✅",
      showIfZero: false,
    },
    {
      title: "Listed",
      value: displayStats.listed,
      statusKey: "listed",
      color: "border-indigo-900/50",
      textColor: "text-indigo-500",
      icon: "📈",
      showIfZero: false,
    },
    {
      title: "Rejected",
      value: displayStats.rejected,
      statusKey: "rejected",
      color: "border-red-900/50",
      textColor: "text-red-500",
      icon: "❌",
      showIfZero: false,
    },
  ];

  // Filter cards based on value and showIfZero condition
  const visibleCards = allCards.filter(
    (card) => card.showIfZero || card.value > 0,
  );

  // Calculate grid columns based on number of visible cards
  const getGridCols = (cardCount: number) => {
    if (cardCount <= 2) return "md:grid-cols-2";
    if (cardCount <= 3) return "md:grid-cols-3";
    if (cardCount <= 4) return "md:grid-cols-4";
    return "md:grid-cols-5";
  };

  return (
    <>
      {/* First Row - Status Cards */}
      <div
        className={`grid grid-cols-1 ${getGridCols(visibleCards.length)} gap-4 mb-6`}
      >
        {visibleCards.map((card, index) => (
          <div
            key={index}
            className={`bg-[#2A2A2A] p-4 rounded-lg border ${card.color} relative overflow-hidden transition-all hover:scale-105 hover:shadow-lg`}
          >
            <div className="absolute right-2 top-2 text-3xl opacity-20">
              {card.icon}
            </div>
            <p className="text-sm text-gray-400 mb-1">{card.title}</p>
            <p className={`text-2xl font-bold text-white`}>
              {card.value.toLocaleString()}
            </p>
            {card.value === 0 && (
              <span className="absolute bottom-2 right-2 text-xs text-gray-600">
                No data
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Second Row - Financial Stats (always show if there's data) */}
      {(displayStats.totalSubscribed > 0 || displayStats.totalRaised > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {displayStats.totalSubscribed > 0 && (
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">
                Total Subscribed Shares
              </p>
              <p className="text-2xl font-bold text-white">
                {displayStats.totalSubscribed.toLocaleString()}
              </p>
            </div>
          )}
          {displayStats.totalRaised > 0 && (
            <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Total Raised</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(displayStats.totalRaised)}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Show message if no data at all */}
      {visibleCards.length === 1 && displayStats.totalIPOs === 0 && (
        <div className="text-center text-gray-500 py-4 border border-gray-800 rounded-lg bg-[#2A2A2A] mb-6">
          No IPO data available yet
        </div>
      )}
    </>
  );
};

export default IPOStatsCards;
