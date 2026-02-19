// features/ipo/pages/IpoBrowsePage.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { browseIpos, subscribeToIpo, fetchIpoById } from "../slices/IpoSlice";
import {
  // TrendingUp,
  // DollarSign,
  Clock,
  Users,
  Building2,
  Search,
  ChevronRight,
  Briefcase,
  // Calendar,
  // Percent,
  // Shield,
  // AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  // Info,
} from "lucide-react";

const IpoBrowsePage = () => {
  const dispatch = useAppDispatch();
  const { ipos, loading, subscribing, selectedIpo,  } = useAppSelector(
    (state) => state.ipo,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState<string | null>(null);
  const [sharesAmount, setSharesAmount] = useState<number>(100);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);

  useEffect(() => {
    dispatch(browseIpos({ status: "open" }));
  }, [dispatch]);

  // Filter IPOs
  const filteredIpos = ipos.filter((ipo) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        ipo.companyName.toLowerCase().includes(term) ||
        ipo.symbol.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Format currency
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);

  // Format large numbers
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  // Handle subscribe click
  const handleSubscribeClick = async (ipoId: string) => {
    setSelectedIpoId(ipoId);
    await dispatch(fetchIpoById(ipoId));
    setShowSubscribeModal(true);
  };

  // Handle subscription
  const handleSubscribe = async () => {
    if (!selectedIpoId || !sharesAmount) return;

    try {
      const result = await dispatch(
        subscribeToIpo({
          ipoId: selectedIpoId,
          shares: sharesAmount,
        }),
      ).unwrap();

      setSubscriptionResult(result);
      setShowSubscribeModal(false);
      setShowSuccessModal(true);

      // Refresh IPO list
      dispatch(browseIpos({ status: "open" }));
    } catch (error) {
      console.error("Subscription failed:", error);
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      approved: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
      open: "bg-green-400/10 text-green-400 border border-green-400/30",
      closed: "bg-gray-400/10 text-gray-400 border border-gray-400/30",
      allotted: "bg-purple-400/10 text-purple-400 border border-purple-400/30",
      listed: "bg-indigo-400/10 text-indigo-400 border border-indigo-400/30",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading && ipos.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading available IPOs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 pb-16">
      {/* ===== SUCCESS MODAL ===== */}
      {showSuccessModal && subscriptionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              IPO Subscription Successful!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              You subscribed to {formatNumber(sharesAmount)} shares
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Investment</span>
                <span className="text-white font-bold">
                  {formatCurrency(selectedIpo?.pricePerShare! * sharesAmount)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Price per Share</span>
                <span className="text-white">
                  {formatCurrency(selectedIpo?.pricePerShare || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="text-yellow-400 font-medium">
                  Pending Allotment
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubscriptionResult(null);
                  setSharesAmount(100);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold rounded-lg hover:from-yellow-500 hover:to-yellow-600 transition-all"
              >
                Continue Browsing
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubscriptionResult(null);
                  setSharesAmount(100);
                  // Navigate to my subscriptions
                  window.location.href = "/investor/ipo-subscriptions";
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-all"
              >
                View Subscriptions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBSCRIBE MODAL ===== */}
      {showSubscribeModal && selectedIpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Subscribe to IPO</h3>
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  setSelectedIpoId(null);
                }}
                className="text-gray-500 hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-400/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">
                    {selectedIpo.companyName}
                  </h4>
                  <p className="text-sm text-gray-400">
                    Symbol: {selectedIpo.symbol}
                  </p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Price per Share</span>
                  <span className="text-white font-bold">
                    {formatCurrency(selectedIpo.pricePerShare)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Minimum Shares</span>
                  <span className="text-white">
                    {formatNumber(selectedIpo.minimumShares)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Closing Date</span>
                  <span className="text-white">
                    {new Date(selectedIpo.closingDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Number of Shares
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sharesAmount}
                    onChange={(e) => setSharesAmount(Number(e.target.value))}
                    min={selectedIpo.minimumShares}
                    max={selectedIpo.maximumShares || selectedIpo.totalShares}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-xl font-bold px-4 py-4 rounded-xl focus:outline-none focus:border-yellow-400"
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">
                    Min: {formatNumber(selectedIpo.minimumShares)} shares
                  </span>
                  <span className="text-gray-500">
                    Max:{" "}
                    {formatNumber(
                      selectedIpo.maximumShares || selectedIpo.totalShares,
                    )}{" "}
                    shares
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Total Investment
                  </span>
                  <span className="text-2xl font-bold text-yellow-400">
                    {formatCurrency(selectedIpo.pricePerShare * sharesAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  setSelectedIpoId(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubscribe}
                disabled={
                  subscribing ||
                  sharesAmount < selectedIpo.minimumShares ||
                  sharesAmount >
                    (selectedIpo.maximumShares || selectedIpo.totalShares)
                }
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {subscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Subscription
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              By subscribing, you agree to the IPO terms and conditions
            </p>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg">
                <Briefcase className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Initial Public Offerings
                </h1>
                <p className="text-sm text-gray-400">
                  Invest in Ethiopian companies going public
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-medium">
                {ipos.length} Active IPOs
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by company name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== IPO GRID ===== */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredIpos.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No IPOs available
            </h3>
            <p className="text-gray-400">
              Check back later for new investment opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIpos.map((ipo) => {
              const oversubscribed =
                ipo.totalSubscribedShares > ipo.totalShares;
              const subscriptionRate =
                (ipo.totalSubscribedShares / ipo.totalShares) * 100;
              const daysLeft = Math.ceil(
                (new Date(ipo.closingDate).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              return (
                <div
                  key={ipo._id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/5 transition-all"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">
                          {ipo.companyName}
                        </h3>
                        <p className="text-sm text-gray-400">{ipo.symbol}</p>
                      </div>
                    </div>
                    {getStatusBadge(ipo.status)}
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-800/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Price</div>
                      <div className="text-white font-bold">
                        {formatCurrency(ipo.pricePerShare)}
                      </div>
                    </div>
                    <div className="text-center border-x border-gray-700">
                      <div className="text-xs text-gray-500 mb-1">Shares</div>
                      <div className="text-white font-bold">
                        {formatNumber(ipo.totalShares)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500 mb-1">Raised</div>
                      <div className="text-green-400 font-bold">
                        {formatCurrency(ipo.raisedAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">
                        Subscription Progress
                      </span>
                      <span
                        className={`font-medium ${oversubscribed ? "text-green-400" : "text-yellow-400"}`}
                      >
                        {subscriptionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          oversubscribed
                            ? "bg-gradient-to-r from-green-400 to-green-500"
                            : "bg-gradient-to-r from-purple-400 to-purple-500"
                        }`}
                        style={{ width: `${Math.min(subscriptionRate, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatNumber(ipo.totalSubscribedShares)} subscribed
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatNumber(ipo.totalShares)} total
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {daysLeft > 0
                            ? `${daysLeft} days left`
                            : "Closing soon"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-400">
                          {ipo.subscriptionCount} subs
                        </span>
                      </div>
                    </div>

                    {ipo.status === "open" ? (
                      <button
                        onClick={() => handleSubscribeClick(ipo._id)}
                        className="px-6 py-2.5 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-black font-semibold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/25"
                      >
                        Subscribe
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="px-4 py-2 bg-gray-800 text-gray-400 rounded-xl text-sm">
                        {ipo.status === "closed"
                          ? "Closed"
                          : ipo.status === "allotted"
                            ? "Allotted"
                            : ipo.status === "listed"
                              ? "Listed"
                              : "Coming Soon"}
                      </span>
                    )}
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

export default IpoBrowsePage;
