// src/features/remittance/components/ProviderCard.tsx
import React, { useState } from "react";
import {
  Clock,
  Star,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Check,
  DollarSign,
  Landmark,
  Wallet,
  ArrowRightLeft,
  
} from "lucide-react";
import { type DisplayProvider } from "../types/remittance.types";

interface ProviderCardProps {
  provider: DisplayProvider;
  isSelected: boolean;
  onSelect: (provider: DisplayProvider) => void;
  amount: number;
  fromCurrency: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({
  provider,
  isSelected,
  onSelect,
  amount,
  fromCurrency,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPositive = provider.exchangeRate > 130;

  // Calculate spread percentage
  const calculateSpread = () => {
    if (provider.cashBuying && provider.cashSelling) {
      return (
        ((provider.cashSelling - provider.cashBuying) / provider.cashBuying) *
        100
      ).toFixed(2);
    }
    return null;
  };

  const spread = calculateSpread();

  // Format currency
  const formatETB = (value: number) => {
    return new Intl.NumberFormat("en-ET", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate per unit rates
  const cashBuyingPerUnit = provider.cashBuying
    ? (provider.cashBuying / amount).toFixed(4)
    : null;
  const cashSellingPerUnit = provider.cashSelling
    ? (provider.cashSelling / amount).toFixed(4)
    : null;
  const transactionBuyingPerUnit = provider.transactionBuying
    ? (provider.transactionBuying / amount).toFixed(4)
    : null;
  const transactionSellingPerUnit = provider.transactionSelling
    ? (provider.transactionSelling / amount).toFixed(4)
    : null;

  return (
    <div
      className={`group relative bg-gray-900 rounded-xl overflow-hidden border transition-all cursor-pointer ${
        isSelected
          ? "border-yellow-500 ring-2 ring-yellow-500/20 shadow-lg shadow-yellow-500/10"
          : "border-gray-800 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5"
      }`}
      onClick={() => onSelect(provider)}
    >
      {/* Best Rate Badge */}
      {provider.isBest && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-black text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
            <Star className="w-3 h-3 fill-black" />
            BEST RATE
          </div>
        </div>
      )}

      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-lg blur-md"></div>
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={provider.name}
                className="w-14 h-14 rounded-xl object-contain bg-white p-2 relative z-10 shadow-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center relative z-10 shadow-lg">
                <Landmark className="w-7 h-7 text-black" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg">{provider.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                {provider.type === "ethiopian_bank" ? "Bank" : "Provider"}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{provider.deliveryTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {/* Exchange Rate Summary */}
        <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-xl">
                1 {fromCurrency}
              </span>
              <ArrowRightLeft className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-500 font-bold text-xl">
                {provider.exchangeRate.toFixed(4)} ETB
              </span>
            </div>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
              isPositive ? "bg-green-500/10" : "bg-red-500/10"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>
              {isPositive ? "+" : ""}
              {(((provider.exchangeRate - 130) / 130) * 100).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Fee & Amount */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">Fee</p>
            <div className="flex items-center gap-1">
              <Wallet className="w-4 h-4 text-gray-500" />
              <span
                className={
                  provider.fee === 0
                    ? "text-green-500 font-bold"
                    : "text-white font-bold"
                }
              >
                {provider.fee === 0
                  ? "No fee"
                  : provider.feeType === "fixed"
                    ? `$${provider.fee}`
                    : `${provider.fee}%`}
              </span>
            </div>
          </div>
          <div className="bg-gray-800/30 rounded-lg p-3">
            <p className="text-xs text-gray-500 mb-1">You get</p>
            <p className="text-green-400 font-bold text-lg">
              {formatETB(provider.amountReceived)} ETB
            </p>
          </div>
        </div>

        {/* Detailed Rates Section - Only for Banks */}
        {provider.type === "ethiopian_bank" && (
          <>
            {/* Quick Rate Summary */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-gray-800/20 rounded-lg p-2">
              {provider.cashBuying && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cash Buy:</span>
                  <span className="text-white font-medium">
                    {formatETB(provider.cashBuying)} ETB
                  </span>
                </div>
              )}
              {provider.cashSelling && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cash Sell:</span>
                  <span className="text-white font-medium">
                    {formatETB(provider.cashSelling)} ETB
                  </span>
                </div>
              )}
              {provider.transactionBuying && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tx Buy:</span>
                  <span className="text-white font-medium">
                    {formatETB(provider.transactionBuying)} ETB
                  </span>
                </div>
              )}
              {provider.transactionSelling && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tx Sell:</span>
                  <span className="text-white font-medium">
                    {formatETB(provider.transactionSelling)} ETB
                  </span>
                </div>
              )}
            </div>

            {/* Toggle Details Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDetails(!showDetails);
              }}
              className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-gray-500 hover:text-yellow-500 transition-colors py-2 border-t border-gray-800"
            >
              {showDetails ? "Hide" : "Show"} detailed exchange rates
              {showDetails ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>

            {/* Detailed Rates Grid */}
            {showDetails && (
              <div className="mt-2 space-y-4 animate-fadeIn">
                {/* Cash Rates */}
                <div>
                  <h4 className="text-xs font-semibold text-yellow-500 mb-2 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Cash Rates
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {provider.cashBuying && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">
                          Cash Buying
                        </p>
                        <p className="text-white font-bold text-lg">
                          {formatETB(provider.cashBuying)} ETB
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          1 {fromCurrency} = {cashBuyingPerUnit} ETB
                        </p>
                      </div>
                    )}
                    {provider.cashSelling && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">
                          Cash Selling
                        </p>
                        <p className="text-white font-bold text-lg">
                          {formatETB(provider.cashSelling)} ETB
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          1 {fromCurrency} = {cashSellingPerUnit} ETB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transaction Rates */}
                <div>
                  <h4 className="text-xs font-semibold text-yellow-500 mb-2 flex items-center gap-1">
                    <ArrowRightLeft className="w-3 h-3" />
                    Transaction Rates
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {provider.transactionBuying && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">
                          Transaction Buying
                        </p>
                        <p className="text-white font-bold text-lg">
                          {formatETB(provider.transactionBuying)} ETB
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          1 {fromCurrency} = {transactionBuyingPerUnit} ETB
                        </p>
                      </div>
                    )}
                    {provider.transactionSelling && (
                      <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                        <p className="text-xs text-gray-500 mb-1">
                          Transaction Selling
                        </p>
                        <p className="text-white font-bold text-lg">
                          {formatETB(provider.transactionSelling)} ETB
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          1 {fromCurrency} = {transactionSellingPerUnit} ETB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Spread Info */}
                {spread && (
                  <div className="bg-yellow-500/10 rounded-lg p-3 flex items-center justify-between border border-yellow-500/20">
                    <span className="text-sm text-gray-300">Spread</span>
                    <span className="text-yellow-500 font-bold">{spread}%</span>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute bottom-3 right-3">
          <div className="bg-yellow-500 rounded-full p-1.5 shadow-lg shadow-yellow-500/50">
            <Check className="w-4 h-4 text-black" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderCard;
