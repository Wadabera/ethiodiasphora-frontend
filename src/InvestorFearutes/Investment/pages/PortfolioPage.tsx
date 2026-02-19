import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchMyPortfolio,

} from "../slices/PublishedInvestmentSlice";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  Building2,
  Percent,
  ArrowUpRight,
  Calendar,
  Download,
  Search,
  ChevronRight,
  MapPin,
  Users,
} from "lucide-react";

const PortfolioPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { myPortfolio, portfolioSummary, loading } = useAppSelector(
    (state) => state.published,
  );
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPortfolio();
  }, [dispatch]);

  const loadPortfolio = async () => {
    try {
      await dispatch(fetchMyPortfolio()).unwrap();
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    }
  };

  // Safe arrays
  const safePortfolio = myPortfolio || [];
  const safeSummary = portfolioSummary || {
    totalInvested: 0,
    activeInvestments: 0,
    totalInvestments: 0,
    averageReturn: 0,
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Filter investments
  const filteredInvestments = safePortfolio.filter((inv) => {
    if (filter !== "all" && inv.investmentStatus !== filter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        inv.title?.toLowerCase().includes(term) ||
        inv.businessName?.toLowerCase().includes(term) ||
        inv.sector?.toLowerCase().includes(term) ||
        inv.location?.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      published: "bg-green-400/10 text-green-400 border border-green-400/30",
      active: "bg-green-400/10 text-green-400 border border-green-400/30",
      completed: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
      rejected: "bg-red-400/10 text-red-400 border border-red-400/30",
    };
    const statusText = {
      pending: "Pending Approval",
      published: "Active",
      active: "Active",
      completed: "Completed",
      rejected: "Rejected",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}
      >
        {statusText[status as keyof typeof statusText] || status}
      </span>
    );
  };

  if (loading) {
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
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg">
                <Briefcase className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Portfolio</h1>
                <p className="text-sm text-gray-400">
                  Track and manage your diaspora investments
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/investments")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Browse More
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Portfolio Summary Cards - Using API summary data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20">
                <DollarSign className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-gray-500">Total Invested</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {formatCurrency(safeSummary.totalInvested)}
            </div>
            <div className="text-xs text-gray-500">
              Across {safeSummary.totalInvestments} investments
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-gray-500">Average Return</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {safeSummary.averageReturn}%
            </div>
            <div className="text-xs text-gray-500">Expected ROI</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {safeSummary.activeInvestments}
            </div>
            <div className="text-xs text-gray-500">Currently active</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-400/10 rounded-lg group-hover:bg-purple-400/20">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-500">Companies</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {safePortfolio.length}
            </div>
            <div className="text-xs text-gray-500">Ethiopian businesses</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search by project, company, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-yellow-400"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="published">Active</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={() => {
                  // Export functionality
                  console.log("Export portfolio data");
                }}
                className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-yellow-400 transition-all"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Investments List */}
        {filteredInvestments.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No investments yet
            </h3>
            <p className="text-gray-400 mb-6">
              Start your diaspora investment journey today
            </p>
            <button
              onClick={() => navigate("/investments")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              Browse Opportunities
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => (
              <div
                key={investment.investmentId}
                onClick={() =>
                  navigate(`/investments/${investment.investmentId}`)
                }
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-lg hover:shadow-yellow-500/5 transition-all cursor-pointer group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Section - Investment Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                        {investment.title}
                      </h3>
                      {getStatusBadge(investment.investmentStatus)}
                      {investment.isFullyFunded && (
                        <span className="px-2 py-1 bg-green-400/10 text-green-400 rounded-full text-xs font-medium">
                          Fully Funded
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {investment.businessName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {investment.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(investment.investmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Percent className="w-4 h-4 text-green-400" />
                        {investment.expectedReturn}% ROI
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {investment.totalInvestors} investors
                      </span>
                    </div>

                    {/* Business Owner Info */}
                    <div className="text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-400">Owner:</span>{" "}
                      {investment.businessOwnerName} •{" "}
                      {investment.businessOwnerEmail}
                    </div>

                    {/* Progress Bar - Only for active investments */}
                    {(investment.investmentStatus === "published" ||
                      investment.investmentStatus === "active") && (
                      <div className="max-w-md">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-500">
                            Funding Progress
                          </span>
                          <span className="text-yellow-400 font-medium">
                            {investment.fundingProgress}%
                          </span>
                        </div>
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                            style={{
                              width: `${Math.min(
                                parseFloat(investment.fundingProgress) || 0,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500">
                            Raised: {formatCurrency(investment.currentFunding)}
                          </span>
                          <span className="text-gray-500">
                            Goal: {formatCurrency(investment.fundingGoal)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Section - Amount */}
                  <div className="text-right lg:text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      Your Investment
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">
                      {formatCurrency(investment.myInvestmentAmount)}
                    </div>
                    {investment.investmentStatus === "pending" && (
                      <span className="text-xs text-yellow-400">
                        Awaiting approval
                      </span>
                    )}
                    {investment.investmentStatus === "published" && (
                      <span className="text-xs text-green-400 flex items-center gap-1 justify-end">
                        <ArrowUpRight className="w-3 h-3" />+
                        {formatCurrency(
                          (investment.myInvestmentAmount *
                            investment.expectedReturn) /
                            100,
                        )}{" "}
                        est.
                      </span>
                    )}
                    {investment.investmentStatus === "completed" && (
                      <span className="text-xs text-blue-400 flex items-center gap-1 justify-end">
                        <CheckCircle className="w-3 h-3" />
                        Matured
                      </span>
                    )}
                  </div>

                  {/* Arrow Icon */}
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-yellow-400 transition-colors hidden lg:block" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
