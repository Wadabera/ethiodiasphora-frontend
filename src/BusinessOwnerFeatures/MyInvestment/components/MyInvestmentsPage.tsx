import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchMyPortfolio } from "../slice/InvestmentSlice";
import InvestmentCard from "./InvestmentCard";
import {
  Briefcase,
  TrendingUp,
  PlusCircle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Users,
} from "lucide-react";

const MyInvestmentsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    myCreatedInvestments,
    portfolioLoading,
    portfolioError,
    portfolioSummary,
  } = useAppSelector((state) => state.investment);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchMyPortfolio());
  }, [dispatch]);

  // Get unique sectors for filter
  const sectors = [
    "all",
    ...new Set(myCreatedInvestments.map((inv) => inv.sector).filter(Boolean)),
  ];

  // Filter investments
  const filteredInvestments = myCreatedInvestments.filter((inv) => {
    // Status filter
    if (statusFilter !== "all" && inv.status !== statusFilter) {
      return false;
    }

    // Sector filter
    if (sectorFilter !== "all" && inv.sector !== sectorFilter) {
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

  if (portfolioLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your investments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">My Investments</h1>
              <p className="text-gray-400">
                Manage your created investment opportunities
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/business/investments/create")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Create New Investment
          </button>
        </div>

        {/* Error Display */}
        {portfolioError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{portfolioError}</p>
          </div>
        )}

        {/* Summary Stats */}
        {portfolioSummary && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Opportunities</p>
              <p className="text-2xl font-bold text-white">
                {portfolioSummary.totalOpportunities}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Raised</p>
              <p className="text-2xl font-bold text-green-400">
                ETB {portfolioSummary.totalRaised.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-1">Total Investors</p>
              <p className="text-2xl font-bold text-white">
                {portfolioSummary.totalInvestors}
              </p>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4">
              <p className="text-sm text-gray-400 mb-1">Avg Progress</p>
              <p className="text-2xl font-bold text-yellow-400">
                {portfolioSummary.averageFundingProgress}%
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
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

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>

            {sectors.length > 1 && (
              <select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="bg-gray-800/50 border border-gray-700 text-white rounded-xl px-4 py-2 focus:outline-none focus:border-yellow-500"
              >
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector === "all" ? "All Sectors" : sector}
                  </option>
                ))}
              </select>
            )}
          </div>
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
            {searchTerm || statusFilter !== "all" || sectorFilter !== "all"
              ? "Try adjusting your filters"
              : "You haven't created any investments yet"}
          </p>
          <button
            onClick={() => navigate("/business/investments/create")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
          >
            Create Your First Investment
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestments.map((investment) => (
            <InvestmentCard
              key={investment._id}
              investment={investment}
              showActions={true} // Business owners can edit
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInvestmentsPage;
