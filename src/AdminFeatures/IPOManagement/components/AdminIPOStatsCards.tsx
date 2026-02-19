import React from "react";
import {type AdminIPOStats } from "../types/adminIPOtypes";

interface Props {
  stats: AdminIPOStats | null;
  loading: boolean;
}

export const AdminIPOStatsCards: React.FC<Props> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
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

  if (!stats) return null;

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const cards = [
    {
      title: "Total IPOs",
      value: stats.totalIPOs,
      color: "border-blue-900/50",
      textColor: "text-blue-500",
      icon: "📊",
    },
    {
      title: "Pending Review",
      value: stats.pendingApproval,
      color: "border-yellow-900/50",
      textColor: "text-yellow-500",
      icon: "⏳",
    },
    {
      title: "Open IPOs",
      value: stats.open,
      color: "border-green-900/50",
      textColor: "text-green-500",
      icon: "🔓",
    },
    {
      title: "Total Subscribed",
      value: stats.totalSubscribed.toLocaleString(),
      color: "border-purple-900/50",
      textColor: "text-purple-500",
      icon: "📈",
      suffix: "shares",
    },
  ];

  return (
    <>
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`bg-[#2A2A2A] p-4 rounded-lg border ${card.color} relative overflow-hidden`}
          >
            <div className="absolute right-2 top-2 text-3xl opacity-20">
              {card.icon}
            </div>
            <p className="text-sm text-gray-400 mb-1">{card.title}</p>
            <p className={`text-2xl font-bold text-white`}>
              {typeof card.value === "number"
                ? card.value.toLocaleString()
                : card.value}
              {card.suffix && (
                <span className="text-sm text-gray-500 ml-1">
                  {card.suffix}
                </span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Total Raised</p>
          <p className="text-2xl font-bold text-white">
            {formatCurrency(stats.totalRaised)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalApplications} applications
          </p>
        </div>

        <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Avg Subscription</p>
          <p className="text-2xl font-bold text-white">
            {stats.averageSubscriptionRatio.toFixed(2)}x
          </p>
          <p className="text-xs text-gray-500 mt-1">across all IPOs</p>
        </div>

        <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Status Breakdown</p>
          <div className="flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-yellow-900/30 text-yellow-500 rounded text-xs">
              P: {stats.pendingApproval}
            </span>
            <span className="px-2 py-1 bg-green-900/30 text-green-500 rounded text-xs">
              O: {stats.open}
            </span>
            <span className="px-2 py-1 bg-purple-900/30 text-purple-500 rounded text-xs">
              A: {stats.allotted}
            </span>
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-500 rounded text-xs">
              L: {stats.listed}
            </span>
          </div>
        </div>
      </div>

      {/* Lifecycle Progress */}
      {stats.totalIPOs > 0 && (
        <div className="bg-[#2A2A2A] p-4 rounded-lg border border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">IPO Lifecycle Progress</p>
            <p className="text-xs text-gray-500">
              {stats.listed} of {stats.totalIPOs} Listed
            </p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className="bg-[#FFD700] h-2 rounded-full"
              style={{ width: `${(stats.listed / stats.totalIPOs) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>P: {stats.pendingApproval}</span>
            <span>A: {stats.announced}</span>
            <span>O: {stats.open}</span>
            <span>C: {stats.closed}</span>
            <span>AL: {stats.allotted}</span>
            <span>L: {stats.listed}</span>
          </div>
        </div>
      )}
    </>
  );
};
