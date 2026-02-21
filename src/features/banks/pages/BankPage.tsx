// src/features/banks/pages/BanksPage.tsx
import React, { useState, useEffect } from "react";
import BankSidebar from "../components/BankSidebar";
import ExchangeRateDisplay from "../components/ExchangeRateDisplay";
import { mockBankService } from "../data/mockBankService";
import type{ Bank } from "../types/bank.types";
import { Loader2 } from "lucide-react";

const BanksPage: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);

  // Load banks on mount
  useEffect(() => {
    const loadBanks = async () => {
      try {
        setLoading(true);
        const data = await mockBankService.getAllBanks();
        setBanks(data as Bank[]);
        setFilteredBanks(data as Bank[]);
        // Select first bank by default
        if (data.length > 0) {
          setSelectedBank(data[0] as Bank);
        }
      } catch (error) {
        console.error("Failed to load banks:", error);
      } finally {
        setLoading(false);
      }
    };
    loadBanks();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBanks(banks);
    } else {
      const filtered = banks.filter(
        (bank) =>
          bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bank.shortName.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredBanks(filtered);
    }
  }, [searchQuery, banks]);

  const handleSelectBank = (bank: Bank) => {
    setSelectedBank(bank);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading banks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Banks in Ethiopia</h1>
          <p className="text-gray-400 mt-2">
            Get up-to-date foreign exchange market rates for major currencies
            against the Ethiopian Birr (ETB)
          </p>
          <div className="mt-4 w-24 h-1 bg-yellow-500 rounded-full"></div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Bank List */}
          <div className="lg:col-span-4">
            <BankSidebar
              banks={filteredBanks}
              selectedBankId={selectedBank?.id || null}
              onSelectBank={handleSelectBank}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>

          {/* Main Content - Exchange Rates */}
          <div className="lg:col-span-8">
            {selectedBank ? (
              <ExchangeRateDisplay bank={selectedBank} />
            ) : (
              <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
                <p className="text-gray-400">
                  Select a bank to view exchange rates
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Responsive Note */}
        <div className="mt-8 text-center text-sm text-gray-500 lg:hidden">
          <p>For the best experience, view on a larger screen</p>
        </div>
      </div>
    </div>
  );
};

export default BanksPage;
