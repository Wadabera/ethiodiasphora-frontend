// src/features/banks/components/BankSidebar.tsx
import React from "react";
import { Search,  } from "lucide-react";
import type{ Bank } from "../types/bank.types";

interface BankSidebarProps {
  banks: Bank[];
  selectedBankId: string | null;
  onSelectBank: (bank: Bank) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const BankSidebar: React.FC<BankSidebarProps> = ({
  banks,
  selectedBankId,
  onSelectBank,
  searchQuery,
  onSearchChange,
}) => {
  // Group banks by category
  const governmentBanks = banks.filter((b) => b.category === "government");
  const privateBanks = banks.filter((b) => b.category === "private");

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white mb-2">Banks in Ethiopia</h2>
        <p className="text-sm text-gray-400">
          {banks.length} banks • Updated daily
        </p>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search bank..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Bank Lists */}
      <div className="p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
        {/* Government Banks */}
        {governmentBanks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Government Banks ({governmentBanks.length})
            </h3>
            <div className="space-y-1">
              {governmentBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => onSelectBank(bank)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedBankId === bank.id
                      ? "bg-yellow-500/10 border border-yellow-500/50"
                      : "hover:bg-gray-800 border border-transparent"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/32?text=Bank";
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${
                        selectedBankId === bank.id
                          ? "text-yellow-500"
                          : "text-white"
                      }`}
                    >
                      {bank.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Est. {bank.established}
                    </p>
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
            <div className="space-y-1">
              {privateBanks.map((bank) => (
                <button
                  key={bank.id}
                  onClick={() => onSelectBank(bank)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                    selectedBankId === bank.id
                      ? "bg-yellow-500/10 border border-yellow-500/50"
                      : "hover:bg-gray-800 border border-transparent"
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-800 rounded-full overflow-hidden flex-shrink-0">
                    <img
                      src={bank.logo}
                      alt={bank.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/32?text=Bank";
                      }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${
                        selectedBankId === bank.id
                          ? "text-yellow-500"
                          : "text-white"
                      }`}
                    >
                      {bank.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Est. {bank.established}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Scrollbar Styles */}
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

export default BankSidebar;
