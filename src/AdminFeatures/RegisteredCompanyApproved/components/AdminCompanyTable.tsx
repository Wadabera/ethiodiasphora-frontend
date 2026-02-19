import React from "react";
import type { Company } from "../types/company.types";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Building2,
  // Mail,
  // Phone,
  // Calendar,
  // FileText,
  // Briefcase,
  // Hash,
  // Globe,
  ThumbsUp,
  ThumbsDown,
  UserMinus,
  AlertTriangle,
} from "lucide-react";

interface AdminCompanyTableProps {
  companies: Company[];
  actionLoading: string | null;
  onViewDetails: (id: string) => void;
  onApprove: (id: string, notes?: string) => Promise<void>;
  onRejectClick: (company: Company) => void;
  onSuspendClick: (company: Company) => void;
}

const AdminCompanyTable: React.FC<AdminCompanyTableProps> = ({
  companies,
  actionLoading,
  onViewDetails,
  onApprove,
  onRejectClick,
  onSuspendClick,
}) => {
  const getStatusBadge = (status: string) => {
    const baseClass =
      "px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit";

    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <span
            className={`${baseClass} bg-yellow-500/20 text-yellow-400 border border-yellow-500/30`}
          >
            <Clock className="w-3 h-3" />
            Pending
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
        return (
          <span
            className={`${baseClass} bg-red-500/20 text-red-400 border border-red-500/30`}
          >
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case "suspended":
        return (
          <span
            className={`${baseClass} bg-purple-500/20 text-purple-400 border border-purple-500/30`}
          >
            <UserMinus className="w-3 h-3" />
            Suspended
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getStatusDateTime = (company: Company) => {
    if (company.licenseStatus === "approved" && company.verificationDate) {
      return formatDateTime(company.verificationDate);
    }
    if (company.licenseStatus === "rejected" && company.rejectedDate) {
      return formatDateTime(company.rejectedDate);
    }
    if (company.licenseStatus === "suspended" && company.suspendedDate) {
      return formatDateTime(company.suspendedDate);
    }
    return formatDateTime(company.registrationDate || company.createdAt);
  };

  const getStatusReason = (company: Company) => {
    if (company.licenseStatus === "rejected" && company.rejectedReason) {
      return company.rejectedReason;
    }
    if (company.licenseStatus === "suspended" && company.suspendedReason) {
      return company.suspendedReason;
    }
    return null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/50">
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Company
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Contact
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Registration
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Status
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Date & Time
            </th>
            <th className="text-left py-4 px-6 text-gray-400 font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const normalizedStatus = company.licenseStatus?.toLowerCase() || "";
            const isPending = normalizedStatus === "pending";
            const isApproved = normalizedStatus === "approved";
            const isRejected = normalizedStatus === "rejected";
            const isSuspended = normalizedStatus === "suspended";
            const isLoading = actionLoading === company._id;
            const statusDateTime = getStatusDateTime(company);
            const statusReason = getStatusReason(company);

            return (
              <tr
                key={company._id}
                className={`border-b border-gray-800 transition-colors ${
                  isRejected
                    ? "bg-red-500/5 hover:bg-red-500/10"
                    : isSuspended
                      ? "bg-purple-500/5 hover:bg-purple-500/10"
                      : isApproved
                        ? "bg-green-500/5 hover:bg-green-500/10"
                        : "hover:bg-gray-900/50"
                }`}
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-white flex items-center">
                      <Building2
                        className={`w-4 h-4 mr-2 ${
                          isRejected
                            ? "text-red-400"
                            : isSuspended
                              ? "text-purple-400"
                              : isApproved
                                ? "text-green-400"
                                : "text-gray-400"
                        }`}
                      />
                      <span
                        className={
                          isRejected
                            ? "text-red-200"
                            : isSuspended
                              ? "text-purple-200"
                              : isApproved
                                ? "text-green-200"
                                : "text-white"
                        }
                      >
                        {company.name || company.companyName}
                      </span>
                    </div>
                    <div
                      className={`text-sm mt-1 ${
                        isRejected
                          ? "text-red-300/70"
                          : isSuspended
                            ? "text-purple-300/70"
                            : isApproved
                              ? "text-green-300/70"
                              : "text-gray-400"
                      }`}
                    >
                      {company.industry || company.sector || "N/A"} •{" "}
                      {company.businessType}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm text-gray-300">{company.email}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      {company.phone || company.phoneNumber || "N/A"}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="text-sm text-gray-300">
                      TIN: {company.tinNumber}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Reg: {company.registrationNumber}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  {getStatusBadge(company.licenseStatus)}
                  {statusReason && (
                    <div
                      className="mt-2 text-xs text-gray-400 max-w-[200px]"
                      title={statusReason}
                    >
                      <AlertTriangle className="w-3 h-3 inline mr-1 text-gray-500" />
                      {statusReason.substring(0, 40)}...
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {statusDateTime && (
                    <div>
                      <div className="text-sm text-white">
                        {statusDateTime.date}
                      </div>
                      <div className="text-xs text-gray-400">
                        {statusDateTime.time}
                      </div>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {/* View Details Button */}
                    <button
                      onClick={() => onViewDetails(company._id)}
                      disabled={isLoading}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-300" />
                    </button>

                    {/* Approve Button - Only for pending */}
                    {isPending && (
                      <button
                        onClick={() => onApprove(company._id)}
                        disabled={isLoading}
                        className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Approve Company"
                      >
                        <ThumbsUp className="w-4 h-4 text-green-400" />
                      </button>
                    )}

                    {/* Reject Button - Only for pending */}
                    {isPending && (
                      <button
                        onClick={() => onRejectClick(company)}
                        disabled={isLoading}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Reject Company"
                      >
                        <ThumbsDown className="w-4 h-4 text-red-400" />
                      </button>
                    )}

                    {/* Suspend Button - Only for approved */}
                    {isApproved && (
                      <button
                        onClick={() => onSuspendClick(company)}
                        disabled={isLoading}
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors disabled:opacity-50"
                        title="Suspend Company"
                      >
                        <UserMinus className="w-4 h-4 text-purple-400" />
                      </button>
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

export default AdminCompanyTable;
