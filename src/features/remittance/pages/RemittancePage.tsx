// features/remittance/pages/RemittancePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import {
  setSelectedCurrency,
  setSendAmount,
  setSelectedProvider,
  refreshMockData,
  selectFilteredProviders,
  selectSelectedCurrency,
  selectSelectedProvider,
  selectSendAmount,
  selectCalculation,
  selectLastUpdated,
} from "../slices/remittanceSlice";
import type { RemittanceProvider } from "../types/remittance.types";
import RemittanceHero from "../components/RemittanceHero";
import CurrencySelector from "../components/CurrencySelector";
import RemittanceCalculator from "../components/RemittanceCalculator";
import RemittanceProviderCard from "../components/RemittanceProviderCard";
import RemittanceComparisonTable from "../components/RemittanceComparisonTable";
import DeliveryMethodSelector from "../components/DeliveryMethodSelector";

const RemittancePage: React.FC = () => {
  const dispatch = useDispatch();

  // Use selectors for better performance
  const filteredProviders = useSelector(selectFilteredProviders);
  const selectedCurrency = useSelector(selectSelectedCurrency);
  const sendAmount = useSelector(selectSendAmount);
  const selectedProvider = useSelector(selectSelectedProvider);
  const calculation = useSelector(selectCalculation);
  const lastUpdated = useSelector(selectLastUpdated);

  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  // Auto-refresh mock data every 30 seconds to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(refreshMockData());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleCurrencyChange = (currency: string) => {
    dispatch(setSelectedCurrency(currency));
  };

  const handleAmountChange = (amount: number) => {
    dispatch(setSendAmount(amount));
  };

  const handleProviderSelect = (provider: RemittanceProvider) => {
    dispatch(setSelectedProvider(provider));
  };

  const handleProceedToTransfer = () => {
    if (selectedProvider) {
      // In a real app, this would redirect to the provider's checkout
      alert(
        `Redirecting to ${selectedProvider.provider} to complete your transfer of ${sendAmount} ${selectedProvider.fromCurrency}`,
      );
      // window.open(`https://${selectedProvider.provider.toLowerCase()}.com`, "_blank");
    }
  };

  // Calculate best rate
  const bestRate = React.useMemo(() => {
    if (filteredProviders.length > 0) {
      return Math.max(...filteredProviders.map((p) => p.exchangeRate));
    }
    return 0;
  }, [filteredProviders]);

  // Calculate fastest time
  const fastestTime = React.useMemo(() => {
    if (filteredProviders.length > 0) {
      const fastest = filteredProviders.reduce((fastest, current) => {
        const getMinutes = (time: string) => {
          if (time.includes("min")) return parseInt(time) || 999;
          if (time.includes("hour")) return (parseInt(time) || 1) * 60;
          if (time.includes("day")) return (parseInt(time) || 1) * 1440;
          return 999;
        };

        const currentTime = getMinutes(current.deliveryTime);
        const fastestTime = getMinutes(fastest.deliveryTime);
        return currentTime < fastestTime ? current : fastest;
      });
      return fastest.deliveryTime;
    }
    return "N/A";
  }, [filteredProviders]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Demo Data Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-2">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-yellow-700">
          ⚡ Using demo data • Last updated:{" "}
          {lastUpdated
            ? new Date(lastUpdated).toLocaleTimeString()
            : "Just now"}
        </div>
      </div>

      {/* Hero Section */}
      <RemittanceHero
        selectedCurrency={selectedCurrency}
        onCurrencyChange={handleCurrencyChange}
        totalProviders={filteredProviders.length}
        bestRate={bestRate}
        fastestTime={fastestTime}
        lastUpdated={lastUpdated || undefined}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Currency Selector */}
        <div className="mb-8">
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        {/* Calculator and Selected Provider */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Calculator */}
          <div className="lg:col-span-1">
            <RemittanceCalculator
              sendAmount={sendAmount}
              onAmountChange={handleAmountChange}
              selectedProvider={selectedProvider}
              calculation={calculation}
            />
          </div>

          {/* Selected Provider Preview */}
          <div className="lg:col-span-2">
            {selectedProvider ? (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#FFD700]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-black">
                    Selected Provider
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Ready to Send
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  {selectedProvider.logo ? (
                    <img
                      src={selectedProvider.logo}
                      alt={selectedProvider.provider}
                      className="w-16 h-16 object-contain"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center">
                    <span className="text-[#FFD700] font-bold text-xl">
                      {selectedProvider.provider.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-black">
                      {selectedProvider.provider}
                    </h4>
                    <p className="text-gray-600">
                      Sending {sendAmount} {selectedProvider.fromCurrency} →{" "}
                      {calculation?.receiveAmount.toLocaleString()} ETB
                    </p>
                    {selectedProvider.rating && (
                      <p className="text-sm text-yellow-500">
                        ⭐ {selectedProvider.rating} rating
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Exchange Rate</p>
                    <p className="text-xl font-bold text-black">
                      1 {selectedProvider.fromCurrency} ={" "}
                      {selectedProvider.exchangeRate.toFixed(2)} ETB
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Delivery Time</p>
                    <p className="text-xl font-bold text-black">
                      {selectedProvider.deliveryTime}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleProceedToTransfer}
                  className="w-full bg-[#FFD700] text-black py-4 rounded-xl font-bold text-lg hover:bg-yellow-600 transition-colors"
                >
                  Proceed to {selectedProvider.provider} →
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-200">
                <div className="text-6xl mb-4">💸</div>
                <h3 className="text-xl font-bold text-black mb-2">
                  Select a Provider
                </h3>
                <p className="text-gray-600">
                  Choose a remittance provider to calculate your transfer
                </p>
              </div>
            )}
          </div>
        </div>

        {/* View Toggle */}
        {filteredProviders.length > 0 && (
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Compare Providers</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("cards")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "cards"
                    ? "bg-black text-[#FFD700]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Card View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === "table"
                    ? "bg-black text-[#FFD700]"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        )}

        {/* Providers Display */}
        {filteredProviders.length > 0 ? (
          <>
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider, index) => (
                  <RemittanceProviderCard
                    key={`${provider.provider}-${provider.fromCurrency}-${index}`}
                    provider={provider}
                    isSelected={
                      selectedProvider?.provider === provider.provider &&
                      selectedProvider?.fromCurrency === provider.fromCurrency
                    }
                    onSelect={handleProviderSelect}
                    sendAmount={sendAmount}
                  />
                ))}
              </div>
            ) : (
              <RemittanceComparisonTable
                providers={filteredProviders}
                selectedCurrency={selectedCurrency}
                sendAmount={sendAmount}
                onSelectProvider={handleProviderSelect}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-500">
              No providers available for {selectedCurrency}
            </p>
          </div>
        )}

        {/* Delivery Methods Info */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-black mb-6">
            How do you want to receive?
          </h3>
          <DeliveryMethodSelector
            selectedMethod={selectedProvider?.deliveryMethod || "bank_transfer"}
            onMethodChange={() => {}} // Add your method change handler here
          />
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gray-900 rounded-2xl p-8 text-[#FFD700]">
          <div className="flex items-start gap-4">
            <div className="text-3xl">❓</div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Need Help with Remittance?
              </h3>
              <ul className="space-y-2 text-yellow-400">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                  Compare rates from multiple providers to get the best deal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                  Bank transfers are cheaper but slower than cash pickup
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                  Mobile money is fastest but may have lower limits
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#FFD700] rounded-full"></span>
                  Contact support@ethiodiaspora.com for assistance
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemittancePage;
