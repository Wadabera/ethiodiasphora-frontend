// pages/MarketExchangePage.tsx
import React from "react";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import BankRatesPage from "@/features/banks/pages/BankRatesPage";
import { useSelector } from "react-redux";
import type{ RootState } from "@/store/store";

const MarketExchangePage: React.FC = () => {
  const { banks, rates, lastUpdated } = useSelector(
    (state: RootState) => state.banks,
  );

  // Market Statistics based on actual data
  const marketStats = [
    {
      label: "Active Banks",
      value: banks.length.toString(),
      change: `${banks.filter((b) => b.isGovernment).length} government, ${banks.filter((b) => !b.isGovernment).length} private`,
    },
    {
      label: "Currencies",
      value: rates?.rates ? Object.keys(rates.rates).length.toString() : "0",
      change: rates?.rates
        ? Object.keys(rates.rates).join(", ")
        : "USD, EUR, GBP",
    },
    {
      label: "Best USD Rate",
      value: rates?.rates?.USD?.bestBuyingRate
        ? `${rates.rates.USD.bestBuyingRate.toFixed(4)} ETB`
        : "—",
      change: "Best buying rate",
    },
    {
      label: "Rate Spread",
      value: rates?.rates?.USD?.rateSpread
        ? `${rates.rates.USD.rateSpread.toFixed(4)} ETB`
        : "—",
      change: "Between banks",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      {/* Hero Section for Market Exchange */}
      <section className="bg-black text-[#FFD700] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Ethiopian Market Exchange
          </h1>
          <p className="text-xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Real-time currency exchange rates from all Ethiopian banks. Compare
            rates and make informed investment decisions.
          </p>

          {/* Market Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            {marketStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20"
              >
                <p className="text-3xl font-bold text-[#FFD700]">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-300 mt-2">{stat.label}</p>
                <p className="text-xs text-yellow-400 mt-1">{stat.change}</p>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="mt-8 text-sm text-yellow-400">
              Last Updated: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      </section>

      {/* Main Exchange Rates Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <BankRatesPage />
        </div>
      </section>

      {/* Additional Information Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">
            Why Use Our Exchange Rate Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏦</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                All Ethiopian Banks
              </h3>
              <p className="text-gray-600">
                Compare rates from every bank in Ethiopia in one place
              </p>
              <p className="text-sm text-[#FFD700] mt-2">
                {banks.length} banks available
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Real-Time Updates
              </h3>
              <p className="text-gray-600">
                Live exchange rates updated throughout the day
              </p>
              {lastUpdated && (
                <p className="text-sm text-[#FFD700] mt-2">
                  Updated: {new Date(lastUpdated).toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#FFD700] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-black mb-2">
                Best Rate Finder
              </h3>
              <p className="text-gray-600">
                Instantly find the best buying and selling rates
              </p>
              {rates?.rates?.USD && (
                <p className="text-sm text-[#FFD700] mt-2">
                  Best USD: {rates.rates.USD.bestBuyingRate.toFixed(4)} ETB
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Currency Converter CTA */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-[#FFD700] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Need to Convert Currency?</h2>
          <p className="text-yellow-400 mb-8">
            Use our currency converter to calculate exact amounts based on
            current rates
          </p>
          <button
            onClick={() => (window.location.href = "/currency-converter")}
            className="bg-[#FFD700] text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-600 transition-colors"
          >
            Open Currency Converter
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default MarketExchangePage;
