import React from "react";
import type { Investment } from "@/types/index";
import {
  CheckCircle,
  XCircle,
  Eye,
  Globe,
  Clock,
  FileText,
  TrendingUp,
  Building2,
  Ban,
  AlertTriangle,
} from "lucide-react";

interface AdminInvestmentTableProps {
  investments: Investment[];
  actionLoading: string | null;
  onApprove: (investment: Investment) => void;
  onReject: (investment: Investment) => void;
  onPublish: (investment: Investment) => void;
  onViewDetails: (investment: Investment) => void;
}

const AdminInvestmentTable: React.FC<AdminInvestmentTableProps> = ({
  investments,
  actionLoading,
  onApprove,
  onReject,
  onPublish,
  onViewDetails, // ✅ This comes from parent component
}) => {
  const getStatusBadge = (status: string) => {
    const baseClass =
      "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5";

    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase() || "";

    switch (normalizedStatus) {
      case "draft":
        return (
          <span
            className={`${baseClass} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}
          >
            <Clock className="w-3 h-3" />
            Draft
          </span>
        );
      case "pending":
        return (
          <span
            className={`${baseClass} bg-blue-500/20 text-blue-400 border border-blue-500/30`}
          >
            <AlertTriangle className="w-3 h-3" />
            Pending Review
          </span>
        );
      case "approved":
        return (
          <span
            className={`${baseClass} bg-green-500/20 text-green-400 border border-green-500/30`}
          >
            <CheckCircle className="w-3 h-3" />
            Approved
          </span>
        );
      case "rejected":
      case "cancelled": // Handle both 'rejected' and 'cancelled' as same status
        return (
          <span
            className={`${baseClass} bg-red-500/20 text-red-400 border border-red-500/30 font-semibold`}
          >
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "published":
        return (
          <span
            className={`${baseClass} bg-purple-500/20 text-purple-400 border border-purple-500/30`}
          >
            <Globe className="w-3 h-3" />
            Published
          </span>
        );
      default:
        return (
          <span
            className={`${baseClass} bg-gray-500/20 text-gray-400 border border-gray-500/30`}
          >
            {status || "Unknown"}
          </span>
        );
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if investment is rejectable
  const isRejectable = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";
    return ["draft", "pending", "approved"].includes(normalizedStatus);
  };

  // Check if investment is approvable
  const isApprovable = (status: string) => {
    const normalizedStatus = status?.toLowerCase() || "";
    return ["draft", "pending"].includes(normalizedStatus);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/50">
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Investment
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Business
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Amount
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Status
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Submitted
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {investments.map((investment) => {
            const normalizedStatus = investment.status?.toLowerCase() || "";
            const isRejected =
              normalizedStatus === "rejected" ||
              normalizedStatus === "cancelled";

            return (
              <tr
                key={investment._id}
                className={`border-b border-gray-800 transition-colors ${
                  isRejected
                    ? "bg-red-500/5 hover:bg-red-500/10"
                    : "hover:bg-gray-900/50"
                }`}
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-white flex items-center">
                      <FileText
                        className={`w-4 h-4 mr-2 ${isRejected ? "text-red-400" : "text-gray-400"}`}
                      />
                      <span
                        className={isRejected ? "text-red-200" : "text-white"}
                      >
                        {investment.title}
                      </span>
                    </div>
                    <div
                      className={`text-sm mt-1 line-clamp-2 ${
                        isRejected ? "text-red-300/70" : "text-gray-400"
                      }`}
                    >
                      {investment.description?.substring(0, 100)}...
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-white flex items-center">
                      <Building2
                        className={`w-4 h-4 mr-2 ${isRejected ? "text-red-400" : "text-gray-400"}`}
                      />
                      <span
                        className={isRejected ? "text-red-200" : "text-white"}
                      >
                        {investment.businessName}
                      </span>
                    </div>
                    <div
                      className={`text-sm ${
                        isRejected ? "text-red-300/70" : "text-gray-400"
                      }`}
                    >
                      {investment.businessOwnerId?.email || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div
                    className={`font-bold ${
                      isRejected ? "text-red-300" : "text-white"
                    }`}
                  >
                    {formatCurrency(investment.fundingGoal || 0)}
                  </div>
                  <div
                    className={`text-sm flex items-center ${
                      isRejected ? "text-red-300/70" : "text-gray-400"
                    }`}
                  >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {investment.expectedReturn || 0}% ROI
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(investment.status)}
                </td>
                <td className="py-4 px-6 text-gray-400">
                  <div className="flex items-center">
                    <Clock
                      className={`w-4 h-4 mr-2 ${isRejected ? "text-red-400" : "text-gray-400"}`}
                    />
                    <span
                      className={isRejected ? "text-red-300" : "text-gray-300"}
                    >
                      {investment.createdAt
                        ? new Date(investment.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {/* View Details Button - Always visible */}
                    <button
                      onClick={() => onViewDetails(investment)} // ✅ Calls parent's function
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-300" />
                    </button>

                    {/* Approve Button - Only for draft/pending */}
                    {isApprovable(investment.status) && (
                      <button
                        onClick={() => onApprove(investment)}
                        disabled={actionLoading === investment._id}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Approve Investment"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      </button>
                    )}

                    {/* Reject Button - Only for non-rejected, non-published investments */}
                    {isRejectable(investment.status) && (
                      <button
                        onClick={() => onReject(investment)}
                        disabled={actionLoading === investment._id}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50 relative group"
                        title="Reject Investment"
                      >
                        <XCircle className="w-4 h-4 text-red-400" />
                      </button>
                    )}

                    {/* Publish Button - Only for approved */}
                    {investment.status?.toLowerCase() === "approved" && (
                      <button
                        onClick={() => onPublish(investment)}
                        disabled={actionLoading === investment._id}
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Publish to Investors"
                      >
                        <Globe className="w-4 h-4 text-purple-400" />
                      </button>
                    )}

                    {/* Already Rejected Indicator - Shows for rejected/cancelled */}
                    {isRejected && (
                      <div
                        className="p-2 bg-red-500/20 rounded-lg cursor-not-allowed border border-red-500/30"
                        title="Already Rejected"
                      >
                        <Ban className="w-4 h-4 text-red-400" />
                      </div>
                    )}

                    {/* Already Published Indicator */}
                    {investment.status?.toLowerCase() === "published" && (
                      <div
                        className="p-2 bg-purple-500/20 rounded-lg cursor-not-allowed border border-purple-500/30"
                        title="Already Published"
                      >
                        <Globe className="w-4 h-4 text-purple-400 opacity-60" />
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminInvestmentTable;
