// features/remittance/components/CurrencySelector.tsx
import React from "react";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  className?: string;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  className = "",
}) => {
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸" },
    { code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺" },
    { code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧" },
    { code: "AED", symbol: "د.إ", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "CAD", symbol: "C$", name: "Canadian Dollar", flag: "🇨🇦" },
    { code: "SAR", symbol: "﷼", name: "Saudi Riyal", flag: "🇸🇦" },
  ];

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onCurrencyChange(currency.code)}
          className={`
            px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-2
            ${
              selectedCurrency === currency.code
                ? "bg-[#FFD700] text-black shadow-lg scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          <span className="text-lg">{currency.flag}</span>
          <span>{currency.code}</span>
          <span className="text-xs text-gray-500">{currency.symbol}</span>
        </button>
      ))}
    </div>
  );
};

export default CurrencySelector;
