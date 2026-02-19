import React from "react";
import {
  X,
  // Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Users,
  Briefcase,
  // Calendar,
  // Hash,
  // Tag,
  CheckCircle,
  XCircle,
  Clock,
  // Download,
  ExternalLink,
  User,
  Shield,
  // Award,
} from "lucide-react";
import type { Company } from "../types/company.types";

interface AdminCompanyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onApprove?: (company: Company) => void;
  onReject?: (company: Company) => void;
}

const AdminCompanyDetailsModal: React.FC<AdminCompanyDetailsModalProps> = ({
  isOpen,
  onClose,
  company,
  onApprove,
  onReject,
}) => {
  if (!isOpen || !company) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string = "pending") => {
    switch (status?.toLowerCase()) {
      case "approved":
        return (
          <span className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Pending Review
          </span>
        );
    }
  };

  const getBusinessTypeIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "sole proprietorship":
        return "👤";
      case "partnership":
        return "🤝";
      case "private limited company":
        return "🏢";
      case "public limited company":
        return "🏛️";
      default:
        return "🏢";
    }
  };

  const isPending = company.licenseStatus?.toLowerCase() === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl mx-4 bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-[#0F0F0F] z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-2xl font-bold text-black">
              {(company.name || company.companyName || "C").charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {company.name || company.companyName}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                {getStatusBadge(company.licenseStatus)}
                <span className="text-sm text-gray-400">
                  ID: {company._id.slice(-8)}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Registration</p>
              <p className="text-lg font-bold text-white truncate">
                {company.registrationNumber}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">TIN Number</p>
              <p className="text-lg font-bold text-white truncate">
                {company.tinNumber}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Business Type</p>
              <p className="text-lg font-bold text-white">
                {getBusinessTypeIcon(company.businessType)}{" "}
                {company.businessType}
              </p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Industry</p>
              <p className="text-lg font-bold text-white">
                {company.industry || company.sector || "N/A"}
              </p>
            </div>
          </div>

          {/* Company Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white">{company.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-white">
                      {company.phone || company.phoneNumber || "N/A"}
                    </p>
                  </div>
                </div>
                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Website</p>
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-yellow-400 hover:underline flex items-center gap-1"
                      >
                        {company.website}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-400" />
                Business Address
              </h3>
              <div className="space-y-4">
                {company.address?.street && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Street</p>
                      <p className="text-sm text-white">
                        {company.address.street}
                      </p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm text-white">
                      {company.address?.city || "N/A"}
                    </p>
                  </div>
                  {company.address?.state && (
                    <div>
                      <p className="text-xs text-gray-500">State</p>
                      <p className="text-sm text-white">
                        {company.address.state}
                      </p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Postal Code</p>
                    <p className="text-sm text-white">
                      {company.address?.postalCode || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm text-white">
                      {company.address?.country || "Ethiopia"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Details */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-yellow-400" />
                Business Details
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500">Industry</p>
                  <p className="text-sm text-white">
                    {company.industry || company.sector || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Registration Number</p>
                  <p className="text-sm text-white font-mono">
                    {company.registrationNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">TIN Number</p>
                  <p className="text-sm text-white font-mono">
                    {company.tinNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Company Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">
                {company.description || "No description provided."}
              </p>
            </div>

            {/* Documents */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-2">
                    Registration Certificate
                  </p>
                  {company.documents?.registrationCertificate ? (
                    <a
                      href={company.documents.registrationCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Document
                    </a>
                  ) : (
                    <p className="text-xs text-red-400">Not uploaded</p>
                  )}
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-2">
                    TIN Certificate
                  </p>
                  {company.documents?.tinCertificate ? (
                    <a
                      href={company.documents.tinCertificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Document
                    </a>
                  ) : (
                    <p className="text-xs text-red-400">Not uploaded</p>
                  )}
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-sm font-medium text-white mb-2">
                    Business License
                  </p>
                  {company.documents?.businessLicense ? (
                    <a
                      href={company.documents.businessLicense}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-yellow-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View Document
                    </a>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Optional - Not provided
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Directors */}
            {company.directors && company.directors.length > 0 && (
              <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  Directors ({company.directors.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {company.directors.map((director, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                      <p className="font-medium text-white">
                        {director.fullName}
                      </p>
                      <p className="text-sm text-yellow-400">
                        {director.position}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-yellow-400" />
                Business Owner
              </h3>
              {typeof company.businessOwnerId === "object" ? (
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xl font-bold text-white">
                    {company.businessOwnerId.fullName?.charAt(0) || "U"}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {company.businessOwnerId.fullName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {company.businessOwnerId.email}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ID: {company.businessOwnerId._id}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">
                  Owner ID: {company.businessOwnerId}
                </p>
              )}
            </div>

            {/* Timestamps */}
            <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    Registration Date
                  </p>
                  <p className="text-sm text-white">
                    {formatDate(company.registrationDate)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Created At</p>
                  <p className="text-sm text-white">
                    {formatDate(company.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                  <p className="text-sm text-white">
                    {formatDate(company.updatedAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            {company.verificationDate && (
              <div className="bg-gray-800/30 rounded-xl p-6 md:col-span-2">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Verification Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Verification Date
                    </p>
                    <p className="text-sm text-white">
                      {formatDate(company.verificationDate)}
                    </p>
                  </div>
                  {company.verificationNotes && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Verification Notes
                      </p>
                      <p className="text-sm text-white">
                        {company.verificationNotes}
                      </p>
                    </div>
                  )}
                  {company.verifiedBy &&
                    typeof company.verifiedBy === "object" && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Verified By
                        </p>
                        <p className="text-sm text-white">
                          {company.verifiedBy.fullName} (
                          {company.verifiedBy.email})
                        </p>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        {isPending && (onApprove || onReject) && (
          <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-800 bg-[#0A0A0A] rounded-b-2xl">
            {onReject && (
              <button
                onClick={() => {
                  onReject(company);
                  onClose();
                }}
                className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all flex items-center gap-2"
              >
                <XCircle className="w-5 h-5" />
                Reject Company
              </button>
            )}
            {onApprove && (
              <button
                onClick={() => {
                  onApprove(company);
                  onClose();
                }}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:from-yellow-500 hover:to-yellow-600 transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Company
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCompanyDetailsModal;
