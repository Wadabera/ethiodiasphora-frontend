// src/features/publicInvestment/components/PublicInvestmentFilters.tsx
import React from "react";
import { Search, Filter, X } from "lucide-react";

interface PublicInvestmentFiltersProps {
  filters: {
    sector?: string;
    sortBy?: string;
    search?: string;
  };
  sectors: string[];
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
}

const PublicInvestmentFilters: React.FC<PublicInvestmentFiltersProps> = ({
  filters,
  sectors,
  onFilterChange,
  onClearFilters,
  onSearchChange,
  searchTerm,
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  const hasActiveFilters =
    filters.sector || filters.sortBy !== "newest" || searchTerm;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by title, company, or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 border rounded-xl transition-all flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? "bg-green-500 border-green-500 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <Filter className="w-5 h-5" />
            Filters
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-white text-green-500 rounded-full text-xs flex items-center justify-center font-bold">
                {(filters.sector ? 1 : 0) +
                  (filters.sortBy !== "newest" ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy || "newest"}
            onChange={(e) => onFilterChange("sortBy", e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-green-400"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="roi">Highest ROI</option>
            <option value="amount">Largest Goal</option>
          </select>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-800 animate-fadeIn">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs text-gray-500 mb-1">Sector</label>
              <select
                value={filters.sector || "all"}
                onChange={(e) =>
                  onFilterChange(
                    "sector",
                    e.target.value === "all" ? "" : e.target.value,
                  )
                }
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-green-400"
              >
                <option value="all">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="px-4 py-2 text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PublicInvestmentFilters;
