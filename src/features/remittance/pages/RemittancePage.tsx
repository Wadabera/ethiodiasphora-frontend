// src/features/remittance/pages/RemittancePage.tsx
import React, { useState, useEffect } from "react";
import { useRemittance } from "../hooks/useRemittance"; // 👈 Default import (no curly braces)
import RemittanceHero from "../components/RemittanceHero";
import RemittanceCalculator from "../components/RemittanceCalculator";
import RemittanceStats from "../components/RemittanceStats";
import RemittanceComparisonTable from "../components/RemittanceComparisonTable";
import DeliveryMethodsGrid from "../components/DeliveryMethodsGrid";
import LoadingState from "../components/LoadingState";
import { RefreshCw } from "lucide-react";

const RemittancePage: React.FC = () => {
  const {
    // Data
    compareData,
    displayProviders,
    selectedProvider,
    loading,
    error,
    calculatorInput,

    // Actions
    fetchCompare,
    selectProvider,
    setCalculatorInput,
    getFilteredProviders,
    getBestProvider,
    getSavings,
  } = useRemittance();

  const [refreshing, setRefreshing] = useState(false);
  const [filteredProviders, setFilteredProviders] = useState(displayProviders);

  useEffect(() => {
    setFilteredProviders(getFilteredProviders());
  }, [displayProviders, getFilteredProviders]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCompare(calculatorInput.fromCurrency, calculatorInput.amount);
    setRefreshing(false);
  };

  const handleProviderSelect = (provider: any) => {
    selectProvider({
      provider: provider.name,
      fromCurrency: calculatorInput.fromCurrency,
      toCurrency: calculatorInput.toCurrency,
      exchangeRate: provider.exchangeRate,
      fee: provider.fee,
      feeType: provider.feeType,
      deliveryMethod: provider.deliveryMethod,
      deliveryTime: provider.deliveryTime,
    });

    document
      .getElementById("calculator")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const bestProvider = getBestProvider();
  const savings = getSavings();

  if (loading && displayProviders.length === 0) {
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <LoadingState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <RemittanceHero />

        {compareData && (
          <RemittanceStats
            bestRate={`${compareData.bestOption.exchangeRate.toFixed(2)} ETB`}
            fastestTime="Minutes"
            lowestFee="No fee"
            totalSavings={
              savings ? `${savings.amount.toFixed(0)} ETB` : "75,754 ETB"
            }
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div id="calculator">
            <RemittanceCalculator
              fromCurrency={calculatorInput.fromCurrency}
              toCurrency={calculatorInput.toCurrency}
              amount={calculatorInput.amount}
              deliveryMethod={calculatorInput.deliveryMethod}
              exchangeRate={
                selectedProvider?.exchangeRate ||
                compareData?.bestOption.exchangeRate ||
                131.0083
              }
              selectedProviderName={selectedProvider?.provider}
              onAmountChange={(amount) => setCalculatorInput({ amount })}
              onCurrencyChange={(from, to) => {
                setCalculatorInput({ fromCurrency: from, toCurrency: to });
                fetchCompare(from, calculatorInput.amount);
              }}
              onMethodChange={(method) =>
                setCalculatorInput({ deliveryMethod: method })
              }
              onSendMoney={() => {
                if (!selectedProvider) {
                  alert("Please select a provider first");
                  return;
                }
                alert(
                  `Sending ${calculatorInput.amount} ${calculatorInput.fromCurrency} with ${selectedProvider.provider}`,
                );
              }}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Best Options</h2>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 text-gray-400 ${refreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>

            {filteredProviders.slice(0, 2).map((provider) => (
              <div
                key={provider.id}
                className={`bg-gray-900 border rounded-xl p-4 hover:border-yellow-500/50 transition-all cursor-pointer ${
                  selectedProvider?.provider === provider.name
                    ? "border-yellow-500 bg-yellow-500/10"
                    : "border-gray-800"
                }`}
                onClick={() => handleProviderSelect(provider)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {provider.logo ? (
                      <img
                        src={provider.logo}
                        alt={provider.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-black">
                          {provider.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">{provider.name}</p>
                      <p className="text-xs text-gray-400">
                        {provider.type === "ethiopian_bank"
                          ? "Bank"
                          : "Provider"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-bold">
                      {provider.amountReceived.toFixed(2)} ETB
                    </p>
                    <p className="text-xs text-gray-500">
                      {provider.deliveryTime}
                    </p>
                  </div>
                </div>
                {selectedProvider?.provider === provider.name && (
                  <div className="mt-2 text-xs text-yellow-500 font-semibold">
                    ✓ Selected
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {filteredProviders.length > 0 && (
          <div className="mb-12">
            <RemittanceComparisonTable
              providers={filteredProviders}
              onSelectProvider={handleProviderSelect}
            />
          </div>
        )}

        <DeliveryMethodsGrid />

        {error && (
          <div className="mt-8 p-4 bg-red-900/20 border border-red-800 rounded-xl">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemittancePage;
