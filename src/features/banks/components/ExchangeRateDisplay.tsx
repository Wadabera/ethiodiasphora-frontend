// src/features/banks/components/ExchangeRateDisplay.tsx (updated)
import React, { useState } from "react";
import {
  Search,
  ExternalLink,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import type{ Bank } from "../types/bank.types";
import CurrencyRow from "./CurrencyRow";

interface ExchangeRateDisplayProps {
  bank: Bank;
}

const ExchangeRateDisplay: React.FC<ExchangeRateDisplayProps> = ({ bank }) => {
  const [searchCurrency, setSearchCurrency] = useState("");

  const filteredRates = bank.exchangeRates.filter(
    (rate) =>
      rate.currencyName.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      rate.currencyCode.toLowerCase().includes(searchCurrency.toLowerCase()),
  );

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Bank Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-20 h-20 bg-gray-800 rounded-xl overflow-hidden p-3 flex-shrink-0">
            <img
              src={bank.logo || "https://via.placeholder.com/80?text=Bank"}
              alt={bank.name}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{bank.name}</h2>
            <p className="text-yellow-500 text-sm mb-2">
              {bank.shortName} • {bank.code}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>
                  {bank.category === "government"
                    ? "Government Bank"
                    : "Private Bank"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Est. {bank.established}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{bank.headquarters}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        {bank.contactInfo && (
          <div className="flex flex-wrap gap-4 text-sm text-gray-400 border-t border-gray-800 pt-4 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-yellow-500" />
              <span>{bank.contactInfo.address}</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-yellow-500" />
              <span>{bank.contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4 text-yellow-500" />
              <span>{bank.contactInfo.email}</span>
            </div>
          </div>
        )}

        {/* Website Link */}
        {bank.website && (
          <div className="mt-4 flex justify-end">
            <a
              href={bank.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors text-sm"
            >
              Visit Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>

      {/* Rate Types Legend */}
      <div className="px-6 py-3 bg-gray-800/50 border-b border-gray-700">
        <div className="flex flex-wrap gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-gray-400">Cash Buying</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span className="text-gray-400">Cash Selling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-gray-400">Transaction Buying</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded"></div>
            <span className="text-gray-400">Transaction Selling</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-6 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search currency..."
            value={searchCurrency}
            onChange={(e) => setSearchCurrency(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Currency List */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
        {filteredRates.length > 0 ? (
          filteredRates.map((rate) => (
            <CurrencyRow key={rate.currencyCode} rate={rate} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No currencies found matching "{searchCurrency}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangeRateDisplay;
