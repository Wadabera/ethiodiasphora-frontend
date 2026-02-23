// src/features/remittance/components/CurrencySelector.tsx
import React from "react";
import { ChevronDown } from "lucide-react";
import { worldCurrencies } from "../services/mockRemittanceData";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  label?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  label,
}) => {
  const selected = worldCurrencies.find((c) => c.code === selectedCurrency);

  return (
    <div className="relative">
      {label && <p className="text-xs text-gray-500 mb-1">{label}</p>}
      <div className="relative group">
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:border-yellow-500/50 focus:outline-none"
        >
          {worldCurrencies.map((currency) => (
            <option key={currency.code} value={currency.code}>
              {currency.flag} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
};

export default CurrencySelector;
