import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Briefcase,
  Layers,
  Send,
  Building,
  RefreshCw,
} from "lucide-react";
import api from "@/services/api";

export default function DashboardHome() {
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([
    {
      _id: "6aba1edac1d9889b5b5b59dd",
      title: "Sheba Logistics & Cold Chain Infrastructure",
      businessName: "Abyssinia Specialty Coffee Export PLC",
      sector: "Logistics",
      fundingGoal: 250000,
      currentFunding: 0,
      expectedReturn: 21.0,
      investmentPeriod: 18,
      minimumInvestment: 2000,
    },
    {
      _id: "6aba1e9ec1d9889b5b5b59c5",
      title: "Specialty Yirgacheffe Coffee Processing Plant Expansion",
      businessName: "Abyssinia Specialty Coffee Export PLC",
      sector: "Agriculture",
      fundingGoal: 150000,
      currentFunding: 15000,
      expectedReturn: 18.5,
      investmentPeriod: 12,
      minimumInvestment: 1000,
    },
  ]);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/investments");
      if (res.data && res.data.investments && res.data.investments.length > 0) {
        setOpportunities(res.data.investments);
      }
    } catch (e) {
      console.log("Using cached opportunities for investor dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold border border-green-500/30 mb-3">
              <CheckCircle2 size={13} /> KYC Verified Investor
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome, Sara Tadesse
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              Diaspora Investment Dashboard • Directly fund high-yield Ethiopian businesses, trade on the capital market, and track your dividends in USD & ETB.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/investor/investments"
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              Browse Opportunities <ArrowUpRight size={15} />
            </Link>
            <Link
              to="/investor/remittance"
              className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <Send size={14} /> Send Money
            </Link>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Total Invested</span>
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">$15,000.00</div>
          <div className="text-xs text-green-400">1 Active Position</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Estimated Annual Return</span>
            <div className="p-2.5 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">+$2,775.00</div>
          <div className="text-xs text-yellow-400">+18.5% weighted ROI</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Portfolio Status</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <PieChart size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">Performing</div>
          <div className="text-xs text-blue-400">Yirgacheffe Coffee Processing</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">USD / ETB Exchange Rate</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Layers size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">142.50 ETB</div>
          <div className="text-xs text-purple-400">Official National Bank Rate</div>
        </div>
      </div>

      {/* Active Holdings */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Your Active Holdings</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live investments generating returns in Ethiopia.
            </p>
          </div>
          <Link
            to="/investor/portfolio"
            className="text-xs font-semibold text-[#FFD700] hover:underline flex items-center gap-1"
          >
            View Portfolio <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="bg-[#141414] border border-gray-800 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FFD700]/15 text-[#FFD700] font-semibold">
                  Agriculture Export
                </span>
                <span className="text-[11px] text-green-400 font-medium flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Investment
                </span>
              </div>
              <h3 className="font-bold text-white text-base">
                Specialty Yirgacheffe Coffee Processing Plant Expansion
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Issued by: <strong className="text-gray-300">Abyssinia Specialty Coffee Export PLC</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-right">
              <div>
                <div className="text-[11px] text-gray-400">Your Investment</div>
                <div className="text-base font-bold text-white">$15,000.00</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400">Expected Return</div>
                <div className="text-base font-bold text-[#FFD700]">+18.5%</div>
              </div>
              <div>
                <div className="text-[11px] text-gray-400">Term Period</div>
                <div className="text-base font-bold text-gray-300">12 Months</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-white">Recommended Opportunities</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Verified local projects looking for diaspora equity partners.
            </p>
          </div>
          <Link
            to="/investor/investments"
            className="text-xs font-semibold text-[#FFD700] hover:underline flex items-center gap-1"
          >
            Explore All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {opportunities.map((opp) => (
            <div
              key={opp._id}
              className="bg-[#141414] border border-gray-800 hover:border-[#FFD700]/50 rounded-xl p-5 flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#FFD700]/10 text-[#FFD700] font-semibold">
                    {opp.sector}
                  </span>
                  <span className="text-sm font-bold text-[#FFD700]">+{opp.expectedReturn}% ROI</span>
                </div>
                <h3 className="font-bold text-white text-base mb-1">{opp.title}</h3>
                <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                  {opp.description || "High-growth local enterprise expanding with verified off-take agreements."}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-gray-400">Min. Investment</div>
                  <div className="text-sm font-bold text-white">${(opp.minimumInvestment || 1000).toLocaleString()}</div>
                </div>
                <Link
                  to={`/investor/investments/${opp._id}`}
                  className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1 shadow transition-all"
                >
                  Invest Now <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
