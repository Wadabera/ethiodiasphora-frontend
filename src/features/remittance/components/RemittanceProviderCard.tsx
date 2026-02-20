import React from "react";
import { Star, Clock, 
 ChevronRight, Heart } from "lucide-react";
import type { RemittanceProvider } from "../types/remittance.types";

interface RemittanceProviderCardProps {
  provider: RemittanceProvider;
  receiveAmount: number;
  sendAmount: number;
  fromCurrency: string;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: () => void;
  onFavoriteToggle: () => void;
}

const RemittanceProviderCard: React.FC<RemittanceProviderCardProps> = ({
  provider,
  receiveAmount,
 
  fromCurrency,
  isSelected = false,
  isFavorite = false,
  onSelect,
  onFavoriteToggle,
}) => {
  const rate = provider.rates?.find((r) => r.fromCurrency === fromCurrency);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div
      className={`bg-gray-900 border rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
        isSelected
          ? "border-yellow-500 shadow-lg shadow-yellow-600/20"
          : "border-gray-800 hover:border-yellow-500/50"
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {provider.logo ? (
            <img
              src={provider.logo}
              alt={provider.name}
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-black">
                {provider.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">{provider.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFavoriteToggle();
                }}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`}
                />
              </button>
            </div>
            <p className="text-sm text-gray-400">
              {provider.type === "ethiopian_bank"
                ? "Ethiopian Bank"
                : "International Provider"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
          <span className="text-white text-sm">
            {provider.rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Rate and Amount */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">Exchange Rate</span>
          <span className="text-white font-medium">
            {rate?.exchangeRate.toFixed(4) || "N/A"} ETB
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm">You Get</span>
          <span className="text-green-400 font-bold text-xl">
            {formatCurrency(receiveAmount)} ETB
          </span>
        </div>
      </div>

      {/* Fee and Time */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/30 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Fee</p>
          <p className="text-white font-medium">
            {rate?.fee === 0
              ? "No fee"
              : `${rate?.fee} ${rate?.feeType === "percentage" ? "%" : fromCurrency}`}
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-2">
          <p className="text-xs text-gray-400 mb-1">Delivery</p>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-gray-500" />
            <span className="text-white font-medium">
              {provider.speeds?.[0]?.time || "1-3 days"}
            </span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {provider.features.slice(0, 2).map((feature, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full"
            >
              {feature}
            </span>
          ))}
          {provider.features.length > 2 && (
            <span className="px-2 py-1 bg-gray-800 text-xs text-gray-300 rounded-full">
              +{provider.features.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        className="w-full py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
      >
        {isSelected ? "Selected" : "Select"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default RemittanceProviderCard;
