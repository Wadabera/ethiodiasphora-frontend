// BusinessOwnerFeatures/MyInvestment/pages/MyInvestmentPortfolioPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { fetchMyPortfolio } from "../slice/InvestmentSlice";
import { useNavigate } from "react-router-dom";
import type { Investment, InvestorDetail } from "../types/InvestmentTypes";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  // CheckCircle,
  Building2,
  Percent,
  Calendar,
  Download,
  Search,
  ChevronDown,
  ChevronUp,
  MapPin,
  Users,
  Mail,
  Phone,
  PlusCircle,
  XCircle,
  AlertCircle,
  // Filter,
  RefreshCw,
  Eye,
} from "lucide-react";

const MyInvestmentPortfolioPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get data from Redux store
  const {
    myCreatedInvestments,
    portfolioSummary,
    portfolioLoading,
    portfolioError,
  } = useAppSelector((state) => state.investment);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedInvestments, setExpandedInvestments] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setRefreshing(true);
    try {
      await dispatch(fetchMyPortfolio()).unwrap();
    } catch (error) {
      console.error("Failed to load portfolio:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const toggleInvestment = (investmentId: string) => {
    setExpandedInvestments((prev) =>
      prev.includes(investmentId)
        ? prev.filter((id) => id !== investmentId)
        : [...prev, investmentId],
    );
  };

  // Safe data with defaults
  const safeInvestments = myCreatedInvestments || [];
  const safeSummary = portfolioSummary || {
    totalOpportunities: 0,
    draftOpportunities: 0,
    approvedOpportunities: 0,
    fundedOpportunities: 0,
    totalFundingGoal: 0,
    totalRaised: 0,
    totalInvestors: 0,
    averageFundingProgress: "0",
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "ETB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter investments
  const filteredInvestments = useMemo(() => {
    return safeInvestments.filter((inv) => {
      // Status filter
      if (filter !== "all" && inv.status !== filter) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          inv.title?.toLowerCase().includes(term) ||
          inv.businessName?.toLowerCase().includes(term) ||
          inv.sector?.toLowerCase().includes(term) ||
          inv.investorsDetails?.some(
            (investor) =>
              investor.investorName?.toLowerCase().includes(term) ||
              investor.investorEmail?.toLowerCase().includes(term),
          )
        );
      }
      return true;
    });
  }, [safeInvestments, filter, searchTerm]);

  const getStatusBadge = (status: string = "pending") => {
    const styles: Record<string, string> = {
      draft: "bg-gray-500/10 text-gray-400 border border-gray-500/30",
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      published: "bg-green-400/10 text-green-400 border border-green-400/30",
      active: "bg-green-400/10 text-green-400 border border-green-400/30",
      funded: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
      completed: "bg-purple-400/10 text-purple-400 border border-purple-400/30",
      rejected: "bg-red-400/10 text-red-400 border border-red-400/30",
      cancelled: "bg-red-400/10 text-red-400 border border-red-400/30",
    };

    const statusText: Record<string, string> = {
      draft: "Draft",
      pending: "Pending Approval",
      published: "Published",
      active: "Active",
      funded: "Funded",
      completed: "Completed",
      rejected: "Rejected",
      cancelled: "Cancelled",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[status] || styles.pending
        }`}
      >
        {statusText[status] || status}
      </span>
    );
  };

  const getInvestorStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      approved: "bg-green-400/10 text-green-400 border border-green-400/30",
      rejected: "bg-red-400/10 text-red-400 border border-red-400/30",
    };
    return (
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          styles[status] || styles.pending
        }`}
      >
        {status}
      </span>
    );
  };

  if (portfolioLoading && !refreshing && safeInvestments.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your investment portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pb-16">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  My Investment Portfolio
                </h1>
                <p className="text-sm text-gray-400">
                  Track your projects and investors
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={loadPortfolio}
                disabled={refreshing}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button
                onClick={() => navigate("/business/investments/create")}
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Create New
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Error Display */}
        {portfolioError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-medium">
                Error Loading Portfolio
              </p>
              <p className="text-red-300 text-sm">{portfolioError}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-red-300 hover:text-white"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-400/10 rounded-lg group-hover:bg-purple-400/20">
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-xs text-gray-500">Total Opportunities</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {safeSummary.totalOpportunities}
            </div>
            <div className="text-xs text-gray-500">
              {safeSummary.draftOpportunities} draft ·{" "}
              {safeSummary.approvedOpportunities} active
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-green-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-400/10 rounded-lg group-hover:bg-green-400/20">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-xs text-gray-500">Total Raised</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              {formatCurrency(safeSummary.totalRaised)}
            </div>
            <div className="text-xs text-gray-500">
              of {formatCurrency(safeSummary.totalFundingGoal)} goal
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-400/10 rounded-lg group-hover:bg-blue-400/20">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xs text-gray-500">Total Investors</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">
              {safeSummary.totalInvestors}
            </div>
            <div className="text-xs text-gray-500">
              Across {safeSummary.totalOpportunities} projects
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400/20">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-xs text-gray-500">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {safeSummary.averageFundingProgress}%
            </div>
            <div className="text-xs text-gray-500">
              {safeSummary.fundedOpportunities} fully funded
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects or investors..."
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
                <option value="all">All Projects</option>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="published">Published</option>
                <option value="active">Active</option>
                <option value="funded">Funded</option>
                <option value="completed">Completed</option>
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
              No investments found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || filter !== "all"
                ? "Try adjusting your search or filters"
                : "You haven't created any investments yet"}
            </p>
            <button
              onClick={() => navigate("/business/investments/create")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              Create Your First Investment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => {
              const isExpanded = expandedInvestments.includes(investment._id);
              const totalInvestors =
                investment.totalInvestors ||
                investment.investorsDetails?.length ||
                0;
              const totalRaised =
                investment.currentFunding ||
                investment.investorsDetails?.reduce(
                  (sum, inv) => sum + inv.amount,
                  0,
                ) ||
                0;
              const progress =
                investment.fundingProgress ||
                ((totalRaised / investment.fundingGoal) * 100).toFixed(1);

              return (
                <div
                  key={investment._id}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all"
                >
                  {/* Investment Header */}
                  <div
                    onClick={() => toggleInvestment(investment._id)}
                    className="p-6 cursor-pointer hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Left Section */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white hover:text-yellow-400 transition-colors">
                            {investment.title}
                          </h3>
                          {getStatusBadge(investment.status)}
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            {investment.businessName || "Your Business"}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {investment.location || "Ethiopia"}
                          </span>
                          {investment.expectedReturn && (
                            <span className="flex items-center gap-1">
                              <Percent className="w-4 h-4 text-green-400" />
                              {investment.expectedReturn}% ROI
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stats Summary */}
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Raised</p>
                          <p className="text-lg font-bold text-green-400">
                            {formatCurrency(totalRaised)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Investors</p>
                          <p className="text-lg font-bold text-white">
                            {totalInvestors}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Progress</p>
                          <p className="text-lg font-bold text-yellow-400">
                            {progress}%
                          </p>
                        </div>
                        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{
                            width: `${Math.min(parseFloat(String(progress)), 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Investors Details - VIEW ONLY */}
                  {isExpanded && (
                    <div className="border-t border-gray-800 bg-gray-900/50 p-6">
                      <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-400" />
                        Investors ({totalInvestors})
                      </h4>

                      {investment.investorsDetails &&
                      investment.investorsDetails.length > 0 ? (
                        <div className="space-y-3">
                          {investment.investorsDetails.map((investor, idx) => (
                            <div
                              key={idx}
                              className="bg-gray-800/30 border border-gray-700 rounded-xl p-4 hover:border-purple-500/50 transition-all"
                            >
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                {/* Investor Info */}
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                      {investor.investorName?.charAt(0) || "I"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-white">
                                        {investor.investorName}
                                      </p>
                                      <div className="flex items-center gap-3 text-xs">
                                        <span className="flex items-center gap-1 text-gray-400">
                                          <Mail className="w-3 h-3" />
                                          {investor.investorEmail}
                                        </span>
                                        {investor.investorPhone && (
                                          <span className="flex items-center gap-1 text-gray-400">
                                            <Phone className="w-3 h-3" />
                                            {investor.investorPhone}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Invested:{" "}
                                    {formatDate(investor.investmentDate)}
                                  </p>
                                </div>

                                {/* Investment Amount and Status */}
                                <div className="flex flex-col items-end gap-2">
                                  <p className="text-lg font-bold text-green-400">
                                    {formatCurrency(investor.amount)}
                                  </p>
                                  {getInvestorStatusBadge(investor.status)}
                                </div>

                                {/* Contact Actions Only - NO Approve/Reject */}
                                <div className="flex gap-2">
                                  <a
                                    href={`mailto:${investor.investorEmail}`}
                                    className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Send Email"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Mail className="w-4 h-4 text-gray-300" />
                                  </a>
                                  {investor.investorPhone && (
                                    <a
                                      href={`tel:${investor.investorPhone}`}
                                      className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                      title="Call"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Phone className="w-4 h-4 text-gray-300" />
                                    </a>
                                  )}
                                  <button
                                    className="p-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors"
                                    title="View Details"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Eye className="w-4 h-4 text-gray-300" />
                                  </button>
                                </div>
                              </div>

                              {/* Status Info Message for Pending Investors */}
                              {investor.status === "pending" && (
                                <div className="mt-3 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                  <p className="text-xs text-yellow-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    This investment is pending admin approval.
                                    The investor will be notified once approved.
                                  </p>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-center py-4">
                          No investors yet for this project
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInvestmentPortfolioPage;
