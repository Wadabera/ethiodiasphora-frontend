// src/features/currency/pages/CurrencyPage.tsx
import React, { useState, useEffect } from "react";
import {
 
  RefreshCw,
  TrendingUp,
  Award,
} from "lucide-react";
import CurrencySidebar from "../components/CurrencySidebar";

import BankRateCard from "../components/BankRateCard";
import CurrencyConverter from "../components/CurrencyConverter";
import CurrencySearch from "../components/CurrencySearch";
import {
  currencies,
  currencyDetailsMap,
  mockCurrencyService,
} from "../data/mockCurrencyData";
import type{ Currency, CurrencyDetail } from "../types/currency.types";
import placeholderlogo from "../assets/CurrencyofPlaceholder.jpeg";

const CurrencyPage: React.FC = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(
    currencies[0],
  );
  const [currencyDetail, setCurrencyDetail] = useState<CurrencyDetail | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);

  useEffect(() => {
    if (selectedCurrency) {
      loadCurrencyDetail(selectedCurrency.code);
    }
  }, [selectedCurrency]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = currencies.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.code.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCurrencies(filtered);
    } else {
      setFilteredCurrencies(currencies);
    }
  }, [searchQuery]);

  const loadCurrencyDetail = async (code: string) => {
    setLoading(true);
    try {
      const detail = await mockCurrencyService.getCurrencyByCode(code);
      setCurrencyDetail(detail);
    } catch (error) {
      console.error("Failed to load currency details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (selectedCurrency) {
      await loadCurrencyDetail(selectedCurrency.code);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSelectCurrency = (currency: Currency) => {
    setSelectedCurrency(currency);
  };

  const bestBuyingBank = currencyDetail?.bankRates.reduce((best, current) =>
    current.buyingRate > best.buyingRate ? current : best,
  );

  const bestSellingBank = currencyDetail?.bankRates.reduce((best, current) =>
    current.sellingRate < best.sellingRate ? current : best,
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
    

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
       

        {/* Main Content - Currency Exchange */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Currencies */}
          <div className="lg:col-span-4">
            <CurrencySidebar
              currencies={filteredCurrencies}
              selectedCurrency={selectedCurrency}
              onSelectCurrency={handleSelectCurrency}
              currencyDetails={currencyDetailsMap}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search and Refresh */}
            <div className="flex gap-4">
              <div className="flex-1">
                <CurrencySearch
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />
              </div>
              <button
                onClick={handleRefresh}
                className="px-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl hover:border-yellow-500/50 transition-all"
              >
                <RefreshCw
                  className={`w-5 h-5 text-gray-400 ${refreshing ? "animate-spin text-yellow-500" : ""}`}
                />
              </button>
            </div>

            {/* Currency Converter */}
            {selectedCurrency && (
              <CurrencyConverter
                currencies={currencies}
                selectedCurrency={selectedCurrency}
              />
            )}

            {/* Selected Currency Details */}
            {selectedCurrency && currencyDetail && (
              <div className="space-y-6">
                {/* Best Rates Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 rounded-xl border border-green-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-green-500" />
                      <span className="text-white font-semibold">
                        Best Buying Rate
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-500">
                      {bestBuyingBank?.buyingRate.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-400">
                      at {bestBuyingBank?.bankName}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                      <span className="text-white font-semibold">
                        Best Selling Rate
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-blue-500">
                      {bestSellingBank?.sellingRate.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-400">
                      at {bestSellingBank?.bankName}
                    </p>
                  </div>
                </div>

                {/* Bank Rates */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    Rates from Ethiopian Banks - {selectedCurrency.code}
                  </h3>
                  <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {currencyDetail.bankRates.map((bankRate, index) => (
                      <BankRateCard
                        key={index}
                        bankRate={bankRate}
                        isBestBuying={
                          bankRate.buyingRate === bestBuyingBank?.buyingRate
                        }
                        isBestSelling={
                          bankRate.sellingRate === bestSellingBank?.sellingRate
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
        .animate-spin-slow { animation: spin-slow 3s linear infinite; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-700 { animation-delay: 700ms; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1F2937; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #4B5563; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #EAB308; }
      `}</style>
    </div>
  );
};

export default CurrencyPage;
