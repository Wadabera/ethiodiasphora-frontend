// features/banks/components/ExchangeRateTable.tsx
import React from "react";
import type{ Bank } from "../types/bank.types";

interface ExchangeRateTableProps {
  banks: Bank[];
  selectedCurrency: string;
}

const ExchangeRateTable: React.FC<ExchangeRateTableProps> = ({
  banks,
  selectedCurrency,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-black">
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Bank
              </th>
              <th className="px-6 py-4 text-left text-[#FFD700] font-bold">
                Currency
              </th>
              <th className="px-6 py-4 text-right text-[#FFD700] font-bold">
                Cash Buy
              </th>
              <th className="px-6 py-4 text-right text-[#FFD700] font-bold">
                Cash Sell
              </th>
              <th className="px-6 py-4 text-right text-[#FFD700] font-bold">
                Transaction Buy
              </th>
              <th className="px-6 py-4 text-right text-[#FFD700] font-bold">
                Transaction Sell
              </th>
            </tr>
          </thead>
          <tbody>
            {banks.map((bank, index) => {
              const rate = bank.exchangeRates?.find(
                (r) => r.currency === selectedCurrency,
              );

              return (
                <tr
                  key={bank._id}
                  className={`border-b border-gray-200 hover:bg-yellow-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {bank.logo ? (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-[#FFD700]">
                            {bank.code}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-black">{bank.name}</p>
                        <p className="text-xs text-gray-500">{bank.code}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-black">
                    {selectedCurrency}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-black">
                    {rate?.cashBuyingRate?.toFixed(4) || "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-black">
                    {rate?.cashSellingRate?.toFixed(4) || "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-green-600">
                    {rate?.buyingRate?.toFixed(4) || "—"}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-red-600">
                    {rate?.sellingRate?.toFixed(4) || "—"}
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
              Best Rate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-black rounded-full"></span>
              Cash Rate
            </span>
          </div>
          <p>Showing {banks.length} banks</p>
        </div>
      </div>
    </div>
  );
};

export default ExchangeRateTable;
