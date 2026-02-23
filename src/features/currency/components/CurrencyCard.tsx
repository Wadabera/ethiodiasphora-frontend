// src/features/currency/components/CurrencyCard.tsx
import React from "react";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import type { CurrencyDetail } from "../types/currency.types";

interface CurrencyCardProps {
  currencyDetail: CurrencyDetail;
  onClick: () => void;
  isSelected?: boolean;
}

const CurrencyCard: React.FC<CurrencyCardProps> = ({
  currencyDetail,
  onClick,
  isSelected,
}) => {
  const { currency, averageRate, bestRate, trend } = currencyDetail;

  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-green-500"
      : trend === "down"
        ? "text-red-500"
        : "text-gray-400";

  return (
    <button
      onClick={onClick}
      className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 ${
        isSelected
          ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 shadow-lg shadow-yellow-500/10"
          : "bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/5"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{currency.flag}</span>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">{currency.code}</h3>
              <p className="text-sm text-gray-400">{currency.name}</p>
            </div>
          </div>
          <TrendIcon className={`w-5 h-5 ${trendColor}`} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Buying</p>
            <p className="text-lg font-bold text-white">
              {averageRate.buying.toFixed(4)}
            </p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Selling</p>
            <p className="text-lg font-bold text-white">
              {averageRate.selling.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-gray-500">Best rate</p>
            <p className="text-yellow-500 font-semibold">
              {bestRate.buying.rate.toFixed(4)}
            </p>
          </div>
          <ArrowRight
            className={`w-4 h-4 text-gray-500 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all ${isSelected ? "text-yellow-500" : ""}`}
          />
        </div>
      </div>
    </button>
  );
};

export default CurrencyCard;
