// features/banks/pages/BankRatesPage.tsx
import React, { useEffect, useState } from "react";
import BankExchangeRates from "../components/BankExchangeRates";

const BankRatesPage: React.FC = () => {
  const [banks, setBanks] = useState([]);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    fetchBankData();
  }, []);

  const fetchBankData = async () => {
    try {
      // Simulated API response - replace with actual API calls
      const mockBanks = [
        {
          _id: "1",
          name: "Abay Bank",
          code: "ABAY",
          isGovernment: false,
          exchangeRates: [
            {
              currency: "USD",
              cashBuyingRate: 152.9837,
              cashSellingRate: 156.0434,
              buyingRate: 152.628,
              sellingRate: 155.6806,
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          _id: "2",
          name: "Ahadu Bank S.C.",
          code: "AHADU",
          isGovernment: false,
          exchangeRates: [
            {
              currency: "USD",
              cashBuyingRate: 152.8868,
              cashSellingRate: 155.9445,
              buyingRate: 152.8868,
              sellingRate: 155.9445,
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          _id: "3",
          name: "Amhara Bank S.C.",
          code: "AMHARA",
          isGovernment: false,
          exchangeRates: [
            {
              currency: "USD",
              cashBuyingRate: 153.4121,
              cashSellingRate: 156.4803,
              buyingRate: 153.4121,
              sellingRate: 156.4803,
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
        {
          _id: "4",
          name: "Awash Bank S.C.",
          code: "AWASH",
          isGovernment: false,
          exchangeRates: [
            {
              currency: "USD",
              cashBuyingRate: 153.1589,
              cashSellingRate: 156.2221,
              buyingRate: 152.1641,
              sellingRate: null,
              lastUpdated: new Date().toISOString(),
            },
          ],
        },
      ];

      const mockRates = {
        baseCurrency: "ETB",
        rates: {
          USD: {
            averageBuying: 153.0,
            averageSelling: 156.2,
            bestBuyingRate: 153.5,
            worstBuyingRate: 152.5,
            rateSpread: 1.0,
            totalBanks: 7,
          },
        },
        lastUpdated: new Date().toISOString(),
      };

      setBanks(mockBanks);
      setRates(mockRates.rates);
      setLastUpdated(mockRates.lastUpdated);
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero Section with Brand Colors */}
      <div className="bg-black text-yellow-500 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">
            Ethiopian Bank Exchange Rates
          </h1>
          <p className="text-xl text-yellow-400 mb-6">
            Real-time currency exchange rates from all Ethiopian banks
          </p>
          <div className="flex items-center gap-4 text-sm">
            <span className="bg-yellow-500 text-black px-4 py-2 rounded-lg font-medium">
              {selectedCurrency} Rates
            </span>
            <span className="text-yellow-400">
              Last Updated: {new Date(lastUpdated).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <BankExchangeRates
          banks={banks}
          rates={rates}
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
          lastUpdated={lastUpdated}
        />
      </div>
    </div>
  );
};

export default BankRatesPage;
