// src/features/remittance/components/ProviderTable.tsx
import React, { useState } from "react";
import {
  Building2,
  Clock,
  Star,
SortAscIcon,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  Check,
} from "lucide-react";
import {type DisplayProvider } from "../types/remittance.types";

interface ProviderTableProps {
  providers: DisplayProvider[];
  onSelectProvider: (provider: DisplayProvider) => void;
  selectedProviderId?: string;
}

type SortField =
  | "name"
  | "exchangeRate"
  | "fee"
  | "amountReceived"
  | "deliveryTime";
type SortDirection = "asc" | "desc";

const ProviderTable: React.FC<ProviderTableProps> = ({
  providers,
  onSelectProvider,
  selectedProviderId,
}) => {
  const [sortField, setSortField] = useState<SortField>("amountReceived");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleRowExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const sortedProviders = [...providers].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === "name") {
      aValue = a.name.toLowerCase();
      bValue = b.name.toLowerCase();
    }

    if (sortField === "deliveryTime") {
      // Convert delivery time to minutes for comparison
      aValue = convertTimeToMinutes(a.deliveryTime);
      bValue = convertTimeToMinutes(b.deliveryTime);
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const convertTimeToMinutes = (time: string): number => {
    if (time.includes("minutes")) return 1;
    if (time.includes("hour")) return 60;
    if (time.includes("days")) return 1440;
    return 9999;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-4 h-4 text-gray-500" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-yellow-500" />
    ) : (
      <ChevronDown className="w-4 h-4 text-yellow-500" />
    );
  };

  const getRateDifference = (provider: DisplayProvider) => {
    if (!provider.cashBuying || !provider.cashSelling) return null;
    return (
      ((provider.cashSelling - provider.cashBuying) / provider.cashBuying) *
      100
    ).toFixed(2);
  };

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          {/* Table Header */}
          <thead className="bg-gray-800/50 border-b border-gray-800">
            <tr>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-white transition-colors"
                >
                  Provider <SortAscIcon field="name" />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("exchangeRate")}
                  className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-white transition-colors"
                >
                  Rate <SortAscIcon field="exchangeRate" />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("fee")}
                  className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-white transition-colors"
                >
                  Fee <SortAscIcon field="fee" />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("amountReceived")}
                  className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-white transition-colors"
                >
                  You Get (ETB) <SortAscIcon field="amountReceived" />
                </button>
              </th>
              <th className="p-4 text-left">
                <button
                  onClick={() => handleSort("deliveryTime")}
                  className="flex items-center gap-2 text-gray-400 font-medium text-sm hover:text-white transition-colors"
                >
                  Delivery <SortAscIcon field="deliveryTime" />
                </button>
              </th>
              <th className="p-4 text-left">
                <span className="text-gray-400 font-medium text-sm">
                  Action
                </span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-800">
            {sortedProviders.map((provider) => {
              const isSelected = selectedProviderId === provider.name;
              const isExpanded = expandedRows.has(provider.id);
              const rateDiff = getRateDifference(provider);

              return (
                <React.Fragment key={provider.id}>
                  {/* Main Row */}
                  <tr
                    className={`group hover:bg-gray-800/30 transition-colors cursor-pointer ${
                      isSelected ? "bg-yellow-500/5" : ""
                    }`}
                    onClick={() => onSelectProvider(provider)}
                  >
                    {/* Provider Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {provider.logo ? (
                            <img
                              src={provider.logo}
                              alt={provider.name}
                              className="w-10 h-10 rounded-lg object-contain bg-white p-1"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-gray-900" />
                            </div>
                          )}
                          {provider.isBest && (
                            <div className="absolute -top-1 -right-1">
                              <div className="bg-green-500 rounded-full p-0.5">
                                <Star className="w-3 h-3 fill-gray-900 text-gray-900" />
                              </div>
                            </div>
                          )}
                        </div>
                        <div>
                          <p
                            className={`font-semibold ${isSelected ? "text-yellow-500" : "text-white"}`}
                          >
                            {provider.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {provider.type === "ethiopian_bank"
                              ? "Bank"
                              : "Provider"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Exchange Rate */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">
                          {provider.exchangeRate.toFixed(4)}
                        </span>
                        {provider.exchangeRate > 130 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </td>

                    {/* Fee */}
                    <td className="p-4">
                      <span
                        className={
                          provider.fee === 0
                            ? "text-green-500 font-semibold"
                            : "text-white"
                        }
                      >
                        {provider.fee === 0
                          ? "No fee"
                          : provider.feeType === "fixed"
                            ? `$${provider.fee}`
                            : `${provider.fee}%`}
                      </span>
                    </td>

                    {/* Amount Received */}
                    <td className="p-4">
                      <span className="text-green-400 font-bold">
                        {provider.amountReceived.toFixed(2)}
                      </span>
                    </td>

                    {/* Delivery Time */}
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{provider.deliveryTime}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <div className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Selected
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectProvider(provider);
                            }}
                            className="bg-gray-800 hover:bg-yellow-500 text-gray-400 hover:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                          >
                            Select
                          </button>
                        )}

                        {/* Expand Button for Bank Details */}
                        {provider.type === "ethiopian_bank" &&
                          provider.cashBuying &&
                          provider.cashSelling && (
                            <button
                              onClick={(e) => toggleRowExpand(provider.id, e)}
                              className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row - Bank Details */}
                  {isExpanded && provider.type === "ethiopian_bank" && (
                    <tr className="bg-gray-800/20">
                      <td colSpan={6} className="p-4">
                        <div className="border-l-2 border-yellow-500 pl-4 ml-16">
                          <h4 className="text-white font-semibold mb-3">
                            Exchange Rate Details
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {/* Cash Buying */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Cash Buying
                              </p>
                              <p className="text-white font-bold text-lg">
                                {provider.cashBuying?.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600">
                                1 USD ={" "}
                                {(
                                  (provider.cashBuying! /
                                    provider.amountReceived) *
                                  1000
                                ).toFixed(4)}{" "}
                                ETB
                              </p>
                            </div>

                            {/* Cash Selling */}
                            <div className="bg-gray-800/50 rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Cash Selling
                              </p>
                              <p className="text-white font-bold text-lg">
                                {provider.cashSelling?.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600">
                                1 USD ={" "}
                                {(
                                  (provider.cashSelling! /
                                    provider.amountReceived) *
                                  1000
                                ).toFixed(4)}{" "}
                                ETB
                              </p>
                            </div>

                            {/* Transaction Buying */}
                            {provider.transactionBuying && (
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">
                                  Transaction Buying
                                </p>
                                <p className="text-white font-bold text-lg">
                                  {provider.transactionBuying.toFixed(2)}
                                </p>
                              </div>
                            )}

                            {/* Transaction Selling */}
                            {provider.transactionSelling && (
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">
                                  Transaction Selling
                                </p>
                                <p className="text-white font-bold text-lg">
                                  {provider.transactionSelling.toFixed(2)}
                                </p>
                              </div>
                            )}

                            {/* Rate Spread */}
                            {rateDiff && (
                              <div className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-xs text-gray-500 mb-1">
                                  Spread
                                </p>
                                <p className="text-yellow-500 font-bold text-lg">
                                  {rateDiff}%
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Additional Info */}
                          <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>
                                Last updated: {new Date().toLocaleTimeString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>Rating: {provider.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {providers.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400">No providers found</p>
        </div>
      )}

      {/* Table Footer */}
      <div className="border-t border-gray-800 p-4 bg-gray-800/20">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {providers.length} providers</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Best rate</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Selected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderTable;
