// src/InvestorFearutes/IPOInvesting/components/InvestorIPODetailsModal.tsx

import React from "react";
import {
  X,
  Calendar,
  Users,
  TrendingUp,
  Shield,
  FileText,
  Building2,
  // Globe,
} from "lucide-react";

interface InvestorIPODetailsModalProps {
  ipo: any;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
}

const InvestorIPODetailsModal: React.FC<InvestorIPODetailsModalProps> = ({
  ipo,
  isOpen,
  onClose,
  onSubscribe,
}) => {
  if (!isOpen || !ipo) return null;

  // Format currency
  const formatCurrency = (amount: number): string => {
    if (amount === undefined || amount === null) return "ETB 0.00";
    return `ETB ${amount.toLocaleString()}`;
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    if (num === undefined || num === null) return "0";
    return num.toLocaleString();
  };

  // Format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Get status color with brand colors
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      announced: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
      active: "bg-green-900/30 text-green-400 border border-green-800",
      upcoming: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
      closed: "bg-gray-800 text-gray-400 border border-gray-700",
      allocated: "bg-purple-900/30 text-purple-400 border border-purple-800",
      listed: "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30",
      approved: "bg-green-900/30 text-green-400 border border-green-800",
      rejected: "bg-red-900/30 text-red-400 border border-red-800",
      pending: "bg-yellow-900/30 text-[#FFD700] border border-[#FFD700]/30",
    };
    return (
      statusMap[status] || "bg-gray-800 text-gray-400 border border-gray-700"
    );
  };

  // Calculate subscription percentage
  const subscriptionPercentage =
    ipo.totalShares > 0
      ? ((ipo.totalSubscribed / ipo.totalShares) * 100).toFixed(2)
      : "0";

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">
                  {ipo.companyName}
                </h2>
                <span className="text-[#FFD700] font-mono bg-[#FFD700]/10 px-3 py-1 rounded-full text-sm border border-[#FFD700]/20">
                  {ipo.symbol}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ipo.status)}`}
                >
                  {ipo.status?.charAt(0).toUpperCase() + ipo.status?.slice(1) ||
                    "Unknown"}
                </span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{ipo.sector || "N/A"}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">{ipo.industry || "N/A"}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-[#FFD700] transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              icon={<TrendingUp className="text-[#FFD700]" size={20} />}
              label="Offer Price"
              value={formatCurrency(ipo.offerPrice)}
            />
            <MetricCard
              icon={<Building2 className="text-[#FFD700]" size={20} />}
              label="Face Value"
              value={formatCurrency(ipo.faceValue)}
            />
            <MetricCard
              icon={<Users className="text-[#FFD700]" size={20} />}
              label="Total Shares"
              value={formatNumber(ipo.totalShares)}
            />
            <MetricCard
              icon={<Shield className="text-[#FFD700]" size={20} />}
              label="Issue Size"
              value={formatCurrency(ipo.issueSize)}
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard label="Lot Size" value={`${ipo.lotSize || 0} shares`} />
            <MetricCard label="Min Lot" value={`${ipo.minimumLot || 1} lots`} />
            <MetricCard
              label="Max Lot"
              value={ipo.maximumLot ? `${ipo.maximumLot} lots` : "No limit"}
            />
            <MetricCard
              label="IPO Type"
              value={
                ipo.ipoType
                  ?.split("_")
                  .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(" ") || "N/A"
              }
            />
          </div>

          {/* Subscription Status */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users size={18} className="text-[#FFD700]" />
              Subscription Status
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Total Applications</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(ipo.totalApplications)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Subscribed Shares</p>
                <p className="text-xl font-bold text-white">
                  {formatNumber(ipo.totalSubscribed)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Subscription Ratio</p>
                <p className="text-xl font-bold text-[#FFD700]">
                  {subscriptionPercentage}%
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FFD700] rounded-full"
                style={{
                  width: `${Math.min(Number(subscriptionPercentage), 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-[#FFD700]" />
              Timeline
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="text-lg font-medium text-white">
                  {formatDate(ipo.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">End Date</p>
                <p className="text-lg font-medium text-white">
                  {formatDate(ipo.endDate)}
                </p>
              </div>
              {ipo.approvalDate && (
                <>
                  <div>
                    <p className="text-sm text-gray-400">Approval Date</p>
                    <p className="text-lg font-medium text-white">
                      {formatDate(ipo.approvalDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created At</p>
                    <p className="text-lg font-medium text-white">
                      {formatDate(ipo.createdAt)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#FFD700]" />
              About the Company
            </h3>
            <p className="text-gray-300 leading-relaxed">
              {ipo.description || "No description available."}
            </p>
          </div>

          {/* Documents */}
          <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <FileText size={18} className="text-[#FFD700]" />
              Documents
            </h3>
            {ipo.prospectusUrl ? (
              <a
                href={ipo.prospectusUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#FFD700] hover:text-[#FFA500] transition-colors"
              >
                <FileText size={16} />
                Download Prospectus
              </a>
            ) : (
              <p className="text-gray-400">No documents available</p>
            )}
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">View Count</p>
              <p className="text-lg font-medium text-white">
                {formatNumber(ipo.viewCount)}
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Interested Investors</p>
              <p className="text-lg font-medium text-white">
                {formatNumber(ipo.interestedInvestors)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-800">
            <button
              onClick={onSubscribe}
              disabled={ipo.status !== "active"}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                ipo.status === "active"
                  ? "bg-[#FFD700] text-gray-900 hover:bg-[#FFA500]"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
              }`}
            >
              {ipo.status === "active"
                ? "Subscribe Now"
                : "Not Available for Subscription"}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component with Brand Colors
const MetricCard: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <p className="text-sm text-gray-400">{label}</p>
    </div>
    <p className="text-lg font-bold text-white">{value}</p>
  </div>
);

export default InvestorIPODetailsModal;
