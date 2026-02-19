// features/investments/pages/MyInvestmentsPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchMyPortfolio,
  clearError,
  resetSuccess,
} from "@/BusinessOwnerFeatures/MyInvestment/slice/InvestmentSlice";
import InvestmentCard from "@/BusinessOwnerFeatures/MyInvestment/components/InvestmentCard";
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  PlusCircle,
  XCircle,
  Check,
  BarChart3,
  Target,
} from "lucide-react";

const Portifolio: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    portfolio,
    investment,
    // createLoading,
    createError,
    createSuccess,
    portfolioLoading,
    portfolioError,
    myInvestments,
    myCreatedInvestments,
  } = useAppSelector((state) => state.investment);

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeView, setActiveView] = useState<"all" | "invested" | "created">(
    "all",
  );

  useEffect(() => {
    dispatch(fetchMyPortfolio());
  }, [dispatch]);

  useEffect(() => {
    if (createSuccess && investment) {
      setShowSuccess(true);
      setActiveView("created");
      setTimeout(() => {
        dispatch(resetSuccess());
        setShowSuccess(false);
      }, 5000);
    }
  }, [createSuccess, investment, dispatch]);

  useEffect(() => {
    const state = location.state as { investmentCreated?: boolean };
    if (state?.investmentCreated) {
      setShowSuccess(true);
      setActiveView("created");
      window.history.replaceState({}, document.title);
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [location]);

  useEffect(() => {
    if (createError || portfolioError) {
      const timer = setTimeout(() => dispatch(clearError()), 5000);
      return () => clearTimeout(timer);
    }
  }, [createError, portfolioError, dispatch]);

  const getDisplayedInvestments = () => {
    switch (activeView) {
      case "invested":
        return myInvestments;
      case "created":
        return myCreatedInvestments;
      default:
        return portfolio;
    }
  };

  const getStats = () => {
    const displayedInvestments = getDisplayedInvestments();
    const total = displayedInvestments.length;
    const active = displayedInvestments.filter(
      (inv) => inv.status === "published" || inv.status === "active",
    ).length;
    const pending = displayedInvestments.filter(
      (inv) => inv.status === "pending" || inv.status === "draft",
    ).length;
    const completed = displayedInvestments.filter(
      (inv) => inv.status === "completed",
    ).length;

    const totalInvested =
      activeView === "invested"
        ? myInvestments.reduce((sum, inv) => {
            const userId = localStorage.getItem("userId");
            if (!userId) return sum;

            const myTransactions =
              inv.investments?.filter((transaction: any) => {
                const investorId =
                  typeof transaction.investorId === "string"
                    ? transaction.investorId
                    : transaction.investorId?._id;
                return investorId === userId;
              }) || [];

            return (
              sum +
              myTransactions.reduce(
                (acc: number, trans: any) => acc + trans.amount,
                0,
              )
            );
          }, 0)
        : 0;

    let totalFunding = 0;
    let totalRaised = 0;

    if (activeView === "created") {
      totalFunding = myCreatedInvestments.reduce(
        (sum, inv) => sum + (inv.fundingGoal || 0),
        0,
      );

      totalRaised = myCreatedInvestments.reduce(
        (sum, inv) => sum + (inv.currentFunding || 0),
        0,
      );
    }

    return {
      total,
      active,
      pending,
      completed,
      totalInvested,
      totalFunding,
      totalRaised,
    };
  };

  const getFilteredInvestments = () => {
    const displayedInvestments = getDisplayedInvestments();

    return displayedInvestments.filter((inv) => {
      if (activeFilter !== "all") {
        if (activeFilter === "pending") {
          if (inv.status !== "pending" && inv.status !== "draft") return false;
        } else if (inv.status !== activeFilter) {
          return false;
        }
      }

      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          inv.title?.toLowerCase().includes(term) ||
          inv.businessName?.toLowerCase().includes(term) ||
          inv.description?.toLowerCase().includes(term) ||
          inv.sector?.toLowerCase().includes(term)
        );
      }

      return true;
    });
  };

  const stats = getStats();
  const filteredInvestments = getFilteredInvestments();

  const filters = [
    { id: "all", label: "All", icon: Briefcase },
    { id: "published", label: "Active", icon: TrendingUp },
    { id: "pending", label: "Pending", icon: Clock },
    { id: "completed", label: "Completed", icon: CheckCircle },
  ];

  const viewOptions = [
    { id: "all", label: "All Investments", icon: Briefcase },
    { id: "invested", label: "My Investments", icon: DollarSign },
    { id: "created", label: "Created By Me", icon: BarChart3 },
  ];

  const isLoading = portfolioLoading;
  const hasError = portfolioError || createError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 md:p-6">
      {showSuccess && (
        <div className="fixed top-4 right-4 left-4 md:left-auto md:w-96 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-900/90 to-green-800/90 backdrop-blur-sm border border-green-700 rounded-2xl p-4 flex items-start gap-3 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white mb-1">Success!</p>
              <p className="text-green-300 text-sm">
                {investment?.title
                  ? `"${investment.title}" created successfully!`
                  : "Investment created successfully!"}
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="hover:opacity-80 transition-opacity"
            >
              <XCircle className="w-5 h-5 text-green-300 hover:text-white" />
            </button>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="fixed bottom-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-black" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  My Investments
                </h1>
                <p className="text-gray-400">
                  Manage your investment portfolio
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/business/investments/create")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 shadow-lg hover:shadow-yellow-500/25"
            >
              <PlusCircle className="w-5 h-5" />
              Create Investment
            </button>
          </div>

          {hasError && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-300 text-sm">
                  {portfolioError || createError}
                </p>
              </div>
              <button
                onClick={() => dispatch(clearError())}
                className="ml-auto text-red-300 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {viewOptions.map((view) => (
              <button
                key={view.id}
                onClick={() =>
                  setActiveView(view.id as "all" | "invested" | "created")
                }
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
                  activeView === view.id
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                    : "bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800"
                }`}
              >
                <view.icon className="w-4 h-4 flex-shrink-0" />
                {view.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-yellow-500/30 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="w-5 h-5 text-yellow-500 group-hover:text-yellow-400" />
                <span className="text-sm text-gray-400">Total</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-green-500/30 transition-colors group">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-green-500 group-hover:text-green-400" />
                <span className="text-sm text-gray-400">Active</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
            </div>

            {activeView === "invested" ? (
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-blue-500/30 transition-colors group md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
                  <span className="text-sm text-gray-400">Total Invested</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  ETB {stats.totalInvested.toLocaleString()}
                </p>
              </div>
            ) : activeView === "created" ? (
              <>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-purple-500/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-purple-500 group-hover:text-purple-400" />
                    <span className="text-sm text-gray-400">Goal</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ETB {stats.totalFunding.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-500 group-hover:text-green-400" />
                    <span className="text-sm text-gray-400">Raised</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    ETB {stats.totalRaised.toLocaleString()}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-blue-500/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-500 group-hover:text-blue-400" />
                    <span className="text-sm text-gray-400">Pending</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.pending}
                  </p>
                </div>
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 hover:border-green-500/30 transition-colors group">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 group-hover:text-green-400" />
                    <span className="text-sm text-gray-400">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {stats.completed}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder={`Search ${activeView === "all" ? "all" : activeView} investments...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 text-white placeholder-gray-500 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {filters.map((filterItem) => (
                <button
                  key={filterItem.id}
                  onClick={() => setActiveFilter(filterItem.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                    activeFilter === filterItem.id
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black shadow-lg"
                      : "bg-gray-900/50 border border-gray-800 text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <filterItem.icon className="w-4 h-4 flex-shrink-0" />
                  {filterItem.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredInvestments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInvestments.map((inv) => (
              <InvestmentCard
                key={inv._id}
                investment={inv}
                showActions={true}
                isNew={createSuccess && investment?._id === inv._id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No investments found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || activeFilter !== "all"
                ? "Try adjusting your search or filter"
                : activeView === "invested"
                  ? "You haven't invested in any opportunities yet"
                  : activeView === "created"
                    ? "You haven't created any investments yet"
                    : "No investments in your portfolio"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {activeView !== "invested" && (
                <button
                  onClick={() => navigate("/investments")}
                  className="px-6 py-3 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all flex items-center gap-2 justify-center"
                >
                  <TrendingUp className="w-5 h-5" />
                  Browse Investments
                </button>
              )}
              <button
                onClick={() => navigate("/business/investments/create")}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 justify-center"
              >
                <PlusCircle className="w-5 h-5" />
                Create Investment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portifolio;


