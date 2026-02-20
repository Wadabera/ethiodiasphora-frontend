// features/banks/components/BankExchangeRates.tsx
import React, { useState } from "react";
import CurrencySelector from "./CurrencySelector";
import ExchangeRateTable from "./ExchangeRateTable";
import BankCard from "./BankCard";
import type{ Bank } from "../types/bank.types";

interface BankExchangeRatesProps {
  banks: Bank[];
  rates: any;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  lastUpdated: string;
  onSearch: (query: string) => void;
  loading?: boolean;
}

const BankExchangeRates: React.FC<BankExchangeRatesProps> = ({
  banks,
  rates,
  selectedCurrency,
  onCurrencyChange,
  lastUpdated,
  onSearch,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const currentRates = rates?.[selectedCurrency];

  return (
    <div className="space-y-8">
      {/* Date Banner */}
      <div className="bg-[#FFD700] text-black px-6 py-3 rounded-lg font-medium text-center">
        📅 Date:{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}{" "}
        • ⏰ Last Updated:{" "}
        {lastUpdated
          ? new Date(lastUpdated).toLocaleTimeString()
          : "Loading..."}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Currency Selector */}
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={onCurrencyChange}
            rates={rates}
          />

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search banks..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700]"
              />
              <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "table"
                  ? "bg-black text-[#FFD700]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode("cards")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                viewMode === "cards"
                  ? "bg-black text-[#FFD700]"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Card View
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {currentRates && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#FFD700]">
            <p className="text-sm text-gray-600 mb-1">Average Buying</p>
            <p className="text-2xl font-bold text-black">
              {currentRates.averageBuying.toFixed(4)} Birr
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#FFD700]">
            <p className="text-sm text-gray-600 mb-1">Average Selling</p>
            <p className="text-2xl font-bold text-black">
              {currentRates.averageSelling.toFixed(4)} Birr
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-green-500">
            <p className="text-sm text-gray-600 mb-1">Best Buying Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {currentRates.bestBuyingRate.toFixed(4)} Birr
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow border-l-4 border-[#FFD700]">
            <p className="text-sm text-gray-600 mb-1">Rate Spread</p>
            <p className="text-2xl font-bold text-black">
              {currentRates.rateSpread.toFixed(4)} Birr
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading banks...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Main Display */}
          {viewMode === "table" ? (
            <ExchangeRateTable
              banks={banks}
              selectedCurrency={selectedCurrency}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banks.map((bank) => (
                <BankCard
                  key={bank._id}
                  bank={bank}
                  selectedCurrency={selectedCurrency}
                />
              ))}
            </div>
          )}

          {/* Banks Count */}
          <div className="text-center text-gray-600">
            Showing {banks.length} banks
          </div>
        </>
      )}
    </div>
  );
};

export default BankExchangeRates;
