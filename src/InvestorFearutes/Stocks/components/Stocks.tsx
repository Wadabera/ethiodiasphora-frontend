import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BarChart2,
  Briefcase,
  Layers,
  ArrowDownLeft,
  PieChart,
} from "lucide-react";

interface Stock {
  ticker: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  marketCap: string;
  peRatio: number;
  dividendYield: string;
  volume: string;
}

export default function Stocks() {
  const [activeTab, setActiveTab] = useState<"all" | "banking" | "telecom" | "industry">("all");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY");
  const [shareCount, setShareCount] = useState<number>(50);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const stockList: Stock[] = [
    {
      ticker: "ETHIOTEL",
      name: "Ethio Telecom (Pre-IPO)",
      sector: "telecom",
      price: 125.0,
      change: 5.4,
      marketCap: "150.0 Billion ETB",
      peRatio: 11.2,
      dividendYield: "8.5%",
      volume: "1,240,000",
    },
    {
      ticker: "AWASH",
      name: "Awash International Bank",
      sector: "banking",
      price: 450.0,
      change: 2.8,
      marketCap: "52.4 Billion ETB",
      peRatio: 7.8,
      dividendYield: "24.2%",
      volume: "480,000",
    },
    {
      ticker: "DASHEN",
      name: "Dashen Bank Share Company",
      sector: "banking",
      price: 385.0,
      change: 1.6,
      marketCap: "38.2 Billion ETB",
      peRatio: 8.4,
      dividendYield: "21.5%",
      volume: "310,000",
    },
    {
      ticker: "ABYSSINIA",
      name: "Abyssinia Coffee Agro-Industry PLC",
      sector: "industry",
      price: 250.0,
      change: 4.8,
      marketCap: "18.5 Billion ETB",
      peRatio: 9.6,
      dividendYield: "18.5%",
      volume: "520,000",
    },
    {
      ticker: "CBE-BOND",
      name: "CBE Infrastructure Capital Bond",
      sector: "banking",
      price: 1000.0,
      change: 0.2,
      marketCap: "85.0 Billion ETB",
      peRatio: 6.5,
      dividendYield: "16.8%",
      volume: "890,000",
    },
    {
      ticker: "BGI-ETH",
      name: "BGI Ethiopia Breweries",
      sector: "industry",
      price: 520.0,
      change: -0.8,
      marketCap: "28.0 Billion ETB",
      peRatio: 12.1,
      dividendYield: "14.0%",
      volume: "190,000",
    },
  ];

  const filteredStocks = stockList.filter((s) => {
    if (activeTab === "all") return true;
    return s.sector === activeTab;
  });

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setShareCount(50);
    setOrderSuccess(false);
  };

  const fillDemoTrade = () => {
    if (!selectedStock) {
      setSelectedStock(stockList[0]);
    }
    setShareCount(100);
    setOrderType("BUY");
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedStock(null);
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-xs font-semibold border border-[#FFD700]/30 mb-3">
              <BarChart2 size={13} /> Ethiopian Stock Exchange (ESX) Equities
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Securities Trading & Share Marketplace
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Buy and sell equity shares of premier commercial banks, state-owned enterprises, and agribusinesses on Ethiopia's regulated capital market.
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoTrade}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer self-start"
          >
            <Sparkles size={15} /> Demo 1-Click Order
          </button>
        </div>
      </div>

      {/* Main Trading Layout: Stocks List & Order Pad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Stocks Table */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {[
              { id: "all", label: "All Equities" },
              { id: "telecom", label: "Telecom & Tech" },
              { id: "banking", label: "Banks & Bonds" },
              { id: "industry", label: "Agro & Industry" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-[#FFD700] text-black shadow-md"
                    : "bg-[#0F0F0F] text-gray-400 border border-gray-800 hover:text-white hover:border-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Company / Ticker</th>
                    <th className="py-3.5 px-4">Share Price</th>
                    <th className="py-3.5 px-4">24h Gain</th>
                    <th className="py-3.5 px-4">Div. Yield</th>
                    <th className="py-3.5 px-4">Market Cap</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {filteredStocks.map((stock) => (
                    <tr
                      key={stock.ticker}
                      onClick={() => handleSelectStock(stock)}
                      className={`hover:bg-gray-900/60 transition-colors cursor-pointer ${
                        selectedStock?.ticker === stock.ticker ? "bg-[#FFD700]/10" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{stock.name}</div>
                        <div className="text-[10px] text-[#FFD700] font-mono">{stock.ticker}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        {stock.price.toFixed(2)} ETB
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            stock.change >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {stock.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-yellow-400 font-semibold">
                        {stock.dividendYield}
                      </td>
                      <td className="py-3.5 px-4 text-gray-400">{stock.marketCap}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectStock(stock);
                          }}
                          className="px-3 py-1.5 bg-[#FFD700]/15 hover:bg-[#FFD700] text-[#FFD700] hover:text-black border border-[#FFD700]/30 rounded-lg text-xs font-bold transition-all"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Instant Trade Order Pad */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
                  <Briefcase size={16} />
                </div>
                <h3 className="font-bold text-white text-sm">ESX Order Pad</h3>
              </div>
              <button
                type="button"
                onClick={fillDemoTrade}
                className="text-[11px] text-[#FFD700] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <Sparkles size={11} /> Auto-fill Demo
              </button>
            </div>

            {orderSuccess ? (
              <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 size={36} className="text-green-400 mx-auto" />
                <h4 className="text-white font-bold text-base">Trade Order Executed!</h4>
                <p className="text-xs text-gray-300">
                  {orderType} {shareCount} shares of {selectedStock?.ticker || "ETHIOTEL"} confirmed.
                </p>
                <div className="text-[11px] text-green-400 font-mono">
                  Settled on ESX Brokerage Ledger
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                {/* Buy / Sell Selector */}
                <div className="grid grid-cols-2 gap-2 bg-[#1A1A1A] p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOrderType("BUY")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      orderType === "BUY"
                        ? "bg-green-500 text-black shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Buy Shares
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType("SELL")}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      orderType === "SELL"
                        ? "bg-red-500 text-white shadow"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Sell Shares
                  </button>
                </div>

                {/* Stock Selector */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Select Equity / Stock
                  </label>
                  <select
                    value={selectedStock?.ticker || stockList[0].ticker}
                    onChange={(e) => {
                      const found = stockList.find((s) => s.ticker === e.target.value);
                      if (found) setSelectedStock(found);
                    }}
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                  >
                    {stockList.map((s) => (
                      <option key={s.ticker} value={s.ticker}>
                        {s.name} ({s.ticker}) - {s.price} ETB
                      </option>
                    ))}
                  </select>
                </div>

                {/* Share Count */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={shareCount}
                    onChange={(e) => setShareCount(parseInt(e.target.value) || 0)}
                    required
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                  />
                </div>

                {/* Calculation Summary */}
                <div className="bg-[#141414] border border-gray-800 rounded-xl p-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-400">
                    <span>Unit Price:</span>
                    <span className="text-white font-medium">
                      {(selectedStock?.price || stockList[0].price).toFixed(2)} ETB
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Brokerage Fee (0.2%):</span>
                    <span className="text-gray-300">
                      {(
                        (selectedStock?.price || stockList[0].price) *
                        shareCount *
                        0.002
                      ).toFixed(2)}{" "}
                      ETB
                    </span>
                  </div>
                  <div className="border-t border-gray-800 pt-2 flex justify-between font-bold text-white text-sm">
                    <span>Estimated Total:</span>
                    <span className="text-[#FFD700]">
                      {(
                        (selectedStock?.price || stockList[0].price) * shareCount * 1.002
                      ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                      ETB
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                    orderType === "BUY"
                      ? "bg-gradient-to-r from-green-500 to-emerald-400 text-black hover:opacity-90"
                      : "bg-gradient-to-r from-red-600 to-rose-500 text-white hover:opacity-90"
                  }`}
                >
                  Confirm {orderType} Order
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
