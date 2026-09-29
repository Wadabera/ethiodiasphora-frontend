// features/ipo/pages/IpoBrowsePage.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { browseIpos, subscribeToIpo, fetchIpoById } from "../slices/IpoSlice";
import {
  Clock,
  Users,
  Building2,
  Search,
  ChevronRight,
  Briefcase,
  CheckCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const IpoBrowsePage = () => {
  const dispatch = useAppDispatch();
  const { ipos, loading, subscribing, selectedIpo } = useAppSelector(
    (state) => state.ipo,
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIpoId, setSelectedIpoId] = useState<string | null>(null);
  const [lotsAmount, setLotsAmount] = useState<number>(1);
  const [sharesAmount, setSharesAmount] = useState<number>(10);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);
  const [subscribeErrorMsg, setSubscribeErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    dispatch(browseIpos({ status: "open" }));
  }, [dispatch]);

  // Derived attributes from selectedIpo
  const effectivePrice = Number(selectedIpo?.offerPrice ?? selectedIpo?.pricePerShare ?? 0);
  const effectiveLotSize = Math.max(1, Number(selectedIpo?.lotSize ?? 1) || 1);
  const minLots = Math.max(1, Number(selectedIpo?.minimumLot ?? 1) || 1);
  const maxLots = Math.max(minLots, Number(selectedIpo?.maximumLot ?? 1000) || 1000);
  const minShares = minLots * effectiveLotSize;
  const maxShares = maxLots * effectiveLotSize;
  const totalInvestment = lotsAmount * effectiveLotSize * effectivePrice;

  // Filter IPOs
  const filteredIpos = ipos.filter((ipo) => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        (ipo.companyName || "").toLowerCase().includes(term) ||
        (ipo.symbol || "").toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Format currency safely in ETB
  const formatCurrency = (amount: number | undefined | null) => {
    const val = Number(amount ?? 0);
    if (isNaN(val)) return "ETB 0";
    return `ETB ${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  // Format large numbers safely
  const formatNumber = (num: number | undefined | null) => {
    const val = Number(num ?? 0);
    if (isNaN(val)) return "0";
    return new Intl.NumberFormat("en-US").format(val);
  };

  // Handle subscribe click
  const handleSubscribeClick = async (ipoId: string) => {
    setSelectedIpoId(ipoId);
    setSubscribeErrorMsg(null);
    const resultAction = await dispatch(fetchIpoById(ipoId));
    if (fetchIpoById.fulfilled.match(resultAction)) {
      const fetchedIpo = resultAction.payload;
      const lSize = Math.max(1, Number(fetchedIpo.lotSize ?? 1) || 1);
      const initialLots = Math.max(1, Number(fetchedIpo.minimumLot ?? 1) || 1);
      setLotsAmount(initialLots);
      setSharesAmount(initialLots * lSize);
    }
    setShowSubscribeModal(true);
  };

  // Handle lots change
  const handleLotsChange = (newLots: number) => {
    const clampedLots = Math.max(minLots, Math.min(maxLots, newLots));
    setLotsAmount(clampedLots);
    setSharesAmount(clampedLots * effectiveLotSize);
  };

  // Handle subscription submission
  const handleSubscribe = async () => {
    if (!selectedIpoId) return;
    setSubscribeErrorMsg(null);

    try {
      const result = await dispatch(
        subscribeToIpo({
          ipoId: selectedIpoId,
          quantity: lotsAmount,
          lots: lotsAmount,
          shares: lotsAmount * effectiveLotSize,
          bidPrice: effectivePrice,
          lotSize: effectiveLotSize,
          offerPrice: effectivePrice,
        }),
      ).unwrap();

      setSubscriptionResult(result);
      setShowSubscribeModal(false);
      setShowSuccessModal(true);

      // Refresh IPO list
      dispatch(browseIpos({ status: "open" }));
    } catch (error: any) {
      console.error("Subscription failed:", error);
      setSubscribeErrorMsg(
        typeof error === "string" ? error : error?.message || "Subscription failed. Please check your balance or KYC status."
      );
    }
  };

  // Fill Demo helper
  const handleFillDemo = () => {
    const demoLots = Math.max(minLots, 5);
    setLotsAmount(demoLots);
    setSharesAmount(demoLots * effectiveLotSize);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      pending_approval: "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30",
      approved: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
      announced: "bg-blue-400/10 text-blue-400 border border-blue-400/30",
      open: "bg-green-400/10 text-green-400 border border-green-400/30",
      closed: "bg-gray-400/10 text-gray-400 border border-gray-400/30",
      allotted: "bg-purple-400/10 text-purple-400 border border-purple-400/30",
      listed: "bg-indigo-400/10 text-indigo-400 border border-indigo-400/30",
      rejected: "bg-red-400/10 text-red-400 border border-red-400/30",
    };

    const cleanStatus = (status || "open").toLowerCase();
    const label = cleanStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[cleanStatus] || styles.open}`}
      >
        {label}
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
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-green-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">
              IPO Subscription Successful!
            </h3>
            <p className="text-gray-400 text-center mb-6">
              You subscribed to <span className="text-yellow-400 font-bold">{lotsAmount} lots</span> ({formatNumber(sharesAmount)} shares)
            </p>

            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total Investment</span>
                <span className="text-yellow-400 font-bold text-base">
                  {formatCurrency(subscriptionResult?.totalAmount || totalInvestment)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Price per Share</span>
                <span className="text-white font-medium">
                  {formatCurrency(effectivePrice)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Application Number</span>
                <span className="text-gray-300 font-mono text-xs">
                  {subscriptionResult?.applicationNumber || `APP-${selectedIpo?.symbol}-${Date.now().toString().slice(-6)}`}
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
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all cursor-pointer text-center"
              >
                Continue
              </button>
              <Link
                to="/investor/ipo/sub"
                onClick={() => {
                  setShowSuccessModal(false);
                  setSubscriptionResult(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold rounded-xl transition-all text-center flex items-center justify-center"
              >
                My Subscriptions
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUBSCRIBE MODAL ===== */}
      {showSubscribeModal && selectedIpo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative my-8">
            <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Subscribe to IPO</span>
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Direct share allocation through Ethiopian Securities Exchange
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="px-2.5 py-1 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400/50 text-yellow-400 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Fill Demo
                </button>
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setSelectedIpoId(null);
                    setSubscribeErrorMsg(null);
                  }}
                  className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {subscribeErrorMsg && (
              <div className="mb-4 bg-red-950/60 border border-red-800/80 rounded-xl p-3 flex items-start gap-2 text-sm text-red-300">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Subscription Notice</p>
                  <p className="text-xs text-red-200 mt-0.5">{subscribeErrorMsg}</p>
                </div>
              </div>
            )}

            <div className="mb-6 space-y-4">
              {/* Company Info Box */}
              <div className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-800">
                <div className="p-2.5 bg-yellow-400/10 rounded-lg text-yellow-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-white">
                    {selectedIpo.companyName}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-0.5">
                    <span>Symbol: <strong className="text-gray-200">{selectedIpo.symbol}</strong></span>
                    <span>•</span>
                    <span>Sector: <strong className="text-gray-200">{selectedIpo.sector || "General"}</strong></span>
                  </div>
                </div>
              </div>

              {/* Price Details Grid */}
              <div className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/60 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Offer Price per Share</span>
                  <span className="text-yellow-400 font-bold text-base">
                    {formatCurrency(effectivePrice)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Lot Size</span>
                  <span className="text-white font-medium">
                    {effectiveLotSize} shares / lot
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Minimum Application</span>
                  <span className="text-white font-medium">
                    {minLots} lot ({formatNumber(minShares)} shares)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Closing Date</span>
                  <span className="text-white font-medium">
                    {new Date(selectedIpo.closingDate || selectedIpo.endDate || Date.now()).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Lots Input with Controls */}
              <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-800">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Number of Lots to Subscribe
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleLotsChange(lotsAmount - 1)}
                    disabled={lotsAmount <= minLots}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={lotsAmount}
                    onChange={(e) => handleLotsChange(parseInt(e.target.value) || minLots)}
                    min={minLots}
                    max={maxLots}
                    className="flex-1 bg-gray-900 border border-gray-700 text-white text-2xl font-bold px-4 py-2.5 rounded-xl text-center focus:outline-none focus:border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleLotsChange(lotsAmount + 1)}
                    disabled={lotsAmount >= maxLots}
                    className="w-12 h-12 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-white font-bold text-xl disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
                <div className="flex justify-between mt-2.5 text-xs text-gray-400">
                  <span>Equivalent to: <strong className="text-white">{formatNumber(sharesAmount)} total shares</strong></span>
                  <span>Max: {maxLots} lots</span>
                </div>
              </div>

              {/* Total Investment Summary */}
              <div className="bg-gradient-to-r from-gray-800/80 to-gray-800/40 rounded-xl p-4 border border-yellow-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-gray-400 font-semibold block">
                      Total Investment
                    </span>
                    <span className="text-xs text-gray-400">
                      {lotsAmount} lots × {effectiveLotSize} shares × {formatCurrency(effectivePrice)}
                    </span>
                  </div>
                  <span className="text-2xl sm:text-3xl font-black text-yellow-400">
                    {formatCurrency(totalInvestment)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSubscribeModal(false);
                  setSelectedIpoId(null);
                  setSubscribeErrorMsg(null);
                }}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={subscribing || lotsAmount < minLots || lotsAmount > maxLots}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-yellow-500/20"
              >
                {subscribing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Subscribing...
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
              Funds will be earmarked and processed upon allotment according to ESX regulations.
            </p>
          </div>
        </div>
      )}

      {/* ===== HEADER ===== */}
      <div className="border-b border-gray-800 bg-gray-900/50 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl">
                <Briefcase className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Initial Public Offerings (IPOs)
                </h1>
                <p className="text-sm text-gray-400">
                  Subscribe to primary shares of Ethiopian companies listing on the exchange
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 rounded-full text-xs font-semibold">
                {ipos.length} Active Listings
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search IPOs by company name or stock symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
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
              Check back soon for new public offering opportunities
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIpos.map((ipo) => {
              const ipoPrice = Number(ipo.offerPrice ?? ipo.pricePerShare ?? 0);
              const ipoTotalShares = Number(ipo.totalShares || 1);
              const ipoSubscribed = Number(ipo.totalSubscribed ?? ipo.totalSubscribedShares ?? 0);
              const oversubscribed = ipoSubscribed > ipoTotalShares;
              const subscriptionRate = (ipoSubscribed / ipoTotalShares) * 100;
              const closingTime = new Date(ipo.closingDate || ipo.endDate || Date.now()).getTime();
              const daysLeft = Math.ceil((closingTime - Date.now()) / (1000 * 60 * 60 * 24));
              const isOpen = (ipo.status || "").toLowerCase() === "open";

              return (
                <div
                  key={ipo._id}
                  className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-400/50 hover:shadow-2xl hover:shadow-yellow-500/5 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                            {ipo.companyName}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm font-semibold text-gray-300">{ipo.symbol}</span>
                            <span className="text-xs text-gray-500">• {ipo.sector || "Agro-Industry"}</span>
                          </div>
                        </div>
                      </div>
                      {getStatusBadge(ipo.status)}
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-4 mb-4 p-3.5 bg-gray-800/40 rounded-xl border border-gray-800">
                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Offer Price</div>
                        <div className="text-yellow-400 font-bold text-base">
                          {formatCurrency(ipoPrice)}
                        </div>
                      </div>
                      <div className="text-center border-x border-gray-700/60">
                        <div className="text-xs text-gray-400 mb-1">Lot Size</div>
                        <div className="text-white font-bold text-base">
                          {ipo.lotSize || 1} shares
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-400 mb-1">Total Shares</div>
                        <div className="text-green-400 font-bold text-base">
                          {formatNumber(ipo.totalShares)}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">
                          Subscription Progress
                        </span>
                        <span
                          className={`font-semibold ${oversubscribed ? "text-green-400" : "text-yellow-400"}`}
                        >
                          {subscriptionRate.toFixed(1)}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            oversubscribed
                              ? "bg-gradient-to-r from-green-400 to-green-500"
                              : "bg-gradient-to-r from-yellow-400 to-yellow-500"
                          }`}
                          style={{ width: `${Math.min(subscriptionRate, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>{formatNumber(ipoSubscribed)} subscribed</span>
                        <span>{formatNumber(ipo.totalShares)} total</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-2">
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          {daysLeft > 0 ? `${daysLeft} days left` : "Open now"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>
                          {ipo.totalApplications || ipo.subscriptionCount || 0} applications
                        </span>
                      </div>
                    </div>

                    {isOpen ? (
                      <button
                        onClick={() => handleSubscribeClick(ipo._id)}
                        className="px-5 py-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/20 cursor-pointer text-sm"
                      >
                        Subscribe
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <span className="px-3.5 py-1.5 bg-gray-800 text-gray-400 rounded-xl text-xs font-semibold">
                        {ipo.status}
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
