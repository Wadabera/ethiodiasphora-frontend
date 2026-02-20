// features/remittance/components/RemittanceCalculator.tsx
import React, { useState, useEffect } from 'react';

interface RemittanceCalculatorProps {
  sendAmount: number;
  onAmountChange: (amount: number) => void;
  selectedProvider: any;
  calculation: any;
  className?: string;
}

const RemittanceCalculator: React.FC<RemittanceCalculatorProps> = ({
  sendAmount,
  onAmountChange,
  selectedProvider,
  calculation,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(sendAmount.toString());

  useEffect(() => {
    setInputValue(sendAmount.toString());
  }, [sendAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setInputValue(value);
    if (value) {
      onAmountChange(parseInt(value, 10));
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 ${className}`}>
      <h3 className="text-xl font-bold text-black mb-4">💱 Calculate Transfer</h3>
      
      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          You Send
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
            {selectedProvider?.fromCurrency || 'USD'}
          </span>
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            className="w-full pl-16 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-[#FFD700] focus:ring-2 focus:ring-yellow-200 outline-none text-lg font-bold"
            placeholder="0"
          />
        </div>
      </div>

      {/* Exchange Rate Display */}
      {selectedProvider && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Exchange Rate:</span>
            <span className="font-bold text-black">
              1 {selectedProvider.fromCurrency} = {selectedProvider.exchangeRate} ETB
            </span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-gray-600">Fee:</span>
            <span className="font-bold text-red-600">
              {selectedProvider.feeType === 'fixed' 
                ? `${selectedProvider.fee} ${selectedProvider.fromCurrency}`
                : `${selectedProvider.fee}%`
              }
            </span>
          </div>
        </div>
      )}

      {/* Result */}
      {calculation && (
        <div className="bg-black text-[#FFD700] rounded-xl p-6">
          <p className="text-sm text-yellow-400 mb-1">Recipient Gets</p>
          <p className="text-3xl font-bold mb-2">
            {calculation.receiveAmount.toLocaleString()} ETB
          </p>
          <div className="flex justify-between text-sm text-yellow-400">
            <span>Fee: {calculation.fee.toFixed(2)} {selectedProvider?.fromCurrency}</span>
            <span>Time: {calculation.deliveryTime}</span>
          </div>
        </div>
      )}

      {!selectedProvider && (
        <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
          Select a provider to calculate
        </div>
      )}
    </div>
  );
};

export default RemittanceCalculator;