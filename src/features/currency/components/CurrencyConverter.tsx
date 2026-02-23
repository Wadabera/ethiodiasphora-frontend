// src/features/currency/components/CurrencyConverter.tsx
import React, { useState, useEffect } from "react";
import { ArrowDownUp, Calculator } from "lucide-react";
import type{ Currency } from "../types/currency.types";

interface CurrencyConverterProps {
  currencies: Currency[];
  selectedCurrency?: Currency | null;
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  currencies,
  selectedCurrency,
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency] = useState<string>("ETB");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(152.34);

  useEffect(() => {
    // Mock exchange rate - in real app, fetch from API
    const rates: Record<string, number> = {
      USD: 152.34,
      EUR: 164.78,
      GBP: 193.45,
      JPY: 1.03,
      CNY: 21.56,
    };
    setExchangeRate(rates[fromCurrency] || 152.34);
  }, [fromCurrency]);

  useEffect(() => {
    setConvertedAmount(amount * exchangeRate);
  }, [amount, exchangeRate]);

  const handleSwap = () => {
    // Just for UI - ETB is always target
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Calculator className="w-5 h-5 text-yellow-500" />
        Currency Converter
      </h3>

      <div className="space-y-4">
        {/* You Send */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">You send</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-yellow-500/50 focus:outline-none"
            >
              {currencies.slice(0, 10).map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} {c.flag}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
          >
            <ArrowDownUp className="w-4 h-4 text-yellow-500" />
          </button>
        </div>

        {/* They Receive */}
        <div>
          <label className="text-sm text-gray-400 mb-2 block">
            They receive
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={convertedAmount.toFixed(2)}
              readOnly
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
            />
            <div className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white min-w-[100px] text-center">
              ETB 🇪🇹
            </div>
          </div>
        </div>

        {/* Exchange Rate Info */}
        <div className="bg-gray-800/30 rounded-lg p-3 mt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Exchange rate</span>
            <span className="text-white">
              1 {fromCurrency} = {exchangeRate.toFixed(4)} ETB
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
