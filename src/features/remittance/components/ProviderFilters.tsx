import React from "react";
import { Star, DollarSign, Clock } from "lucide-react";
import type { RemittanceFilters } from "../types/remittance.types";

interface ProviderFiltersProps {
  filters: RemittanceFilters;
  onFilterChange: (filters: Partial<RemittanceFilters>) => void;
  onClearFilters: () => void;
}

const ProviderFilters: React.FC<ProviderFiltersProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-400 hover:text-yellow-500 transition-colors"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Provider Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Provider Type
          </label>
          <select
            value={filters.type || "all"}
            onChange={(e) => onFilterChange({ type: e.target.value as any })}
            className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Types</option>
            <option value="ethiopian_bank">Ethiopian Banks</option>
            <option value="international_provider">
              International Providers
            </option>
          </select>
        </div>

        {/* Minimum Rate */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Min Rate (ETB)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="number"
              value={filters.minRate || ""}
              onChange={(e) =>
                onFilterChange({
                  minRate: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 100"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-yellow-500"
            />
          </div>
        </div>

        {/* Minimum Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Min Rating
          </label>
          <div className="relative">
            <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filters.rating || ""}
              onChange={(e) =>
                onFilterChange({
                  rating: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Any</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>
        </div>

        {/* Max Delivery Time */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Max Delivery Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={filters.maxTime || ""}
              onChange={(e) =>
                onFilterChange({
                  maxTime: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-yellow-500"
            >
              <option value="">Any</option>
              <option value="1">Within 1 hour</option>
              <option value="24">Within 24 hours</option>
              <option value="72">Within 3 days</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderFilters;
