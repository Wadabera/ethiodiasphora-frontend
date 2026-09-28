import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  DollarSign,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import api from "@/services/api";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalUsers: 14,
    totalCompanies: 3,
    activeInvestments: 2,
    totalFunding: 400000,
    totalRaised: 15000,
    pendingKyc: 0,
    approvedKyc: 4,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const [invRes, compRes] = await Promise.allSettled([
        api.get("/api/v1/investments"),
        api.get("/api/v1/companies/admin/all"),
      ]);

      if (invRes.status === "fulfilled" && invRes.value.data) {
        const invs = invRes.value.data.investments || [];
        const sumRaised = invRes.value.data.summary?.totalRaised || 15000;
        const sumGoal = invRes.value.data.summary?.totalFundingGoal || 400000;
        setStats((prev) => ({
          ...prev,
          activeInvestments: invs.length,
          totalFunding: sumGoal,
          totalRaised: sumRaised,
        }));
      }

      if (compRes.status === "fulfilled" && compRes.value.data) {
        const comps = compRes.value.data.companies || compRes.value.data || [];
        setStats((prev) => ({
          ...prev,
          totalCompanies: comps.length || 3,
        }));
      }
    } catch (e) {
      console.error("Error loading admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD700]/20 text-[#FFD700] text-xs font-semibold mb-3">
              <ShieldCheck size={14} /> System Administrator Portal
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              EthioDiaspora Governance & Approvals
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Monitor diaspora investment flow, review KYC identity submissions, audit registered Ethiopian businesses, and approve capital offerings.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchAdminStats}
              disabled={loading}
              className="px-4 py-2.5 bg-[#1A1A1A] hover:bg-[#252525] border border-gray-700 text-gray-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Data
            </button>
            <Link
              to="/admin/investmetmentApprove"
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all"
            >
              Review Queue <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Total Capital Raised</span>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            ${stats.totalRaised.toLocaleString()}
          </div>
          <div className="text-xs text-green-400 flex items-center gap-1">
            <span>Target: ${stats.totalFunding.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Active Opportunities</span>
            <div className="w-10 h-10 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.activeInvestments} Live</div>
          <div className="text-xs text-yellow-400">Coffee Processing & Logistics</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">Registered Companies</span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Building2 size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.totalCompanies} Companies</div>
          <div className="text-xs text-blue-400">Abyssinia Coffee & Logistics</div>
        </div>

        <div className="bg-[#0F0F0F] border border-gray-800 hover:border-[#FFD700]/50 rounded-2xl p-5 transition-all group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-400">KYC Status</span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <ShieldCheck size={20} />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.approvedKyc} Verified</div>
          <div className="text-xs text-green-400">0 Pending Verification</div>
        </div>
      </div>

      {/* Quick Approval Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module 1: KYC Approvals */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-[#FFD700]">
                  <ShieldCheck size={18} />
                </div>
                <h3 className="font-bold text-white text-base">KYC Compliance</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 font-medium">
                Compliant
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Identity verification for diaspora investors and local enterprise founders. Review submitted passport/kebele IDs and tax records.
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="p-3 bg-[#1A1A1A] rounded-xl flex items-center justify-between text-xs">
                <span className="text-white font-medium">Dawit Haile (Business)</span>
                <span className="text-green-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} /> Approved
                </span>
              </div>
              <div className="p-3 bg-[#1A1A1A] rounded-xl flex items-center justify-between text-xs">
                <span className="text-white font-medium">Sara Tadesse (Investor)</span>
                <span className="text-green-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} /> Approved
                </span>
              </div>
            </div>
          </div>
          <Link
            to="/admin/kycApproved"
            className="w-full py-2.5 text-center text-xs font-bold text-[#FFD700] hover:text-black bg-[#FFD700]/10 hover:bg-[#FFD700] border border-[#FFD700]/30 rounded-xl transition-all"
          >
            Manage KYC Records →
          </Link>
        </div>

        {/* Module 2: Company Approvals */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <Building2 size={18} />
                </div>
                <h3 className="font-bold text-white text-base">Corporate Registry</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                Verified
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Review corporate documents, commercial registration numbers, and Ministry of Trade TIN records for companies seeking capital.
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="p-3 bg-[#1A1A1A] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-medium">Abyssinia Specialty Coffee Export</div>
                  <div className="text-[10px] text-gray-500">TIN: 0098765432</div>
                </div>
                <span className="text-green-400 font-semibold">Licensed</span>
              </div>
            </div>
          </div>
          <Link
            to="/admin/companyApprove"
            className="w-full py-2.5 text-center text-xs font-bold text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 border border-blue-500/30 rounded-xl transition-all"
          >
            View Company Approvals →
          </Link>
        </div>

        {/* Module 3: Investment Offering Approvals */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-yellow-500/10 text-[#FFD700]">
                  <TrendingUp size={18} />
                </div>
                <h3 className="font-bold text-white text-base">Investment Vetting</h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-500/10 text-[#FFD700] border border-[#FFD700]/20 font-medium">
                2 Published
              </span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed mb-4">
              Audit business plans, financial projections, projected dividend returns, and verify risks before publishing to diaspora investors.
            </p>
            <div className="space-y-2.5 mb-6">
              <div className="p-3 bg-[#1A1A1A] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-medium">Yirgacheffe Coffee Expansion</div>
                  <div className="text-[10px] text-yellow-400">18.5% Return • $15,000 Raised</div>
                </div>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              <div className="p-3 bg-[#1A1A1A] rounded-xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-white font-medium">Sheba Logistics Cold Chain</div>
                  <div className="text-[10px] text-yellow-400">21.0% Return • $250k Goal</div>
                </div>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
            </div>
          </div>
          <Link
            to="/admin/investmetmentApprove"
            className="w-full py-2.5 text-center text-xs font-bold text-[#FFD700] hover:text-black bg-[#FFD700]/10 hover:bg-[#FFD700] border border-[#FFD700]/30 rounded-xl transition-all"
          >
            Review All Investments →
          </Link>
        </div>
      </div>
    </div>
  );
}
