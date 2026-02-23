// src/features/currency/components/CurrencySearch.tsx
import React from "react";
import { Search } from "lucide-react";

interface CurrencySearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CurrencySearch: React.FC<CurrencySearchProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search currency (USD, EUR, GBP...)"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"
        />
      </div>
    </div>
  );
};

export default CurrencySearch;
