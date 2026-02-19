import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchMyPortfolio } from "../slice/InvestmentSlice";
import InvestmentCard from "../components/InvestmentCard";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Search,
  // Filter,
  Clock,
  // CheckCircle,
  AlertCircle,
} from "lucide-react";

const MyportfolioPage = () => {
  const dispatch = useAppDispatch();
  const { myInvestments, portfolioLoading, portfolioError } = useAppSelector(
    (state) => state.investment,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMyPortfolio());
  }, [dispatch]);

  // Filter investments
  const filteredInvestments = myInvestments.filter((inv) => {
    // Status filter
    if (statusFilter !== "all" && inv.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inv.title?.toLowerCase().includes(term) ||
        inv.businessName?.toLowerCase().includes(term) ||
        inv.sector?.toLowerCase().includes(term)
      );
    }

    return true;
  });

  // Calculate portfolio stats
  const totalInvested = myInvestments.reduce(
    (sum, inv) => sum + (inv.currentFunding || 0),
    0,
  );

  const activeInvestments = myInvestments.filter(
    (inv) => inv.status === "published" || inv.status === "active",
  ).length;

  const pendingInvestments = myInvestments.filter(
    (inv) => inv.status === "pending",
  ).length;

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">My Portfolio</h1>
            <p className="text-gray-400">
              Track your investments across opportunities
            </p>
          </div>
        </div>

        {/* Error Display */}
        {portfolioError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{portfolioError}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-400">Total Invested</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ETB {totalInvested.toLocaleString()}
            </p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-400">Active Investments</span>
            </div>
            <p className="text-2xl font-bold text-white">{activeInvestments}</p>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-400">Pending</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {pendingInvestments}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search your investments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Status</option>
            <option value="published">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Investments Grid */}
      {filteredInvestments.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
            <Briefcase className="w-10 h-10 text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No investments found
          </h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "You haven't invested in any opportunities yet"}
          </p>
          <button
            onClick={() => (window.location.href = "/investments")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
          >
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((investment) => (
            <InvestmentCard
              key={investment._id}
              investment={investment}
              showActions={false} // Investors can't edit
              isPortfolio={true} // Show investment amount
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyportfolioPage;
