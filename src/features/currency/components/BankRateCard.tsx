// src/features/currency/components/BankRateCard.tsx
import React from "react";
import { Building2, TrendingUp, TrendingDown, Clock } from "lucide-react";
import type{ BankRate } from "../types/currency.types";

interface BankRateCardProps {
  bankRate: BankRate;
  isBestBuying?: boolean;
  isBestSelling?: boolean;
}

const BankRateCard: React.FC<BankRateCardProps> = ({
  bankRate,
  isBestBuying,
  isBestSelling,
}) => {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-gray-400" />
          <h4 className="text-white font-semibold">{bankRate.bankName}</h4>
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${
            bankRate.change >= 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {bankRate.change >= 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{bankRate.change}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div
          className={`bg-gray-900/50 rounded-lg p-2 ${isBestBuying ? "ring-1 ring-yellow-500" : ""}`}
        >
          <p className="text-xs text-gray-500">Cash Buying</p>
          <p className="text-white font-bold">
            {bankRate.cashBuying.toFixed(4)}
          </p>
          {isBestBuying && (
            <span className="text-xs text-yellow-500">Best rate</span>
          )}
        </div>
        <div
          className={`bg-gray-900/50 rounded-lg p-2 ${isBestSelling ? "ring-1 ring-yellow-500" : ""}`}
        >
          <p className="text-xs text-gray-500">Cash Selling</p>
          <p className="text-white font-bold">
            {bankRate.cashSelling.toFixed(4)}
          </p>
          {isBestSelling && (
            <span className="text-xs text-yellow-500">Best rate</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>
            Updated: {new Date(bankRate.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BankRateCard;
