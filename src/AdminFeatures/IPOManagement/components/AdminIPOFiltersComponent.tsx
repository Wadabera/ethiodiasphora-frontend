// src/features/admin/IPOManagement/components/AdminIPOFilters.tsx

import React, { useState } from "react";
import { type IPOFilters } from "../../../types";

interface IPOFiltersProps {
  filters: IPOFilters;
  onFilterChange: (filters: Partial<IPOFilters>) => void;
  totalCount?: number;
}

const AdminIPOFiltersComponent: React.FC<IPOFiltersProps> = ({
  filters,
  onFilterChange,
  totalCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "pending_approval", label: "Pending Approval" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "allotted", label: "Allotted" },
    { value: "listed", label: "Listed" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_approval":
        return "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/20";
      case "approved":
        return "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20";
      case "open":
        return "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20";
      case "closed":
        return "bg-gray-500/10 text-gray-400 border-gray-500/30 hover:bg-gray-500/20";
      case "allotted":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20";
      case "listed":
        return "bg-[#FFD700]/10 text-[#FFD700] border-[#FFD700]/30 hover:bg-[#FFD700]/20";
      default:
        return "bg-[#2A2A2A] text-gray-300 border-gray-700 hover:bg-[#333333]";
    }
  };

  return (
    <div className="bg-[#1A1A1A] border border-gray-800 rounded-lg shadow-lg mb-6">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-medium text-white">Filter IPOs</h3>
          {totalCount !== undefined && (
            <span className="text-sm text-gray-400">
              Total: {totalCount} IPOs
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#FFD700] hover:text-[#FFA500] transition-colors"
        >
          {isExpanded ? "Show Less" : "Advanced Filters"}
        </button>
      </div>

      <div className="p-4">
        {/* Quick Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Quick Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onFilterChange({
                    status: option.value === filters.status ? "" : option.value,
                    page: 1,
                  })
                }
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  filters.status === option.value
                    ? getStatusColor(option.value)
                    : "bg-[#2A2A2A] text-gray-300 border-gray-700 hover:bg-[#333333]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by company name, symbol, or ID..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ search: e.target.value, page: 1 })
            }
            className="w-full pl-10 pr-4 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sector
              </label>
              <input
                type="text"
                value={filters.sector || ""}
                onChange={(e) =>
                  onFilterChange({
                    sector: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder="e.g., Technology"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={filters.companyName || ""}
                onChange={(e) =>
                  onFilterChange({
                    companyName: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
                placeholder="Search by company"
              />
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={filters.fromDate || ""}
                onChange={(e) =>
                  onFilterChange({
                    fromDate: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={filters.toDate || ""}
                onChange={(e) =>
                  onFilterChange({
                    toDate: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy || ""}
                onChange={(e) =>
                  onFilterChange({ sortBy: e.target.value || undefined })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              >
                <option value="">Default</option>
                <option value="createdAt">Created Date</option>
                <option value="startDate">Start Date</option>
                <option value="endDate">End Date</option>
                <option value="totalSubscribed">Subscription</option>
                <option value="offerPrice">Offer Price</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Sort Order
              </label>
              <select
                value={filters.sortOrder || "desc"}
                onChange={(e) =>
                  onFilterChange({
                    sortOrder: e.target.value as "asc" | "desc",
                  })
                }
                className="w-full px-3 py-2 bg-[#2A2A2A] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-[#FFD700] transition-colors"
              >
                <option value="desc">Descending (Newest First)</option>
                <option value="asc">Ascending (Oldest First)</option>
              </select>
            </div>
          </div>
        )}

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() =>
              onFilterChange({
                status: "",
                sector: undefined,
                search: "",
                fromDate: undefined,
                toDate: undefined,
                companyName: undefined,
                sortBy: undefined,
                sortOrder: "desc",
                page: 1,
              })
            }
            className="text-sm text-[#FFD700] hover:text-[#FFA500] transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminIPOFiltersComponent;
