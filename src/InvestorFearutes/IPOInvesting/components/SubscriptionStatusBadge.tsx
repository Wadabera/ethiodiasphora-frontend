// InvestorFeatures/IPOInvesting/components/SubscriptionStatusBadge.tsx

import React from "react";

interface Props {
  status?: string;
}

export const SubscriptionStatusBadge: React.FC<Props> = ({ status }) => {
  // Brand color configuration with Yellow and Gray 900
  const config: Record<string, { label: string; className: string }> = {
    // Subscription statuses
    pending: {
      label: "Pending",
      className: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
    },
    allotted: {
      label: "Allotted",
      className: "bg-green-900/30 text-green-400 border border-green-800",
    },
    partial: {
      label: "Partial",
      className: "bg-blue-900/30 text-blue-400 border border-blue-800",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-900/30 text-red-400 border border-red-800",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-gray-800 text-gray-400 border border-gray-700",
    },

    // IPO statuses
    announced: {
      label: "Announced",
      className: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
    },
    active: {
      label: "Active",
      className: "bg-green-900/30 text-green-400 border border-green-800",
    },
    closed: {
      label: "Closed",
      className: "bg-gray-800 text-gray-400 border border-gray-700",
    },
    upcoming: {
      label: "Upcoming",
      className: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
    },
    approved: {
      label: "Approved",
      className: "bg-green-900/30 text-green-400 border border-green-800",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-900/30 text-red-400 border border-red-800",
    },
    allocated: {
      label: "Allocated",
      className: "bg-purple-900/30 text-purple-400 border border-purple-800",
    },
    listed: {
      label: "Listed",
      className: "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30",
    },
  };

  // Handle undefined, null, or empty status
  if (!status) {
    return (
      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700">
        N/A
      </span>
    );
  }

  // Normalize status to lowercase
  const normalizedStatus = status.toLowerCase();

  // Get config or use default for unknown status
  const statusConfig = config[normalizedStatus] || {
    label: status,
    className: "bg-gray-800 text-gray-400 border border-gray-700",
  };

  const { label, className } = statusConfig;

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
};
