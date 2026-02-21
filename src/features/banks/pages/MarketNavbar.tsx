// src/features/banks/pages/BankRatesPage.tsx
import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Clock,
  Globe,
  Shield,
  Zap,
  Users,
  ArrowRight,
  Star,
  Bell,
  RefreshCw,
  Heart,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import placeholderlogo from "../assets/placeholderlogo.jpeg";
import { mockBankService } from "../data/mockBankService";
import type{ Bank, ExchangeRate } from "../types/bank.types";

const BankRatesPage: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    try {
      setLoading(true);
      const data = await mockBankService.getAllBanks();
      setBanks(data);
      if (data.length > 0) {
        setSelectedBank(data[0]);
      }
    } catch (error) {
      console.error("Failed to load banks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadBanks();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredBanks = banks.filter((bank) =>
    bank.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const governmentBanks = filteredBanks.filter(
    (b) => b.category === "government",
  );
  const privateBanks = filteredBanks.filter((b) => b.category === "private");

  const currencies = [
    { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 152.34 },
    { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 164.78 },
    { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 193.45 },
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪", rate: 41.45 },
    { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦", rate: 40.67 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header with Logo and Motivation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Logo */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 flex items-center justify-center group hover:border-yellow-500/50 transition-all duration-500">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/30 transition-all"></div>
                <img
                  src={placeholderlogo}
                  alt="Ethio Diaspora"
                  className="w-48 h-48 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h1 className="text-3xl font-bold text-white mt-6">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  Ethio Diaspora
                </span>
              </h1>
              <p className="text-gray-400 mt-2">Your Bridge to Ethiopia</p>
            </div>
          </div>

          {/* Right Side - Motivational Content */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-800 p-8 hover:border-yellow-500/50 transition-all duration-500">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-yellow-500" />
              Welcome Home, Diaspora!
            </h2>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">
                Stay connected with your homeland through real-time exchange
                rates from all Ethiopian banks. Whether you're sending money
                home or planning your next visit, we've got you covered.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <Zap className="w-5 h-5 text-yellow-500 mb-1" />
                  <p className="text-white font-semibold">Real-Time Rates</p>
                  <p className="text-xs text-gray-400">Updated every minute</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <Shield className="w-5 h-5 text-yellow-500 mb-1" />
                  <p className="text-white font-semibold">Secure & Trusted</p>
                  <p className="text-xs text-gray-400">Bank-grade security</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <Globe className="w-5 h-5 text-yellow-500 mb-1" />
                  <p className="text-white font-semibold">All Banks</p>
                  <p className="text-xs text-gray-400">27+ Ethiopian banks</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <Users className="w-5 h-5 text-yellow-500 mb-1" />
                  <p className="text-white font-semibold">10k+ Users</p>
                  <p className="text-xs text-gray-400">Join our community</p>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1 text-gray-400">
                  <MapPin className="w-4 h-4 text-yellow-500" />
                  <span>Serving Ethiopians worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Bank List */}
          <div className="lg:col-span-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden sticky top-24">
              {/* Sidebar Header */}
              <div className="p-5 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Ethiopian Banks</span>
                  </h2>
                  <button
                    onClick={handleRefresh}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <RefreshCw
                      className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin text-yellow-500" : ""}`}
                    />
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search banks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Bank Lists */}
              <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-800/50 rounded-xl animate-pulse"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <>
                    {/* Government Banks */}
                    {governmentBanks.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Government Banks ({governmentBanks.length})
                        </h3>
                        <div className="space-y-2">
                          {governmentBanks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedBank(bank)}
                              className={`w-full p-3 rounded-xl transition-all ${
                                selectedBank?.id === bank.id
                                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500"
                                  : "bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold">
                                  {bank.shortName.substring(0, 2)}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="text-white font-medium">
                                    {bank.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {bank.exchangeRates.length} currencies
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Private Banks */}
                    {privateBanks.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                          Private Banks ({privateBanks.length})
                        </h3>
                        <div className="space-y-2">
                          {privateBanks.map((bank) => (
                            <button
                              key={bank.id}
                              onClick={() => setSelectedBank(bank)}
                              className={`w-full p-3 rounded-xl transition-all ${
                                selectedBank?.id === bank.id
                                  ? "bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500"
                                  : "bg-gray-800/50 border border-gray-700 hover:border-yellow-500/50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white font-bold">
                                  {bank.shortName.substring(0, 2)}
                                </div>
                                <div className="flex-1 text-left">
                                  <p className="text-white font-medium">
                                    {bank.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {bank.exchangeRates.length} currencies
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Exchange Rates */}
          <div className="lg:col-span-8">
            {selectedBank ? (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                {/* Bank Header */}
                <div className="p-6 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center text-2xl font-bold text-black">
                      {selectedBank.shortName.substring(0, 2)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedBank.name}
                      </h2>
                      <p className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4" />
                        Updated: {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Currency Selector */}
                <div className="p-4 border-b border-gray-800 bg-gray-800/30">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {currencies.map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => setSelectedCurrency(currency.code)}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          selectedCurrency === currency.code
                            ? "bg-yellow-500 text-black font-semibold"
                            : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                        }`}
                      >
                        {currency.flag} {currency.code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exchange Rates Table */}
                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm border-b border-gray-800">
                        <th className="pb-3">Currency</th>
                        <th className="pb-3">Cash Buying</th>
                        <th className="pb-3">Cash Selling</th>
                        <th className="pb-3">Transaction</th>
                        <th className="pb-3">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {selectedBank.exchangeRates
                        .filter(
                          (rate) => rate.currencyCode === selectedCurrency,
                        )
                        .map((rate) => (
                          <tr
                            key={rate.currencyCode}
                            className="hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">{rate.flag}</span>
                                <div>
                                  <p className="text-white font-medium">
                                    {rate.currencyName}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {rate.currencyCode}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-white font-medium">
                              {rate.cashBuying.toFixed(4)}
                            </td>
                            <td className="py-4 text-white font-medium">
                              {rate.cashSelling.toFixed(4)}
                            </td>
                            <td className="py-4 text-white font-medium">
                              {rate.transactionBuying.toFixed(4)}
                            </td>
                            <td className="py-4">
                              <span
                                className={`flex items-center gap-1 ${
                                  rate.change >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {rate.change >= 0 ? (
                                  <TrendingUp className="w-4 h-4" />
                                ) : (
                                  <TrendingDown className="w-4 h-4" />
                                )}
                                {rate.change}%
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
                <Globe className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <p className="text-gray-400">
                  Select a bank to view exchange rates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-2xl border border-yellow-500/20 p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Supporting the Diaspora
                </h3>
                <p className="text-gray-400">
                  Every transfer brings us closer to home
                </p>
              </div>
            </div>
            <button className="bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition-all flex items-center gap-2 group">
              Start Sending Money
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
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

export default BankRatesPage;
