import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  DollarSign,
  Layers,
  ArrowUpRight,
  Globe,
  Sparkles,
  CheckCircle2,
  Calendar,
  BarChart3,
} from "lucide-react";

interface MarketItem {
  id: string;
  name: string;
  category: "Commodities" | "Currency" | "Indices" | "Agriculture";
  price: string;
  change: string;
  isPositive: boolean;
  unit: string;
  volume: string;
  high24h: string;
  low24h: string;
}

export default function Markets() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState("10");
  const [tradeSuccess, setTradeSuccess] = useState(false);

  const marketData: MarketItem[] = [
    {
      id: "ecx_coffee_yirg",
      name: "Washed Yirgacheffe Gr.1 Coffee",
      category: "Commodities",
      price: "ETB 4,850.00",
      change: "+3.8%",
      isPositive: true,
      unit: "per FKL (17kg)",
      volume: "1,420 Bags",
      high24h: "ETB 4,920.00",
      low24h: "ETB 4,710.00",
    },
    {
      id: "ecx_coffee_sid",
      name: "Natural Sidama Gr.2 Coffee",
      category: "Commodities",
      price: "ETB 4,250.00",
      change: "+2.1%",
      isPositive: true,
      unit: "per FKL (17kg)",
      volume: "2,150 Bags",
      high24h: "ETB 4,300.00",
      low24h: "ETB 4,180.00",
    },
    {
      id: "ecx_sesame_hum",
      name: "Humera Grade 1 Sesame",
      category: "Agriculture",
      price: "ETB 14,800.00",
      change: "+4.5%",
      isPositive: true,
      unit: "per Quintal (100kg)",
      volume: "860 Quintals",
      high24h: "ETB 15,100.00",
      low24h: "ETB 14,200.00",
    },
    {
      id: "fx_usd_etb",
      name: "USD / ETB Official Exchange",
      category: "Currency",
      price: "142.50 ETB",
      change: "+0.35%",
      isPositive: true,
      unit: "per 1 USD",
      volume: "$18.4M Daily",
      high24h: "143.10",
      low24h: "142.20",
    },
    {
      id: "fx_eur_etb",
      name: "EUR / ETB Official Exchange",
      category: "Currency",
      price: "154.20 ETB",
      change: "-0.15%",
      isPositive: false,
      unit: "per 1 EUR",
      volume: "€9.2M Daily",
      high24h: "154.90",
      low24h: "153.80",
    },
    {
      id: "ecx_teff_mag",
      name: "Magna White Teff (Ada'a)",
      category: "Agriculture",
      price: "ETB 11,200.00",
      change: "+1.2%",
      isPositive: true,
      unit: "per Quintal (100kg)",
      volume: "1,100 Quintals",
      high24h: "ETB 11,350.00",
      low24h: "ETB 11,000.00",
    },
    {
      id: "esx_all_share",
      name: "ESX All-Share Benchmark Index",
      category: "Indices",
      price: "1,248.60 pts",
      change: "+1.75%",
      isPositive: true,
      unit: "Index Points",
      volume: "3.4M Shares",
      high24h: "1,255.00",
      low24h: "1,230.50",
    },
    {
      id: "ecx_soybean",
      name: "Non-GMO Export Soybeans",
      category: "Agriculture",
      price: "ETB 6,450.00",
      change: "-0.8%",
      isPositive: false,
      unit: "per Quintal (100kg)",
      volume: "640 Quintals",
      high24h: "ETB 6,600.00",
      low24h: "6,400.00",
    },
  ];

  const filteredItems = marketData.filter((item) => {
    const matchesCat =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenTrade = (item: MarketItem) => {
    setSelectedItem(item);
    setTradeQuantity("10");
    setTradeSuccess(false);
    setShowTradeModal(true);
  };

  const handleFillDemoTrade = () => {
    setTradeQuantity("25");
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeSuccess(true);
    setTimeout(() => {
      setTradeSuccess(false);
      setShowTradeModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-xs font-semibold border border-[#FFD700]/30 mb-3">
              <Globe size={13} /> Ethiopian Capital & Commodity Markets
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Market Intelligence & Live Quotes
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Track live commodity auctions from the Ethiopian Commodity Exchange (ECX), national foreign exchange rates, and Ethiopian Stock Exchange (ESX) indices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenTrade(marketData[0])}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
            >
              <Sparkles size={14} /> Place Market Order
            </button>
          </div>
        </div>
      </div>

      {/* Quick Indices Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {marketData.slice(0, 4).map((item) => (
          <div
            key={item.id}
            onClick={() => handleOpenTrade(item)}
            className="p-4 bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-xl cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="truncate">{item.name}</span>
              <span
                className={`font-bold flex items-center gap-0.5 ${
                  item.isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.change}
              </span>
            </div>
            <div className="text-lg font-bold text-white group-hover:text-[#FFD700] transition-colors">
              {item.price}
            </div>
            <div className="text-[10px] text-gray-500">{item.unit}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commodities, indices, FX..."
            className="w-full bg-[#1A1A1A] border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-gray-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Sector:
          </span>
          {["All", "Commodities", "Agriculture", "Currency", "Indices"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#FFD700] text-black font-bold"
                    : "bg-[#1A1A1A] text-gray-300 hover:bg-gray-800 border border-gray-800"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Market Items Table */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] border-b border-gray-800 text-gray-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Instrument / Commodity</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Latest Price</th>
                <th className="py-3.5 px-4">24h Change</th>
                <th className="py-3.5 px-4">24h High / Low</th>
                <th className="py-3.5 px-4">Auction Volume</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-white">
                    <div>{item.name}</div>
                    <div className="text-[10px] text-gray-500 font-normal">{item.unit}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-[#1A1A1A] border border-gray-800 text-gray-300 text-[11px]">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white text-sm">
                    {item.price}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        item.isPositive ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {item.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {item.change}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-400">
                    <span className="text-gray-300">{item.high24h}</span> /{" "}
                    <span>{item.low24h}</span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-300">{item.volume}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenTrade(item)}
                      className="px-3 py-1.5 bg-[#FFD700]/10 hover:bg-[#FFD700] text-[#FFD700] hover:text-black border border-[#FFD700]/30 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    >
                      Trade / Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F0F0F] border border-[#FFD700]/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-[#FFD700]/10 text-[#FFD700]">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Place Market Order</h3>
                  <p className="text-[11px] text-gray-400">{selectedItem.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleFillDemoTrade}
                className="px-2.5 py-1 bg-[#FFD700]/20 hover:bg-[#FFD700]/30 border border-[#FFD700]/40 text-[#FFD700] rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Sparkles size={12} /> Fill Demo
              </button>
            </div>

            {tradeSuccess ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-center space-y-2">
                <CheckCircle2 size={32} className="text-green-400 mx-auto" />
                <h4 className="text-white font-bold text-sm">Order Dispatched to ECX!</h4>
                <p className="text-xs text-gray-400">
                  Your bid for {tradeQuantity} {selectedItem.unit} was successfully queued.
                </p>
              </div>
            ) : (
              <form onSubmit={handleExecuteTrade} className="space-y-4">
                <div className="bg-[#1A1A1A] p-3 rounded-xl border border-gray-800 flex justify-between text-xs">
                  <span className="text-gray-400">Current Unit Quote:</span>
                  <span className="text-white font-bold">{selectedItem.price}</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Order Quantity ({selectedItem.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(e.target.value)}
                    required
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTradeModal(false)}
                    className="flex-1 py-2.5 border border-gray-800 text-gray-400 rounded-xl text-xs hover:bg-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black font-bold rounded-xl text-xs hover:opacity-90 shadow-lg transition-all"
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
