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
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Clock,
  // Users,
  Building2,
  Percent,
  AlertCircle,
  CheckCircle,
  Loader2,
  Banknote,
  CreditCard,
  Globe2,
  Shield,
} from "lucide-react";

const InvestmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { selected, loading, investing, success, error, investedIds } =
    useAppSelector((state) => state.published);

  // Form state
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [notes, setNotes] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvestmentById(id));
      dispatch(fetchMyPortfolio()); // Load portfolio to check if already invested
    }
    return () => {
      dispatch(clearError());
      dispatch(resetInvest());
      dispatch(resetSuccess());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (selected) {
      setAmount(selected.minimumInvestment || 100);
      setNotes(`Excited to invest in ${selected.businessName}!`);
    }
  }, [selected]);

  useEffect(() => {
    if (success) {
      setShowSuccessModal(true);
      // Refresh portfolio data
      dispatch(fetchMyPortfolio());

      // Auto-hide after 5 seconds
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

  // Check if already invested
  const hasInvested = id ? investedIds.includes(id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading investment details...</p>
        </div>
      </div>
    );
  }

  if (!selected) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
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

  // If already invested, show invested view
  if (hasInvested) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-gray-900 border border-green-500/30 rounded-2xl">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            You've Already Invested
          </h2>
          <p className="text-gray-400 mb-6">
            You invested in {selected.businessName}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/investor/portfolio")}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
            >
              View Portfolio
            </button>
            <button
              onClick={() => navigate("/investor/investments")}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
            >
              Browse More
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progress = (selected.currentFunding / selected.fundingGoal) * 100;
  const remaining = selected.fundingGoal - selected.currentFunding;
  const expectedReturn = (amount * selected.expectedReturn) / 100;

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              Investment Successful!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              You invested {formatCurrency(amount)} in {selected.businessName}
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Investment Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Header */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-medium">
                      {selected.sector}
                    </span>
                    <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                      {selected.riskFactors || "Medium Risk"}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    {selected.title}
                  </h1>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Building2 className="w-4 h-4" />
                    <span>{selected.businessName}</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs text-gray-400">Goal</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(selected.fundingGoal)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">Raised</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {formatCurrency(selected.currentFunding)}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Percent className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">Return</span>
                  </div>
                  <p className="text-lg font-bold text-green-400">
                    {selected.expectedReturn}%
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-400">Period</span>
                  </div>
                  <p className="text-lg font-bold text-white">
                    {selected.investmentPeriod} months
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Funding Progress</span>
                  <span className="font-medium text-yellow-400">
                    {progress.toFixed(1)}%
                  </span>
                </div>
                <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">
                    Raised: {formatCurrency(selected.currentFunding)}
                  </span>
                  <span className="text-gray-500">
                    Target: {formatCurrency(selected.fundingGoal)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                About the Investment
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {selected.description || "No description provided."}
              </p>

              {selected.useOfFunds && (
                <div className="mt-6">
                  <h4 className="text-md font-semibold text-white mb-3">
                    Use of Funds
                  </h4>
                  <p className="text-gray-400">{selected.useOfFunds}</p>
                </div>
              )}
            </div>

            {/* Business Information */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Business Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Company</div>
                  <div className="text-white font-medium">
                    {selected.businessName}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Sector</div>
                  <div className="text-white font-medium">
                    {selected.sector}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Founded</div>
                  <div className="text-white font-medium">2024</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Verification</div>
                  <div className="text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Investment Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  Invest Now
                </h3>

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-2">
                    Investment Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      min={selected.minimumInvestment}
                      max={remaining}
                      className="w-full bg-gray-800 border border-gray-700 text-white text-xl font-bold pl-8 pr-4 py-4 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-500">
                      Min: {formatCurrency(selected.minimumInvestment)}
                    </span>
                    <span className="text-gray-500">
                      Available: {formatCurrency(remaining)}
                    </span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <label className="block text-sm text-gray-400 mb-3">
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
                  <label className="block text-sm text-gray-400 mb-2">
                    Note (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Excited to support Ethiopian innovation!"
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
                    amount > remaining
                  }
                  className="w-full py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/25"
                >
                  {investing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Confirm Investment</>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Secure transaction</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentDetailPage;
