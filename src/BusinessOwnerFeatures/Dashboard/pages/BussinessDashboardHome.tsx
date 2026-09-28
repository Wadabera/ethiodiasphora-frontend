import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  PlusCircle,
  Sparkles,
  PieChart,
  BarChart3,
  FileText,
  AlertCircle,
} from "lucide-react";
import api from "@/services/api";

export default function BusinessDashboardHome() {
  const [loading, setLoading] = useState(false);
  const [investments, setInvestments] = useState<any[]>([
    {
      _id: "6aba1e9ec1d9889b5b5b59c5",
      title: "Specialty Yirgacheffe Coffee Processing Plant Expansion",
      sector: "Agriculture",
      fundingGoal: 150000,
      currentFunding: 15000,
      expectedReturn: 18.5,
      status: "published",
      investorsCount: 1,
    },
    {
      _id: "6aba1edac1d9889b5b5b59dd",
      title: "Sheba Logistics & Cold Chain Infrastructure",
      sector: "Logistics",
      fundingGoal: 250000,
      currentFunding: 0,
      expectedReturn: 21.0,
      status: "published",
      investorsCount: 0,
    },
  ]);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/investments");
      if (res.data && res.data.investments) {
        setInvestments(res.data.investments);
      }
    } catch (e) {
      console.log("Using cached investments for business dashboard");
    } finally {
      setLoading(false);
    }
  };

  const totalGoal = investments.reduce((sum, i) => sum + (i.fundingGoal || 0), 0);
  const totalRaised = investments.reduce((sum, i) => sum + (i.currentFunding || 0), 0);
  const totalInvestors = investments.reduce((sum, i) => sum + (i.investorsCount || i.interestedInvestors || 0), 1);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/15 text-green-400 text-xs font-semibold border border-green-500/30">
                <CheckCircle2 size={13} /> KYC Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-xs font-semibold border border-[#FFD700]/30">
                <Building2 size={13} /> Company Licensed
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome, Dawit Haile
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-xl">
              <strong className="text-white">Abyssinia Specialty Coffee Export PLC</strong> • Managing diaspora investment campaigns, agricultural export operations, and capital expansion.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/business/investments/create"
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg transition-all"
            >
              <PlusCircle size={16} /> New Investment Offering
            </Link>
            <Link
              to="/business/company/profile"
              className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-gray-700 text-gray-200 rounded-xl text-xs font-semibold transition-all"
            >
              Company Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Total Capital Raised</span>
            <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${totalRaised.toLocaleString()}
          </div>
          <div className="text-xs text-green-400">
            {((totalRaised / (totalGoal || 1)) * 100).toFixed(1)}% of ${totalGoal.toLocaleString()} target
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Active Offerings</span>
            <div className="p-2.5 rounded-xl bg-[#FFD700]/10 text-[#FFD700]">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {investments.length} Active
          </div>
          <div className="text-xs text-yellow-400">Published to Global Diaspora</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Diaspora Investors</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Users size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{totalInvestors} Investor</div>
          <div className="text-xs text-purple-400">Sara Tadesse ($15,000)</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-5 hover:border-[#FFD700]/50 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-gray-400 font-medium">Average Expected Return</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
              <PieChart size={18} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">19.75%</div>
          <div className="text-xs text-blue-400">Annual projected dividend</div>
        </div>
      </div>

      {/* Active Campaigns List */}
      <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-white">Your Capital Raising Campaigns</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Live offerings accessible to verified diaspora investors.
            </p>
          </div>
          <Link
            to="/business/manageInvestment"
            className="text-xs font-semibold text-[#FFD700] hover:underline flex items-center gap-1"
          >
            Manage All <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="space-y-4">
          {investments.map((inv) => {
            const pct = Math.min(100, Math.round(((inv.currentFunding || 0) / (inv.fundingGoal || 1)) * 100));
            return (
              <div
                key={inv._id}
                className="bg-[#141414] border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-[#FFD700]/10 text-[#FFD700] font-semibold">
                        {inv.sector || "Agriculture"}
                      </span>
                      <span className="text-[11px] text-green-400 font-medium flex items-center gap-1">
                        <CheckCircle2 size={11} /> Approved & Published
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-base">{inv.title}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Expected Annual Return</div>
                    <div className="text-lg font-bold text-[#FFD700]">+{inv.expectedReturn}%</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-300">
                    <span>
                      Raised: <strong className="text-white">${(inv.currentFunding || 0).toLocaleString()}</strong>
                    </span>
                    <span>
                      Goal: <strong className="text-white">${(inv.fundingGoal || 0).toLocaleString()}</strong> ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-[#FFD700] rounded-full transition-all duration-700"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/business/investments/create"
          className="p-5 bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl transition-all group flex items-start gap-3"
        >
          <div className="p-3 rounded-xl bg-yellow-500/10 text-[#FFD700] group-hover:scale-110 transition-transform">
            <PlusCircle size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Create Investment</h4>
            <p className="text-[11px] text-gray-400 mt-1">Submit new project for diaspora equity funding</p>
          </div>
        </Link>

        <Link
          to="/business/company/profile"
          className="p-5 bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl transition-all group flex items-start gap-3"
        >
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
            <Building2 size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Company Profile</h4>
            <p className="text-[11px] text-gray-400 mt-1">Manage documents, trade license, and directors</p>
          </div>
        </Link>

        <Link
          to="/business/remittance"
          className="p-5 bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl transition-all group flex items-start gap-3"
        >
          <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:scale-110 transition-transform">
            <DollarSign size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Remittance & FX</h4>
            <p className="text-[11px] text-gray-400 mt-1">Receive foreign currency transfers directly</p>
          </div>
        </Link>

        <Link
          to="/business/my-ipos"
          className="p-5 bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl transition-all group flex items-start gap-3"
        >
          <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Public IPOs</h4>
            <p className="text-[11px] text-gray-400 mt-1">Issue shares on the Ethiopian Stock Exchange</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
