import React from "react";
import type { Company } from "../types/company.types";
import {
  // Building2,
  Mail,
  // Phone,
  // MapPin,
  // Globe,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Hash,
  Tag,
  // Briefcase,
  // Users,
  // FileText,
  AlertTriangle,
  Shield,
} from "lucide-react";

interface AdminCompanyCardProps {
  company: Company;
  onApprove: (company: Company) => void;
  onReject: (company: Company) => void;
  onViewDetails: (company: Company) => void;
  actionLoading?: string | null;
}

const AdminCompanyCard: React.FC<AdminCompanyCardProps> = ({
  company,
  onApprove,
  onReject,
  onViewDetails,
  actionLoading,
}) => {
  const getStatusBadge = (status: string = "pending") => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-xs font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-xs font-medium flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPending = company.licenseStatus?.toLowerCase() === "pending";
  const isApproved = company.licenseStatus?.toLowerCase() === "approved";
  const isRejected = company.licenseStatus?.toLowerCase() === "rejected";
  const isLoading = actionLoading === company._id;

  return (
    <div
      className={`relative bg-[#0F0F0F] border rounded-xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl ${
        isApproved
          ? "border-green-500/30 bg-gradient-to-br from-green-500/5 to-transparent"
          : isRejected
            ? "border-red-500/30 bg-gradient-to-br from-red-500/5 to-transparent"
            : "border-gray-800 hover:border-gray-700"
      }`}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center backdrop-blur-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-t-transparent"></div>
        </div>
      )}

      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        {getStatusBadge(company.licenseStatus)}
      </div>

      {/* Header with Company Photo Placeholder */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold ${
            isApproved
              ? "bg-gradient-to-br from-green-500 to-green-600"
              : isRejected
                ? "bg-gradient-to-br from-red-500 to-red-600"
                : "bg-gradient-to-br from-yellow-400 to-yellow-500"
          } text-white`}
        >
          {(company.name || company.companyName || "C").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">
            {company.name || company.companyName}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Tag className="w-3.5 h-3.5" />
            <span>{company.businessType || "N/A"}</span>
            <span className="text-gray-600">•</span>
            <Hash className="w-3.5 h-3.5" />
            <span className="truncate max-w-[100px]">
              {company.registrationNumber}
            </span>
          </div>
        </div>
      </div>

      {/* Company Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">Industry</p>
          <p className="text-sm font-medium text-white truncate">
            {company.industry || company.sector || "N/A"}
          </p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">TIN</p>
          <p className="text-sm font-medium text-white truncate">
            {company.tinNumber || "N/A"}
          </p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300 truncate">{company.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-gray-300">
            Submitted:{" "}
            {formatDate(company.registrationDate || company.createdAt)}
          </span>
        </div>
      </div>

      {/* Rejection Reason - SHOW CARD WHEN REJECTED */}
      {isRejected && company.verificationNotes && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-red-400 mb-1">
                Rejection Reason:
              </p>
              <p className="text-xs text-red-300">
                {company.verificationNotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-800">
        <button
          onClick={() => onViewDetails(company)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>

        {isPending && (
          <>
            <button
              onClick={() => onApprove(company)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4" />
              Approve
            </button>
            <button
              onClick={() => onReject(company)}
              disabled={isLoading}
              className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
          </>
        )}

        {isApproved && (
          <div className="flex-1 px-3 py-2 bg-green-500/10 text-green-400 rounded-lg flex items-center justify-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            Verified
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyCard;
