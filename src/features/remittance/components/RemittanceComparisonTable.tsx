// features/remittance/components/RemittanceComparisonTable.tsx
import React from "react";
import type { RemittanceProvider } from "../types/remittance.types";

interface RemittanceComparisonTableProps {
  providers: RemittanceProvider[];
  selectedCurrency: string;
  sendAmount: number;
  onSelectProvider: (provider: RemittanceProvider) => void;
}

const RemittanceComparisonTable: React.FC<RemittanceComparisonTableProps> = ({
  providers,
  selectedCurrency  ,
  sendAmount,
  onSelectProvider,
}) => {
  const calculateReceive = (provider: RemittanceProvider) => {
    const fee =
      provider.feeType === "fixed"
        ? provider.fee
        : (sendAmount * provider.fee) / 100;
    return (sendAmount - fee) * provider.exchangeRate;
  };

  const getBestValueProvider = () => {
    if (providers.length === 0) return null;
    return providers.reduce((best, current) => {
      const bestReceive = calculateReceive(best);
      const currentReceive = calculateReceive(current);
      return currentReceive > bestReceive ? current : best;
    });
  };

  const bestProvider = getBestValueProvider();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Provider
              </th>
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Rate
              </th>
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Fee
              </th>
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Delivery
              </th>
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Time
              </th>
              <th className="px-6 py-4 text-right text-[#FFD700] font-bold">
                You Get (ETB)
              </th>
              <th className="px-6 py-4 text-center text-[#FFD700] font-bold">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {providers.map((provider, index) => {
              const receiveAmount = calculateReceive(provider);
              const isBest = bestProvider?.provider === provider.provider;

              return (
                <tr
                  key={`${provider.provider}-${index}`}
                  className={`border-b border-gray-200 hover:bg-yellow-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {provider.logo ? (
                        <img
                          src={provider.logo}
                          alt={provider.provider}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-[#FFD700]">
                            {provider.provider.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-black">
                          {provider.provider}
                        </p>
                        {isBest && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            Best Value
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    {provider.exchangeRate}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-red-600 font-medium">
                      {provider.feeType === "fixed"
                        ? `${provider.fee} ${provider.fromCurrency}`
                        : `${provider.fee}%`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {provider.deliveryMethod === "bank_transfer"
                          ? "🏦"
                          : provider.deliveryMethod === "cash_pickup"
                            ? "💵"
                            : "📱"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {provider.deliveryMethod.split("_").join(" ")}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">
                      {provider.deliveryTime}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-green-600 text-lg">
                      {Math.round(receiveAmount).toLocaleString()} ETB
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => onSelectProvider(provider)}
                      className="bg-gray-900 text-[#FFD700] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-[#FFD700] rounded-full"></span>
              Best Value
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Fastest Delivery
            </span>
          </div>
          <p>Last Updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </div>
  );
};

export default RemittanceComparisonTable;
