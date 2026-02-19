import React, { useState } from "react";
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Users,
  Briefcase,
  Calendar,
  Hash,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  User,
  Shield,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  UserMinus,
  AlertTriangle,
  MessageSquare,
  Send,
} from "lucide-react";
import type { Company } from "../types/company.types";

interface AdminCompanySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onApprove: (id: string, notes?: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
  onSuspend: (id: string, reason: string) => Promise<void>;
  actionLoading: string | null;
}

const AdminCompanySidebar: React.FC<AdminCompanySidebarProps> = ({
  isOpen,
  onClose,
  company,
  onApprove,
  onReject,
  onSuspend,
  actionLoading,
}) => {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [showSuspendForm, setShowSuspendForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [suspendReason, setSuspendReason] = useState("");
  const [approveNotes, setApproveNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !company) return null;

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
      case "suspended":
        return (
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-sm font-medium flex items-center gap-1.5">
            <UserMinus className="w-4 h-4" />
            Suspended
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

  const isPending = company.licenseStatus?.toLowerCase() === "pending";
  const isApproved = company.licenseStatus?.toLowerCase() === "approved";
  const isRejected = company.licenseStatus?.toLowerCase() === "rejected";
  const isSuspended = company.licenseStatus?.toLowerCase() === "suspended";
  const isLoading = actionLoading === company._id || isSubmitting;

  // Get status datetime
  const getStatusDateTime = () => {
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

  const statusDateTime = getStatusDateTime();

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(company._id, approveNotes || "Approved by admin");
      setApproveNotes("");
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    setIsSubmitting(true);
    try {
      await onReject(company._id, rejectReason);
      setRejectReason("");
      setShowRejectForm(false);
    } catch (error) {
      console.error("Rejection failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      alert("Please provide a suspension reason");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSuspend(company._id, suspendReason);
      setSuspendReason("");
      setShowSuspendForm(false);
    } catch (error) {
      console.error("Suspension failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0F0F0F] border-l border-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-800 bg-[#0F0F0F] z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center text-2xl font-bold text-black">
              {(company.name || company.companyName || "C").charAt(0).toUpperCase()}
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

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-180px)] overflow-y-auto p-6">
          {/* Status Timestamp - Like your image */}
          {statusDateTime && (
            <div className="mb-6 p-4 bg-gray-800/30 rounded-xl border border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isApproved && <CheckCircle className="w-5 h-5 text-green-400" />}
                  {isRejected && <XCircle className="w-5 h-5 text-red-400" />}
                  {isSuspended && <UserMinus className="w-5 h-5 text-purple-400" />}
                  {isPending && <Clock className="w-5 h-5 text-yellow-400" />}
                  <span className="text-white font-medium">
                    {isApproved && "Approved"}
                    {isRejected && "Rejected"}
                    {isSuspended && "Suspended"}
                    {isPending && "Under Review"}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-white">{statusDateTime.date}</div>
                  <div className="text-sm text-gray-400">{statusDateTime.time}</div>
                </div>
              </div>
              {((isRejected && company.rejectedReason) || (isSuspended && company.suspendedReason)) && (
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Reason:</p>
                      <p className="text-sm text-gray-300">
                        {isRejected ? company.rejectedReason : company.suspendedReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
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
          </div>

          {/* Company Information */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-yellow-400" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white">{company.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-white">{company.phone || company.phoneNumber || "N/A"}</p>
                  </div>
                </div>
                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <div className="flex-1">
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
                      <p className="text-sm text-white">{company.address.street}</p>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">City</p>
                    <p className="text-sm text-white">{company.address?.city || "N/A"}</p>
                  </div>
                  {company.address?.state && (
                    <div>
                      <p className="text-xs text-gray-500">State</p>
                      <p className="text-sm text-white">{company.address.state}</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Postal Code</p>
                    <p className="text-sm text-white">{company.address?.postalCode || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Country</p>
                    <p className="text-sm text-white">{company.address?.country || "Ethiopia"}</p>
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
                  <p className="text-sm text-white">{company.industry || company.sector || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Business Type</p>
                  <p className="text-sm text-white">{company.businessType}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-yellow-400" />
                Company Description
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap text-sm">
                {company.description || "No description provided."}
              </p>
            </div>

            {/* Directors */}
            {company.directors && company.directors.length > 0 && (
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  Directors ({company.directors.length})
                </h3>
                <div className="space-y-3">
                  {company.directors.map((director, index) => (
                    <div key={index} className="bg-gray-900/50 rounded-lg p-4">
                      <p className="font-medium text-white">{director.fullName}</p>
                      <p className="text-sm text-yellow-400">{director.position}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner Information */}
            <div className="bg-gray-800/30 rounded-xl p-6">
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
                    <p className="text-white font-medium">{company.businessOwnerId.fullName}</p>
                    <p className="text-sm text-gray-400">{company.businessOwnerId.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400">Owner ID: {company.businessOwnerId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="sticky bottom-0 border-t border-gray-800 bg-[#0A0A0A] p-6">
          {/* Reject Form */}
          {showRejectForm && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-red-400" />
                Rejection Reason
              </h4>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={isLoading || !rejectReason.trim()}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Submit Rejection
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Suspend Form */}
          {showSuspendForm && (
            <div className="mb-4 p-4 bg-purple-500/10 border border-purple-500/30 rounded-xl">
              <h4 className="text-md font-medium text-white mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Suspension Reason
              </h4>
              <textarea
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
                placeholder="Enter suspension reason..."
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
                disabled={isLoading}
              />
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => {
                    setShowSuspendForm(false);
                    setSuspendReason("");
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspend}
                  disabled={isLoading || !suspendReason.trim()}
                  className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg flex items-center gap-1 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="w-3 h-3" />
                      Submit Suspension
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {/* Pending Actions */}
            {isPending && !showRejectForm && !showSuspendForm && (
              <>
                <div className="mb-2">
                  <label className="block text-sm text-gray-400 mb-2">Approval Notes (Optional)</label>
                  <textarea
                    value={approveNotes}
                    onChange={(e) => setApproveNotes(e.target.value)}
                    placeholder="Add approval notes..."
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={2}
                    disabled={isLoading}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={isLoading}
                    className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <ThumbsDown className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isLoading}
                    className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        <ThumbsUp className="w-5 h-5" />
                        Approve
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Approved Actions */}
            {isApproved && !showSuspendForm && (
              <button
                onClick={() => setShowSuspendForm(true)}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <UserMinus className="w-5 h-5" />
                Suspend Company
              </button>
            )}

            {/* Already Processed Message */}
            {(isRejected || isSuspended) && (
              <div className="text-center py-4">
                <p className="text-gray-400">
                  {isRejected && "This company has been rejected"}
                  {isSuspended && "This company has been suspended"}
                </p>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminCompanySidebar;