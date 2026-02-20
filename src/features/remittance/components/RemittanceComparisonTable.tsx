import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Clock, Award, Info, Star } from "lucide-react";
import type { DisplayProvider } from "../types/remittance.types";

interface RemittanceComparisonTableProps {
  providers: DisplayProvider[];
  onSelectProvider: (provider: DisplayProvider) => void;
  title?: string;
}

const RemittanceComparisonTable: React.FC<RemittanceComparisonTableProps> = ({
  providers = [],
  onSelectProvider,
  title = "Compare all options",
}) => {
  const [sortBy, setSortBy] = useState<"amount" | "rate" | "time">("amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState(false);

  const sortedProviders = useMemo(() => {
    if (!providers || !Array.isArray(providers)) return [];

    return [...providers].sort((a, b) => {
      if (sortBy === "amount") {
        return sortOrder === "desc"
          ? b.amountReceived - a.amountReceived
          : a.amountReceived - b.amountReceived;
      }
      if (sortBy === "rate") {
        return sortOrder === "desc"
          ? b.exchangeRate - a.exchangeRate
          : a.exchangeRate - b.exchangeRate;
      }
      return 0;
    });
  }, [providers, sortBy, sortOrder]);

  const displayProviders = expanded
    ? sortedProviders
    : sortedProviders.slice(0, 5);
  const bestProvider = sortedProviders[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleSort = (field: "amount" | "rate" | "time") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (!providers || providers.length === 0) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
        <p className="text-gray-400">No providers available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-white">{title}</h3>

        {bestProvider && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 px-4 py-2 rounded-full">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-500 font-medium">
              Best: {bestProvider.name} (
              {formatCurrency(bestProvider.amountReceived)} ETB)
            </span>
          </div>
        )}
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 mb-3 px-4 py-2 bg-gray-800/50 rounded-lg text-xs font-medium text-gray-400">
        <div className="col-span-3">Provider</div>
        <div
          className="col-span-2 cursor-pointer hover:text-yellow-500 transition-colors flex items-center gap-1"
          onClick={() => handleSort("rate")}
        >
          Rate
          {sortBy === "rate" &&
            (sortOrder === "desc" ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            ))}
        </div>
        <div className="col-span-2">Fee</div>
        <div
          className="col-span-2 cursor-pointer hover:text-yellow-500 transition-colors flex items-center gap-1"
          onClick={() => handleSort("amount")}
        >
          You get
          {sortBy === "amount" &&
            (sortOrder === "desc" ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronUp className="w-3 h-3" />
            ))}
        </div>
        <div className="col-span-2">Delivery</div>
        <div className="col-span-1"></div>
      </div>

      {/* Table Rows */}
      <div className="space-y-2">
        {displayProviders.map((provider, index) => (
          <div
            key={provider.id}
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] ${
              provider.isBest
                ? "bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-500/30"
                : "bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50"
            }`}
          >
            {/* Provider */}
            <div className="md:col-span-3 flex items-center gap-3">
              {provider.logo ? (
                <img
                  src={provider.logo}
                  alt={provider.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-black">
                    {provider.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="text-white font-medium">{provider.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                  <span className="text-xs text-gray-400">
                    {provider.rating?.toFixed(1) || "4.0"}
                  </span>
                </div>
              </div>
            </div>

            {/* Rate */}
            <div className="md:col-span-2 flex md:block justify-between">
              <span className="text-gray-400 md:hidden text-sm">Rate:</span>
              <p className="text-white font-medium">
                {provider.exchangeRate.toFixed(4)}
              </p>
            </div>

            {/* Fee */}
            <div className="md:col-span-2 flex md:block justify-between">
              <span className="text-gray-400 md:hidden text-sm">Fee:</span>
              <p className="text-white">
                {provider.fee === 0
                  ? "No fee"
                  : `${provider.fee} ${provider.feeType === "percentage" ? "%" : "USD"}`}
              </p>
            </div>

            {/* You get */}
            <div className="md:col-span-2 flex md:block justify-between">
              <span className="text-gray-400 md:hidden text-sm">You get:</span>
              <p className="text-green-400 font-bold">
                {formatCurrency(provider.amountReceived)} ETB
              </p>
            </div>

            {/* Delivery */}
            <div className="md:col-span-2 flex md:block justify-between">
              <span className="text-gray-400 md:hidden text-sm">Delivery:</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className="text-sm text-gray-300">
                  {provider.deliveryTime}
                </span>
              </div>
            </div>

            {/* Action */}
            <div className="md:col-span-1">
              <button
                onClick={() => onSelectProvider(provider)}
                className="w-full md:w-auto px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-xs font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-105"
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Show More */}
      {providers.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-4 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
        >
          {expanded ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show {providers.length - 5} more{" "}
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Market Insight */}
      {bestProvider && bestProvider.type === "ethiopian_bank" && (
        <div className="mt-4 p-4 bg-gray-800/30 border border-gray-700 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-gray-300">
                <span className="text-yellow-500 font-semibold">
                  Market Insight:
                </span>{" "}
                Ethiopian banks offer much better rates but take 1-3 days.
                International providers are faster but cost more in exchange
                rates.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RemittanceComparisonTable;
