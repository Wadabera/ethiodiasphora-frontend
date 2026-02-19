import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchInvestments,
  fetchSectors,
  fetchMyPortfolio,
type   Investment,
} from "../slices/PublishedInvestmentSlice";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Search,
  ChevronRight,
  Briefcase,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Users,
  // Clock,
} from "lucide-react";

const InvestmentsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { list, loading, pagination, investedIds, success } = useAppSelector(
    (state) => state.published,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [filterBy, setFilterBy] = useState<"all" | "available" | "invested">(
    "all",
  );

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Refresh when investment succeeds
  useEffect(() => {
    if (success) {
      loadData();
    }
  }, [success]);

  const loadData = async () => {
    try {
      await dispatch(fetchInvestments({ page: 1, limit: 20 })).unwrap();
      await dispatch(fetchSectors()).unwrap();
      await dispatch(fetchMyPortfolio()).unwrap();
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  // Get unique sectors
  const sectors = [...new Set(list.map((inv) => inv.sector).filter(Boolean))];

  // Filter and sort investments
  const filteredInvestments = list
    .filter((inv) => {
      // Sector filter
      if (selectedSector !== "all" && inv.sector !== selectedSector) {
        return false;
      }

      // Investment status filter
      if (filterBy === "available" && investedIds.has(inv._id)) {
        return false;
      }
      if (filterBy === "invested" && !investedIds.has(inv._id)) {
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
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  const handleButtonClick = (e: React.MouseEvent, investment: Investment) => {
    e.stopPropagation();

    if (investedIds.has(investment._id)) {
      // If already invested, go to portfolio
      navigate("/investor/portfolio");
    } else {
      // If not invested, go to investment details
      navigate(`/investor/investments/${investment._id}`);
    }
  };

  if (loading && list.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading investment opportunities...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-400/10 rounded-lg">
                <Briefcase className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Investment Opportunities
                </h1>
                <p className="text-sm text-gray-400">
                  Discover and invest in Ethiopian innovation
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/investor/portfolio")}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              My Portfolio
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by title, company, or sector..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 min-w-[140px]"
              >
                <option value="all">All Sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={filterBy}
                onChange={(e) =>
                  setFilterBy(
                    e.target.value as "all" | "available" | "invested",
                  )
                }
                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 min-w-[140px]"
              >
                <option value="all">All Projects</option>
                <option value="available">Available to Invest</option>
                <option value="invested">My Investments</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "newest" | "oldest")
                }
                className="bg-gray-800 border border-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-400 min-w-[140px]"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-400">
            Showing {filteredInvestments.length} of {pagination.total}{" "}
            opportunities
            {investedIds.size > 0 && (
              <span className="ml-2 text-green-400">
                • You've invested in {investedIds.size} projects
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Investment Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredInvestments.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No investments found
            </h3>
            <p className="text-gray-400 mb-6">
              {filterBy === "invested"
                ? "You haven't invested in any projects yet"
                : "Try adjusting your search or filters"}
            </p>
            {filterBy === "invested" && (
              <button
                onClick={() => setFilterBy("available")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                Browse Available Projects
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => {
              const progress =
                investment.fundingProgress ||
                (investment.currentFunding / investment.fundingGoal) * 100;
              const remaining =
                investment.fundingGoal - investment.currentFunding;
              const hasInvested = investedIds.has(investment._id);

              return (
                <div
                  key={investment._id}
                  onClick={() => {
                    if (!hasInvested) {
                      navigate(`/investor/investments/${investment._id}`);
                    }
                  }}
                  className={`group bg-gray-900 border rounded-2xl p-6 transition-all ${
                    hasInvested
                      ? "border-green-500/30 bg-green-500/5 cursor-default"
                      : "border-gray-800 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/5 cursor-pointer"
                  }`}
                >
                  {/* Header Badges */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-medium">
                      {investment.sector || "Business"}
                    </div>

                    {hasInvested && (
                      <div className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Invested
                      </div>
                    )}

                    {investment.isFullyFunded && !hasInvested && (
                      <div className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium">
                        Fully Funded
                      </div>
                    )}
                  </div>

                  {/* Title & Company */}
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                    {investment.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">{investment.businessName}</span>
                  </div>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-800/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">ROI</div>
                      <div className="text-green-400 font-bold">
                        {investment.expectedReturn}%
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-700">
                      <div className="text-xs text-gray-500 mb-1">Period</div>
                      <div className="text-white font-bold">
                        {investment.investmentPeriod}m
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">
                        Investors
                      </div>
                      <div className="text-white font-bold flex items-center justify-center gap-1">
                        <Users className="w-3 h-3" />
                        {investment.investments?.length || 0}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        Raised: {formatCurrency(investment.currentFunding || 0)}
                      </span>
                      <span className="text-gray-400">
                        Goal: {formatCurrency(investment.fundingGoal)}
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          hasInvested
                            ? "bg-gradient-to-r from-green-400 to-green-500"
                            : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span
                        className={`text-xs font-medium ${
                          hasInvested ? "text-green-400" : "text-yellow-400"
                        }`}
                      >
                        {progress.toFixed(1)}% funded
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(remaining)} left
                      </span>
                    </div>
                  </div>

                  {/* Investment Amount if invested */}
                  {hasInvested && investment.userInvestmentAmount && (
                    <div className="mb-3 p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">
                          Your investment
                        </span>
                        <span className="text-sm font-bold text-green-400">
                          {formatCurrency(investment.userInvestmentAmount)}
                        </span>
                      </div>
                      {investment.userInvestmentDate && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs text-gray-400">
                            Invested on
                          </span>
                          <span className="text-xs text-gray-300">
                            {new Date(
                              investment.userInvestmentDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-4">
                    {hasInvested ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/investor/portfolio");
                        }}
                        className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/25"
                      >
                        <CheckCircle className="w-4 h-4" />
                        View in Portfolio
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : investment.isFullyFunded ? (
                      <div className="w-full px-6 py-3 bg-gray-700 text-gray-300 font-semibold rounded-xl text-center">
                        Fully Funded
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/investor/investments/${investment._id}`);
                        }}
                        className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25"
                      >
                        Invest Now
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Minimum Investment */}
                  <div className="mt-3 text-center">
                    <span className="text-xs text-gray-500">
                      Min. {formatCurrency(investment.minimumInvestment)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;
