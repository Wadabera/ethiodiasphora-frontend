// InvestorFeatures/IPOInvesting/components/IPOFilters.tsx

import React, { useState } from "react";
import {type BrowseFilters } from "../types/investorIPOtypes";

interface Props {
  filters: BrowseFilters;
  onFilterChange: (filters: Partial<BrowseFilters>) => void;
  sectors: string[];
}

export const IPOFilters: React.FC<Props> = ({
  filters,
  onFilterChange,
  sectors,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusOptions = [
    { value: "", label: "All" },
    { value: "announced", label: "Upcoming" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
    { value: "listed", label: "Listed" },
  ];

  return (
    <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 mb-6">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Filter IPOs</h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-[#FFD700] hover:text-[#FFA500]"
          >
            {isExpanded ? "Show Less" : "Advanced Filters"}
          </button>
        </div>
      </div>

      <div className="p-4">
        {/* Status Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  onFilterChange({ status: option.value as any, page: 1 })
                }
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  filters.status === option.value
                    ? "bg-[#FFD700] text-[#1A1A1A] font-medium"
                    : "bg-[#1A1A1A] text-gray-400 hover:bg-gray-800"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by company or symbol..."
            value={filters.search || ""}
            onChange={(e) =>
              onFilterChange({ search: e.target.value, page: 1 })
            }
            className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-4 py-2 text-white placeholder-gray-500 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
          />
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-gray-700">
            {/* Sector Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sector
              </label>
              <select
                value={filters.sector || ""}
                onChange={(e) =>
                  onFilterChange({
                    sector: e.target.value || undefined,
                    page: 1,
                  })
                }
                className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
              >
                <option value="">All Sectors</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Min Price
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      minPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                      page: 1,
                    })
                  }
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
                  placeholder="Any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Price
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    onFilterChange({
                      maxPrice: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                      page: 1,
                    })
                  }
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
                  placeholder="Any"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
