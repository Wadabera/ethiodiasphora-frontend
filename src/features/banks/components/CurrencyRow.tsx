// src/features/banks/components/CurrencyRow.tsx (updated)
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import type{ ExchangeRate } from "../types/bank.types";

interface CurrencyRowProps {
  rate: ExchangeRate;
}

const CurrencyRow: React.FC<CurrencyRowProps> = ({ rate }) => {
  const isPositive = rate.change >= 0;

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{rate.flag}</span>
          <div>
            <h4 className="text-white font-semibold">{rate.currencyName}</h4>
            <p className="text-xs text-gray-500">
              {rate.currencyCode} • Last update:{" "}
              {new Date(rate.lastUpdate).toLocaleString()}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>
            {isPositive ? "+" : ""}
            {rate.change}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Cash Buying</p>
          <p className="text-white font-bold">
            {rate.cashBuying.toFixed(4)} Br
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Cash Selling</p>
          <p className="text-white font-bold">
            {rate.cashSelling.toFixed(4)} Br
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Transaction Buying</p>
          <p className="text-white font-bold">
            {rate.transactionBuying.toFixed(4)} Br
          </p>
        </div>
        <div className="bg-gray-900/50 rounded-lg p-2">
          <p className="text-xs text-gray-500 mb-1">Transaction Selling</p>
          <p className="text-white font-bold">
            {rate.transactionSelling.toFixed(4)} Br
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyRow;
