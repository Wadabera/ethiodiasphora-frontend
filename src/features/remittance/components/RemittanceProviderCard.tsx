// features/remittance/components/RemittanceProviderCard.tsx
import React from "react";
import type { RemittanceProvider } from "../types/remittance.types";

interface RemittanceProviderCardProps {
  provider: RemittanceProvider;
  isSelected: boolean;
  onSelect: (provider: RemittanceProvider) => void;
  sendAmount: number;
}

const RemittanceProviderCard: React.FC<RemittanceProviderCardProps> = ({
  provider,
  isSelected,
  onSelect,
  sendAmount,
}) => {
  const getDeliveryIcon = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "🏦";
      case "cash_pickup":
        return "💵";
      case "mobile_money":
        return "📱";
      default:
        return "📦";
    }
  };

  const getFeeAmount = () => {
    if (provider.feeType === "fixed") {
      return `${provider.fee} ${provider.fromCurrency}`;
    } else {
      const feeAmount = (sendAmount * provider.fee) / 100;
      return `${provider.fee}% (${feeAmount.toFixed(2)} ${provider.fromCurrency})`;
    }
  };

  const calculateReceive = () => {
    const fee =
      provider.feeType === "fixed"
        ? provider.fee
        : (sendAmount * provider.fee) / 100;
    const receive = (sendAmount - fee) * provider.exchangeRate;
    return Math.round(receive * 100) / 100;
  };

  return (
    <div
      onClick={() => onSelect(provider)}
      className={`
        bg-white rounded-xl border-2 transition-all cursor-pointer
        ${
          isSelected
            ? "border-[#FFD700] shadow-lg scale-[1.02]"
            : "border-gray-200 hover:border-gray-300 hover:shadow-md"
        }
      `}
    >
      {/* Provider Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {provider.logo ? (
              <img
                src={provider.logo}
                alt={provider.provider}
                className="w-10 h-10 object-contain"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                <span className="text-[#FFD700] font-bold text-sm">
                  {provider.provider.substring(0, 2).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h4 className="font-bold text-black">{provider.provider}</h4>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>⭐ {provider.rating || "4.5"}</span>
                <span>•</span>
                <span>{provider.totalReviews || "1k+"} reviews</span>
              </div>
            </div>
          </div>
          {isSelected && (
            <span className="bg-[#FFD700] text-black px-3 py-1 rounded-full text-xs font-bold">
              Selected ✓
            </span>
          )}
        </div>
      </div>

      {/* Provider Details */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Exchange Rate</p>
            <p className="text-lg font-bold text-black">
              1 {provider.fromCurrency} = {provider.exchangeRate} ETB
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Fee</p>
            <p className="text-sm font-medium text-red-600">{getFeeAmount()}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">
              {getDeliveryIcon(provider.deliveryMethod)}
            </span>
            <span className="text-gray-600">
              {provider.deliveryMethod
                .split("_")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")}
            </span>
          </div>
          <span className="font-medium text-gray-900">
            ⏱️ {provider.deliveryTime}
          </span>
        </div>

        {/* Receive Amount Preview */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-600">You get:</span>
            <span className="font-bold text-green-600">
              {calculateReceive().toLocaleString()} ETB
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(provider);
          }}
          className={`w-full mt-4 py-3 rounded-lg font-bold transition-colors ${
            isSelected
              ? "bg-[#FFD700] text-black"
              : "bg-gray-900 text-[#FFD700] hover:bg-gray-800"
          }`}
        >
          {isSelected ? "Selected ✓" : "Select Provider"}
        </button>
      </div>
    </div>
  );
};

export default RemittanceProviderCard;
