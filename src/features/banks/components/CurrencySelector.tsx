// features/banks/components/CurrencySelector.tsx
import React from "react";

interface CurrencySelectorProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  rates: any;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onCurrencyChange,
  rates,
}) => {
  const currencies = [
    { code: "USD", symbol: "$", name: "US Dollar" },
    { code: "EUR", symbol: "€", name: "Euro" },
    { code: "GBP", symbol: "£", name: "British Pound" },
    { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onCurrencyChange(currency.code)}
          className={`
            px-4 py-2 rounded-lg font-medium transition-all
            ${
              selectedCurrency === currency.code
                ? "bg-[#FFD700] text-black shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }
          `}
        >
          <span className="mr-1">{currency.symbol}</span>
          {currency.code}
          {rates && rates[currency.code] && (
            <span className="ml-1 text-xs opacity-75">
              ({rates[currency.code].totalBanks})
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default CurrencySelector;
