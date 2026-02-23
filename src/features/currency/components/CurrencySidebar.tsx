// src/features/currency/components/CurrencySidebar.tsx
import React from "react";
import { Globe, TrendingUp, TrendingDown } from "lucide-react";
import type{ Currency, CurrencyDetail } from "../types/currency.types";

interface CurrencySidebarProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelectCurrency: (currency: Currency) => void;
  currencyDetails?: Record<string, CurrencyDetail>;
}

const CurrencySidebar: React.FC<CurrencySidebarProps> = ({
  currencies,
  selectedCurrency,
  onSelectCurrency,
  currencyDetails,
}) => {
  const popularCurrencies = ["USD", "EUR", "GBP", "AED", "SAR"];
  const popular = currencies.filter((c) => popularCurrencies.includes(c.code));
  const others = currencies.filter((c) => !popularCurrencies.includes(c.code));

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden sticky top-24">
      <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-yellow-500" />
          World Currencies
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {currencies.length} currencies available
        </p>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Popular Currencies */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Popular
          </h3>
          <div className="space-y-2">
            {popular.map((currency) => {
              const isSelected = selectedCurrency?.code === currency.code;
              const detail = currencyDetails?.[currency.code];

              return (
                <button
                  key={currency.code}
                  onClick={() => onSelectCurrency(currency)}
                  className={`w-full p-3 rounded-xl transition-all ${
                    isSelected
                      ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500"
                      : "bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{currency.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold">
                        {currency.code}
                      </p>
                      <p className="text-xs text-gray-400">{currency.name}</p>
                    </div>
                    {detail && (
                      <div className="text-right">
                        <p className="text-sm text-white">
                          {detail.averageRate.buying.toFixed(2)}
                        </p>
                        <p
                          className={`text-xs flex items-center gap-1 ${
                            detail.trend === "up"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {detail.trend === "up" ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {detail.bankRates[0]?.change}%
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* All Currencies */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            All Currencies
          </h3>
          <div className="space-y-2">
            {others.map((currency) => (
              <button
                key={currency.code}
                onClick={() => onSelectCurrency(currency)}
                className={`w-full p-3 rounded-xl transition-all ${
                  selectedCurrency?.code === currency.code
                    ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500"
                    : "bg-gray-800/30 border border-gray-700 hover:border-yellow-500/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.flag}</span>
                  <div className="flex-1 text-left">
                    <p className="text-white font-semibold">{currency.code}</p>
                    <p className="text-xs text-gray-400">{currency.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1F2937;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4B5563;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #EAB308;
        }
      `}</style>
    </div>
  );
};

export default CurrencySidebar;
