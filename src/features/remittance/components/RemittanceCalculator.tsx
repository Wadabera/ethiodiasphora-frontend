import React, { useState, useEffect } from "react";
import { ArrowDownUp, Clock,  Percent, Info } from "lucide-react";
import type { RemittanceProvider } from "../types/remittance.types";

interface RemittanceCalculatorProps {
  fromCurrency?: string;
  toCurrency?: string;
  exchangeRate?: number;
  onCalculate?: (amount: number, method: string) => void;
  onSendMoney?: () => void;
  selectedProvider?: RemittanceProvider | null;
  className?: string;
}

const RemittanceCalculator: React.FC<RemittanceCalculatorProps> = ({
  fromCurrency = "USD",
  toCurrency = "ETB",
  exchangeRate = 131.0083,
  onCalculate,
  onSendMoney,
  selectedProvider,
  className = "",
}) => {
  const [amount, setAmount] = useState<number>(1000);
  const [receiveMethod, setReceiveMethod] = useState<string>("bank_transfer");
  const [fee, setFee] = useState<number>(0);
  const [transferTime, setTransferTime] = useState<string>("Within 1 hour");
  const [isSwapping, setIsSwapping] = useState<boolean>(false);

  const receivedAmount = (amount - fee) * exchangeRate;

  const handleSwapCurrencies = () => {
    setIsSwapping(true);
    // Swap logic would go here
    setTimeout(() => setIsSwapping(false), 300);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setAmount(value);
    onCalculate?.(value, receiveMethod);
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const method = e.target.value;
    setReceiveMethod(method);
    onCalculate?.(amount, method);
  };

  const methods = [
    { value: "bank_transfer", label: "Bank Transfer", time: "1-2 hours" },
    { value: "cash_pickup", label: "Cash Pickup", time: "minutes" },
    { value: "mobile_wallet", label: "Mobile Wallet", time: "instant" },
    { value: "debit_card", label: "Debit Card Deposit", time: "Within 1 hour" },
  ];

  useEffect(() => {
    const selectedMethod = methods.find((m) => m.value === receiveMethod);
    setTransferTime(selectedMethod?.time || "Within 1 hour");
    setFee(receiveMethod === "debit_card" ? 0 : 2.99);
  }, [receiveMethod]);

  const handleSendMoney = () => {
    if (!selectedProvider) {
      alert("Please select a provider from the list below first");
      return;
    }
    onSendMoney?.();
  };

  return (
    <div
      className={`bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl ${className}`}
    >
      {/* Selected Provider Indicator */}
      {selectedProvider && (
        <div className="mb-6 p-3 bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center gap-3">
          {selectedProvider.logo ? (
            <img
              src={selectedProvider.logo}
              alt={selectedProvider.name}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-black">
                {selectedProvider.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm text-white">
              Sending with{" "}
              <span className="font-bold text-yellow-500">
                {selectedProvider.name}
              </span>
            </p>
          </div>
          <Info className="w-4 h-4 text-gray-500" />
        </div>
      )}

      {/* You send */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          You send
        </label>
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="1"
              className="w-full bg-gray-800 border border-gray-700 text-white text-2xl font-bold rounded-xl py-4 px-4 focus:outline-none focus:border-yellow-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-xl px-4 py-4">
            <span className="text-white font-bold">{fromCurrency}</span>
            <button
              onClick={handleSwapCurrencies}
              className={`p-1 hover:bg-gray-700 rounded-lg transition-transform ${isSwapping ? "rotate-180" : ""}`}
            >
              <ArrowDownUp className="w-4 h-4 text-yellow-500" />
            </button>
            <span className="text-white font-bold">{toCurrency}</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
        </p>
      </div>

      {/* They get */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          They get
        </label>
        <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-4">
          <div className="text-3xl md:text-4xl font-bold text-white">
            {receivedAmount.toFixed(2)}{" "}
            <span className="text-lg text-gray-400">{toCurrency}</span>
          </div>
        </div>
      </div>

      {/* Receive method */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Receive method
        </label>
        <select
          value={receiveMethod}
          onChange={handleMethodChange}
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
        >
          {methods.map((method) => (
            <option
              key={method.value}
              value={method.value}
              className="bg-gray-900"
            >
              {method.label}
            </option>
          ))}
        </select>
      </div>

      {/* Fee and Time */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Percent className="w-3 h-3" />
            Fee
          </div>
          <p className="text-white font-semibold">
            {fee === 0 ? "0" : fee} {fromCurrency}
          </p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3">
          <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
            <Clock className="w-3 h-3" />
            Transfer time
          </div>
          <p className="text-white font-semibold">{transferTime}</p>
        </div>
      </div>

      {/* Total to pay */}
      <div className="mt-4 p-3 bg-gray-800/30 border border-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Total to pay</span>
          <span className="text-lg font-bold text-white">
            {amount} {fromCurrency}
          </span>
        </div>
      </div>

      {/* Send Money Button */}
      <button
        onClick={handleSendMoney}
        disabled={!selectedProvider}
        className={`w-full mt-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-yellow-600/20 ${
          !selectedProvider
            ? "opacity-50 cursor-not-allowed"
            : "hover:from-yellow-500 hover:to-yellow-600"
        }`}
      >
        {selectedProvider ? "Send Money" : "Select a provider first"}
      </button>

      {/* Provider hint */}
      {!selectedProvider && (
        <p className="text-xs text-gray-500 text-center mt-3">
          👆 Select a provider from the table below to continue
        </p>
      )}
    </div>
  );
};

export default RemittanceCalculator;
