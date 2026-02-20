// features/banks/components/BankCard.tsx
import React from "react";
import type{ Bank } from "../types/bank.types";

interface BankCardProps {
  bank: Bank;
  selectedCurrency: string;
}

const BankCard: React.FC<BankCardProps> = ({ bank, selectedCurrency }) => {
  const rate = bank.exchangeRates?.find((r) => r.currency === selectedCurrency);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-200">
      {/* Bank Header */}
      <div className="bg-black p-4">
        <div className="flex items-center gap-3">
          {bank.logo ? (
            <img
              src={bank.logo}
              alt={bank.name}
              className="w-12 h-12 object-contain bg-white rounded-lg p-1"
            />
          ) : (
            <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">{bank.code}</span>
            </div>
          )}
          <div>
            <h3 className="text-[#FFD700] font-bold">{bank.name}</h3>
            <p className="text-yellow-400 text-sm">{bank.code}</p>
          </div>
        </div>
      </div>

      {/* Exchange Rates */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Cash Buy</p>
            <p className="text-lg font-bold text-black">
              {rate?.cashBuyingRate?.toFixed(4) || "—"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Cash Sell</p>
            <p className="text-lg font-bold text-black">
              {rate?.cashSellingRate?.toFixed(4) || "—"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Transaction Buy</p>
            <p className="text-lg font-bold text-green-600">
              {rate?.buyingRate?.toFixed(4) || "—"}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Transaction Sell</p>
            <p className="text-lg font-bold text-red-600">
              {rate?.sellingRate?.toFixed(4) || "—"}
            </p>
          </div>
        </div>

        {/* Last Updated */}
        {rate?.lastUpdated && (
          <div className="mt-3 text-xs text-gray-500 text-right">
            Updated: {new Date(rate.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {bank.isGovernment ? "🏛️ Government" : "🏦 Private"}
          </span>
          {bank.website && (
            <a
              href={bank.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Visit Website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankCard;
