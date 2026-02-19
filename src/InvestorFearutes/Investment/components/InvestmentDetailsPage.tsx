// AdminFeatures/InvestmentApproval/components/AdminViewsDetailModals.tsx
import React from "react";
import type { Investment } from "@/types/index";
import {
  X,
  Building2,
  // Mail,
  // Phone,
  MapPin,
  Globe,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  // DollarSign,
  // Percent,
  User,
  Shield,
  // Calendar,
} from "lucide-react";

// ✅ Proper interface for props
interface AdminInvestmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: Investment | null;
  onApprove?: (investment: Investment) => void;
  onReject?: (investment: Investment) => void;
  actionLoading?: string | null;
}

const AdminInvestmentDetailModal: React.FC<AdminInvestmentDetailModalProps> = ({
  isOpen,
  onClose,
  investment,
  onApprove,
  onReject,
  actionLoading,
}) => {
  // Don't render if modal is closed or no investment data
  if (!isOpen || !investment) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number = 0) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string = "") => {
    const normalizedStatus = status?.toLowerCase() || "";

    switch (normalizedStatus) {
      case "approved":
        return (
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "rejected":
      case "cancelled":
        return (
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      case "published":
        return (
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Globe className="w-4 h-4" />
            Published
          </span>
        );
      case "draft":
        return (
          <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Draft
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Pending Review
          </span>
        );
    }
  };

  const isPending =
    investment.status?.toLowerCase() === "pending" ||
    investment.status?.toLowerCase() === "draft";

  const isApproved = investment.status?.toLowerCase() === "approved";
  const isRejected =
    investment.status?.toLowerCase() === "rejected" ||
    investment.status?.toLowerCase() === "cancelled";
  const isPublished = investment.status?.toLowerCase() === "published";

  const showApprove = onApprove && (isPending || isRejected);
  const showReject =
    onReject && (isPending || isApproved) && !isPublished && !isRejected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-[#0F0F0F] z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-2xl font-bold text-black">
              {investment.title?.charAt(0) || "I"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {investment.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(investment.status)}
                <span className="text-sm text-gray-400">
                  ID: {investment._id?.slice(-8)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Funding Goal</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(investment.fundingGoal)}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Current Funding</p>
              <p className="text-lg font-bold text-green-400">
                {formatCurrency(investment.currentFunding || 0)}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Expected Return</p>
              <p className="text-lg font-bold text-yellow-400">
                {investment.expectedReturn || 0}%
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Min Investment</p>
              <p className="text-lg font-bold text-white">
                {formatCurrency(investment.minimumInvestment)}
              </p>
            </div>
          </div>

          {/* Investment Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Information */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-yellow-400" />
                Business Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Business Name</p>
                    <p className="text-sm text-white">
                      {investment.businessName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Sector / Industry</p>
                    <p className="text-sm text-white">
                      {investment.sector}{" "}
                      {investment.industry && ` • ${investment.industry}`}
                    </p>
                  </div>
                </div>
                {investment.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-white">
                        {investment.location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
                Investment Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Investment Period</p>
                    <p className="text-sm text-white">
                      {investment.investmentPeriod || 0} months
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">ROI Expected</p>
                    <p className="text-sm text-green-400">
                      {investment.expectedReturn || 0}%
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Use of Funds</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {investment.useOfFunds || "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {investment.description || "No description provided."}
              </p>
            </div>

            {/* Risk Factors */}
            {investment.riskFactors && (
              <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Risk Factors
                </h3>
                <p className="text-gray-300 whitespace-pre-wrap">
                  {investment.riskFactors}
                </p>
              </div>
            )}

            {/* Business Plan */}
            {investment.businessPlan && (
              <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-yellow-400" />
                  Business Plan
                </h3>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {investment.businessPlan}
                  </p>
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Business Owner
              </h3>
              {typeof investment.businessOwnerId === "object" ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {investment.businessOwnerId.fullName?.charAt(0) ||
                      investment.businessOwnerId.email?.charAt(0) ||
                      "U"}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {investment.businessOwnerId.fullName || "Business Owner"}
                    </p>
                    <p className="text-sm text-gray-400">
                      {investment.businessOwnerId.email}
                    </p>
                    {investment.businessOwnerId.phoneNumber && (
                      <p className="text-xs text-gray-500 mt-1">
                        {investment.businessOwnerId.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">
                  Owner ID: {investment.businessOwnerId}
                </p>
              )}
            </div>

            {/* Timestamps */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="text-sm text-white">
                    {formatDate(investment.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm text-white">
                    {formatDate(investment.updatedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Verification Date
                  </p>
                  <p className="text-sm text-white">
                    {formatDate(investment.verificationDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            {investment.verificationNotes && (
              <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Verification Notes
                </h3>
                <p className="text-gray-300">{investment.verificationNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {(showApprove || showReject) && (
          <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-800 bg-[#0A0A0A] rounded-b-2xl">
            {showReject && (
              <button
                onClick={() => {
                  onReject?.(investment);
                  onClose();
                }}
                disabled={actionLoading === investment._id}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading === investment._id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-400 border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Reject Investment
                  </>
                )}
              </button>
            )}

            {showApprove && (
              <button
                onClick={() => {
                  onApprove?.(investment);
                  onClose();
                }}
                disabled={actionLoading === investment._id}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {actionLoading === investment._id ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    {isApproved ? "Publish Investment" : "Approve Investment"}
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* If no actions, just show close button */}
        {!showApprove && !showReject && (
          <div className="sticky bottom-0 flex items-center justify-end p-6 border-t border-gray-800 bg-[#0A0A0A] rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInvestmentDetailModal;
