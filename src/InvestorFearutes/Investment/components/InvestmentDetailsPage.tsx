import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchInvestmentById,
  investInOpportunity,
  fetchMyPortfolio,
  clearError,
  resetInvest,
  resetSuccess,
} from "../slices/PublishedInvestmentSlice";
import type { Investment } from "@/BusinessOwnerFeatures/MyInvestment/types/InvestmentTypes";
import {
  ArrowLeft,
  // TrendingUp,
  DollarSign,
  Clock,
  Users,
  Building2,
  // Percent,
  AlertCircle,
  CheckCircle,
  Loader2,
  Banknote,
  CreditCard,
  Globe2,
  Shield,
  MapPin,
  // Calendar,
  // Target,
  // FileText,
  Info,
} from "lucide-react";

const InvestmentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selected, loading, investing, success, error } = useAppSelector(
    (state) => state.published,
  );

  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [notes, setNotes] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "business" | "financial"
  >("overview");
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvestmentById(id));
      dispatch(fetchMyPortfolio());
    }
    return () => {
      dispatch(clearError());
      dispatch(resetInvest());
      dispatch(resetSuccess());
    };
  }, [dispatch, id]);

  // Fix: Initialize form only once when selected changes
  useEffect(() => {
    if (selected && !hasInitialized) {
      setAmount(selected.minimumInvestment || 100);
      setNotes(`Excited to invest in ${selected.businessName}!`);
      setHasInitialized(true);
    }
  }, [selected, hasInitialized]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
      dispatch(fetchMyPortfolio());

      const timer = setTimeout(() => {
        setShowSuccessModal(false);
        dispatch(resetSuccess());
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleInvest = async () => {
    if (!id || !amount || amount < (selected?.minimumInvestment || 0)) {
      return;
    }

    try {
      await dispatch(
        investInOpportunity({
          id,
          amount,
          paymentMethod,
          notes,
        }),
      ).unwrap();
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysLeft = (createdAt?: string, period?: number) => {
    if (!createdAt || !period) return "N/A";
    const startDate = new Date(createdAt);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + period);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} days left` : "Ended";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading investment details...</p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Investment Not Found
          </h2>
          <p className="text-gray-400 mb-6">
            The investment opportunity you're looking for doesn't exist or has
            been removed.
          </p>
          <button
            onClick={() => navigate("/investor/investments")}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all"
          >
            Browse Investments
          </button>
        </div>
      </div>
    );
  }

  const progress = (selected.currentFunding / selected.fundingGoal) * 100;
  const remaining = selected.fundingGoal - selected.currentFunding;
  const expectedReturn = (amount * selected.expectedReturn) / 100;
  const daysLeft = calculateDaysLeft(
    selected.createdAt,
    selected.investmentPeriod,
  );
  const totalInvestors =
    (selected as any).totalInvestors || selected.investments?.length || 0;
  const location = (selected as any).location || "Ethiopia";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black pb-16">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-scale-in">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-center text-white mb-2">
              Investment Successful! 🎉
            </h3>
            <p className="text-gray-300 text-center mb-2">
              You invested{" "}
              <span className="font-bold text-yellow-400">
                {formatCurrency(amount)}
              </span>{" "}
              in
            </p>
            <p className="text-white font-semibold text-center mb-4">
              {selected.businessName}
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Expected Return</span>
                <span className="text-green-400 font-bold">
                  {formatCurrency(expectedReturn)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400 font-medium">
                  Pending Approval
                </span>
              </div>
              {notes && (
                <div className="mt-2 pt-2 border-t border-green-500/30">
                  <span className="text-xs text-gray-400">Your note:</span>
                  <p className="text-sm text-white mt-1">{notes}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/investor/portfolio");
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                View Portfolio
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate("/investor/investments");
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
              >
                Browse More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Investments
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-purple-500/20"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/30">
              {selected.sector}
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium border border-purple-500/30">
              {selected.riskFactors || "Medium Risk"}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {selected.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-300">
            <span className="flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {selected.businessName}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Funding Goal</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(selected.fundingGoal)}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Raised So Far</p>
            <p className="text-2xl font-bold text-green-400">
              {formatCurrency(selected.currentFunding)}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Min Investment</p>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(selected.minimumInvestment)}
            </p>
          </div>
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-4">
            <p className="text-sm text-gray-400 mb-1">Expected Return</p>
            <p className="text-2xl font-bold text-yellow-400">
              {selected.expectedReturn}%
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Bar Card */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Funding Progress
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="font-medium text-yellow-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-400">
                    Raised: {formatCurrency(selected.currentFunding)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Remaining: {formatCurrency(remaining)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Remaining</p>
                  <p className="text-white font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    {daysLeft}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Total Investors</p>
                  <p className="text-white font-semibold flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-400" />
                    {totalInvestors}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex border-b border-gray-800">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "overview"
                      ? "bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("business")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "business"
                      ? "bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  Business Plan
                </button>
                <button
                  onClick={() => setActiveTab("financial")}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === "financial"
                      ? "bg-yellow-500/10 text-yellow-400 border-b-2 border-yellow-400"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  Financials
                </button>
              </div>

              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {selected.description || "No description provided."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Industry</p>
                        <p className="text-white font-medium">
                          {selected.sector}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Location</p>
                        <p className="text-white font-medium">{location}</p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">Risk Level</p>
                        <p className="text-white font-medium capitalize">
                          {selected.riskFactors || "Medium"}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1">
                          Investment Period
                        </p>
                        <p className="text-white font-medium">
                          {selected.investmentPeriod} months
                        </p>
                      </div>
                    </div>

                    {selected.riskFactors && (
                      <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                        <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          Risk Factors
                        </h4>
                        <p className="text-gray-300 text-sm">
                          {selected.riskFactors}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "business" && (
                  <div className="space-y-4">
                    <h4 className="text-white font-semibold mb-2">
                      Business Plan
                    </h4>
                    <p className="text-gray-300 leading-relaxed">
                      {selected.businessPlan ||
                        "Business plan will be provided upon request."}
                    </p>

                    {selected.useOfFunds && (
                      <div className="mt-4">
                        <h4 className="text-white font-semibold mb-2">
                          Use of Funds
                        </h4>
                        <p className="text-gray-300">{selected.useOfFunds}</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "financial" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">
                          Funding Goal
                        </p>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(selected.fundingGoal)}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">
                          Current Funding
                        </p>
                        <p className="text-xl font-bold text-green-400">
                          {formatCurrency(selected.currentFunding)}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">
                          Minimum Investment
                        </p>
                        <p className="text-xl font-bold text-white">
                          {formatCurrency(selected.minimumInvestment)}
                        </p>
                      </div>
                      <div className="bg-gray-800/30 rounded-lg p-4">
                        <p className="text-sm text-gray-400 mb-1">
                          Expected Return
                        </p>
                        <p className="text-xl font-bold text-yellow-400">
                          {selected.expectedReturn}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Owner Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-400" />
                Business Owner
              </h3>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-black font-bold text-xl">
                  {selected.businessName?.charAt(0) || "B"}
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {selected.businessName}
                  </p>
                  <p className="text-sm text-gray-400">
                    {typeof selected.businessOwnerId === "object"
                      ? selected.businessOwnerId?.email
                      : "Verified Business"}
                  </p>
                  {selected.isVerified && (
                    <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified Business
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Investment Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl p-6 shadow-2xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  Make an Investment
                </h3>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Investment Amount (ETB)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">
                      ETB
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={selected.minimumInvestment}
                      max={remaining}
                      step={1000}
                      className="w-full bg-gray-800 border-2 border-gray-700 text-white text-xl font-bold pl-14 pr-4 py-4 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">
                      Min: {formatCurrency(selected.minimumInvestment)}
                    </span>
                    <span className="text-gray-500">
                      Max: {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>

                {/* Quick Amount Selector */}
                <div className="mb-6">
                  <p className="text-xs text-gray-500 mb-2">Quick select:</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      selected.minimumInvestment,
                      selected.minimumInvestment * 2,
                      selected.minimumInvestment * 5,
                    ].map(
                      (preset) =>
                        preset <= remaining && (
                          <button
                            key={preset}
                            onClick={() => setAmount(preset)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                          >
                            {formatCurrency(preset)}
                          </button>
                        ),
                    )}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod("bank_transfer")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "bank_transfer"
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <Banknote
                        className={`w-5 h-5 ${
                          paymentMethod === "bank_transfer"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          paymentMethod === "bank_transfer"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        Bank
                      </span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "card"
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <CreditCard
                        className={`w-5 h-5 ${
                          paymentMethod === "card"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          paymentMethod === "card"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        Card
                      </span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod("diaspora_remittance")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === "diaspora_remittance"
                          ? "border-yellow-400 bg-yellow-400/10"
                          : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                      }`}
                    >
                      <Globe2
                        className={`w-5 h-5 ${
                          paymentMethod === "diaspora_remittance"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          paymentMethod === "diaspora_remittance"
                            ? "text-yellow-400"
                            : "text-gray-400"
                        }`}
                      >
                        Diaspora
                      </span>
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Note to Business Owner (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a personal message..."
                    className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 resize-none"
                    rows={3}
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-400">
                      Investment Amount
                    </span>
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                    <span className="text-sm text-gray-400">
                      Expected Return ({selected.expectedReturn}%)
                    </span>
                    <span className="text-base font-bold text-green-400">
                      +{formatCurrency(expectedReturn)}
                    </span>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400 mb-1">
                        Investment Failed
                      </p>
                      <p className="text-xs text-red-300">{error}</p>
                    </div>
                  </div>
                )}

                {/* Invest Button */}
                <button
                  onClick={handleInvest}
                  disabled={
                    investing ||
                    amount < selected.minimumInvestment ||
                    amount > remaining ||
                    selected.status !== "published"
                  }
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25"
                >
                  {investing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : selected.status !== "published" ? (
                    "Not Available for Investment"
                  ) : (
                    "Confirm Investment"
                  )}
                </button>

                {/* Terms */}
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure transaction • Funds held in escrow</span>
                </div>

                {/* KYC Notice */}
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-400 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    KYC verification required before investment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailsPage;
