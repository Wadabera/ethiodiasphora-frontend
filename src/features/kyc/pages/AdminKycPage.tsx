// src/features/kyc/pages/AdminKycPage.tsx
import React, { useState, useEffect } from "react";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Search,
  Eye,
  FileText,
  RefreshCw,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Calendar,
  MessageSquare,
  Users,
  Briefcase,
  Image as ImageIcon,
  X,
  Download,
  ZoomIn,
} from "lucide-react";
import api from "@/services/api";
import type { KYCResponse, KYCUser } from "@/features/kyc/types/kycTypes";

// ============================================
// Helper function to safely get user properties
// ============================================
const getUserProperty = <T extends keyof KYCUser>(
  userId: string | KYCUser | undefined,
  property: T,
): KYCUser[T] | undefined => {
  if (!userId) return undefined;
  if (typeof userId === "object") {
    return userId[property];
  }
  return undefined;
};

const getUserEmail = (userId: string | KYCUser | undefined): string => {
  if (!userId) return "";
  if (typeof userId === "object") {
    return userId.email || "";
  }
  return "";
};

const getUserFullName = (userId: string | KYCUser | undefined): string => {
  if (!userId) return "";
  if (typeof userId === "object") {
    return userId.fullName || "";
  }
  return "";
};

const getUserPhone = (userId: string | KYCUser | undefined): string => {
  if (!userId) return "";
  if (typeof userId === "object") {
    return userId.phoneNumber || "";
  }
  return "";
};

const getUserRole = (userId: string | KYCUser | undefined): string => {
  if (!userId) return "";
  if (typeof userId === "object") {
    return userId.role || "";
  }
  return "";
};

// ============================================
// Image Modal Component
// ============================================
interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageTitle: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageTitle,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors z-10"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="relative max-w-5xl max-h-[90vh] overflow-auto">
        <img
          src={imageUrl}
          alt={imageTitle}
          className="transition-transform duration-200"
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: "center",
          }}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-lg p-3 flex items-center gap-4">
        <span className="text-white text-sm font-medium px-2">
          {imageTitle}
        </span>
        <div className="w-px h-6 bg-gray-700" />
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <span className="text-white text-lg font-bold">−</span>
        </button>
        <span className="text-white text-sm min-w-[45px] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          title="Zoom In"
        >
          <span className="text-white text-lg font-bold">+</span>
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          title="Reset Zoom"
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </button>
        <div className="w-px h-6 bg-gray-700" />
        <a
          href={imageUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
          title="Download Image"
        >
          <Download className="w-4 h-4 text-white" />
        </a>
      </div>
    </div>
  );
};

// ============================================
// Document Grid Component
// ============================================
interface DocumentGridProps {
  submission: KYCResponse;
  onImageClick: (url: string, title: string) => void;
}

const DocumentGrid: React.FC<DocumentGridProps> = ({
  submission,
  onImageClick,
}) => {
  const documents = [
    ...(submission.idDocumentFrontImage
      ? [
          {
            url: submission.idDocumentFrontImage,
            title: "ID Document - Front",
            type: "id_front",
          },
        ]
      : []),
    ...(submission.idDocumentBackImage
      ? [
          {
            url: submission.idDocumentBackImage,
            title: "ID Document - Back",
            type: "id_back",
          },
        ]
      : []),
    ...(submission.selfieImage
      ? [
          {
            url: submission.selfieImage,
            title: "Selfie with Document",
            type: "selfie",
          },
        ]
      : []),
    ...(submission.bankStatement
      ? [
          {
            url: submission.bankStatement,
            title: "Bank Statement",
            type: "bank",
          },
        ]
      : []),
    ...(submission.proofOfAddress
      ? [
          {
            url: submission.proofOfAddress,
            title: "Proof of Address",
            type: "address",
          },
        ]
      : []),
    ...(submission.employmentLetter
      ? [
          {
            url: submission.employmentLetter,
            title: "Employment Letter",
            type: "employment",
          },
        ]
      : []),
  ];

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-800/30 rounded-xl">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No documents uploaded</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {documents.map((doc, index) => (
        <button
          key={index}
          onClick={() => onImageClick(doc.url, doc.title)}
          className="group relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-[#FFD700] transition-all hover:shadow-lg hover:shadow-[#FFD700]/10"
        >
          <img
            src={doc.url}
            alt={doc.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
            <span className="text-xs text-white font-medium truncate">
              {doc.title}
            </span>
          </div>
          <div className="absolute top-1 right-1 bg-black/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3 h-3 text-white" />
          </div>
        </button>
      ))}
    </div>
  );
};

// ============================================
// Submission Details Modal Component
// ============================================
interface SubmissionDetailsModalProps {
  submission: KYCResponse | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestInfo: (id: string, message: string) => void;
  onSendToReview: (id: string) => void;
  actionLoading: string | null;
  onImageClick: (url: string, title: string) => void;
}

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  submission,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onRequestInfo,
  onSendToReview,
  actionLoading,
  onImageClick,
}) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [activeTab, setActiveTab] = useState<
    "details" | "documents" | "actions"
  >("details");

  if (!isOpen || !submission) return null;

  // Helper functions for badges
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center";
    const statusConfig: Record<
      string,
      { bg: string; text: string; icon: any; label: string }
    > = {
      approved: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
      under_review: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: Clock,
        label: "Under Review",
      },
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      requires_update: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        icon: AlertCircle,
        label: "Needs Update",
      },
    };
    const config = statusConfig[status] || {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      icon: FileText,
      label: status,
    };
    const Icon = config.icon;
    return (
      <span className={`${baseClasses} ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case "basic":
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>
            Basic
          </span>
        );
      case "intermediate":
        return (
          <span className={`${baseClasses} bg-purple-500/20 text-purple-400`}>
            Intermediate
          </span>
        );
      case "advanced":
        return (
          <span className={`${baseClasses} bg-[#FFD700]/20 text-[#FFD700]`}>
            Advanced
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
            {level}
          </span>
        );
    }
  };

  const getUserTypeBadge = () => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center";
    const role = getUserRole(submission.userId);
    if (role === "diaspora_investor") {
      return (
        <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>
          <Users className="w-3 h-3 mr-1" />
          Investor
        </span>
      );
    } else if (role === "local_business") {
      return (
        <span className={`${baseClasses} bg-green-500/20 text-green-400`}>
          <Briefcase className="w-3 h-3 mr-1" />
          Business
        </span>
      );
    }
    return (
      <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
        Unknown
      </span>
    );
  };

  const handleApprove = () => {
    if (reviewNotes.trim()) {
      onApprove(submission._id, reviewNotes);
      setReviewNotes("");
      onClose();
    }
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(submission._id, rejectionReason);
      setRejectionReason("");
      onClose();
    }
  };

  const handleRequestInfo = () => {
    if (requestMessage.trim()) {
      onRequestInfo(submission._id, requestMessage);
      setRequestMessage("");
      onClose();
    }
  };

  const handleSendToReview = () => {
    onSendToReview(submission._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#1A1A1A] border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-800 rounded-lg">
              <User className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                KYC Submission Details
              </h2>
              <p className="text-sm text-gray-400">
                Review and manage KYC application
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "details"
                ? "bg-[#FFD700]/20 text-[#FFD700]"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            User Details
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "documents"
                ? "bg-[#FFD700]/20 text-[#FFD700]"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === "actions"
                ? "bg-[#FFD700]/20 text-[#FFD700]"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            Actions
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* User Info Card */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-[#FFD700]" />
                  User Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Full Name</p>
                    <p className="text-white font-medium">
                      {submission.fullName ||
                        getUserFullName(submission.userId) ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Email</p>
                    <p className="text-white font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-[#FFD700]" />
                      {getUserEmail(submission.userId) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Phone</p>
                    <p className="text-white font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-[#FFD700]" />
                      {getUserPhone(submission.userId) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">User Type</p>
                    <div>{getUserTypeBadge()}</div>
                  </div>
                </div>
              </div>

              {/* KYC Info Card */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-[#FFD700]" />
                  KYC Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Level</p>
                    <div>{getLevelBadge(submission.level)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Status</p>
                    <div>{getStatusBadge(submission.status)}</div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Submitted</p>
                    <p className="text-white">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {submission.reviewedAt && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Reviewed</p>
                      <p className="text-white">
                        {new Date(submission.reviewedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal/Business Info Card */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-[#FFD700]" />
                  {getUserRole(submission.userId) === "diaspora_investor"
                    ? "Personal"
                    : "Business"}{" "}
                  Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {submission.fullName && (
                    <>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Full Name</p>
                        <p className="text-white">{submission.fullName}</p>
                      </div>
                      {submission.dateOfBirth && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">
                            Date of Birth
                          </p>
                          <p className="text-white">
                            {new Date(
                              submission.dateOfBirth,
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                  {submission.nationality && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Nationality</p>
                      <p className="text-white">{submission.nationality}</p>
                    </div>
                  )}
                  {submission.address && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-400 mb-1">Address</p>
                      <p className="text-white">
                        {submission.address}
                        {submission.city && `, ${submission.city}`}
                        {submission.country && `, ${submission.country}`}
                        {submission.postalCode && ` - ${submission.postalCode}`}
                      </p>
                    </div>
                  )}
                  {submission.occupation && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Occupation</p>
                      <p className="text-white">{submission.occupation}</p>
                    </div>
                  )}
                  {submission.annualIncome && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Annual Income
                      </p>
                      <p className="text-white">
                        ${submission.annualIncome.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {submission.sourceOfFunds && (
                    <div className="col-span-2">
                      <p className="text-sm text-gray-400 mb-1">
                        Source of Funds
                      </p>
                      <p className="text-white capitalize">
                        {submission.sourceOfFunds.replace("_", " ")}
                      </p>
                    </div>
                  )}
                  {submission.bankName && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Bank Name</p>
                      <p className="text-white">{submission.bankName}</p>
                    </div>
                  )}
                  {submission.bankAccountNumber && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Account Number
                      </p>
                      <p className="text-white">
                        ****{submission.bankAccountNumber.slice(-4)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Notes Card */}
              {(submission.reviewNotes || submission.rejectionReason) && (
                <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-[#FFD700]" />
                    Review Information
                  </h3>
                  {submission.reviewNotes && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-400 mb-1">Review Notes</p>
                      <p className="text-white bg-gray-900/50 p-3 rounded-lg">
                        {submission.reviewNotes}
                      </p>
                    </div>
                  )}
                  {submission.rejectionReason && (
                    <div>
                      <p className="text-sm text-gray-400 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-red-400 bg-red-500/10 p-3 rounded-lg">
                        {submission.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <DocumentGrid
                submission={submission}
                onImageClick={onImageClick}
              />
            </div>
          )}

          {activeTab === "actions" && (
            <div className="space-y-6">
              {/* Review Notes Input */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Review Notes
                </h3>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add review notes for approval..."
                  className="w-full h-32 bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Rejection Reason Input */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Rejection Reason
                </h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  className="w-full h-32 bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Request Info Input */}
              <div className="bg-gradient-to-r from-gray-800 to-black rounded-xl p-5">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Request Information
                </h3>
                <textarea
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  placeholder="Enter message requesting more information..."
                  className="w-full h-32 bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleApprove}
                  disabled={
                    actionLoading === submission._id || !reviewNotes.trim()
                  }
                  className="col-span-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === submission._id
                    ? "Processing..."
                    : "Approve with Notes"}
                </button>

                <button
                  onClick={handleReject}
                  disabled={
                    actionLoading === submission._id || !rejectionReason.trim()
                  }
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>

                <button
                  onClick={handleRequestInfo}
                  disabled={
                    actionLoading === submission._id || !requestMessage.trim()
                  }
                  className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Request Info
                </button>

                {submission.status === "pending" && (
                  <button
                    onClick={handleSendToReview}
                    disabled={actionLoading === submission._id}
                    className="col-span-2 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                  >
                    Send to Review
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// Main AdminKycPage Component
// ============================================
export default function AdminKycPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<KYCResponse[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<KYCResponse[]>(
    [],
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<KYCResponse | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    level: "all",
    userType: "all",
    search: "",
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Image modal state
  const [imageModal, setImageModal] = useState<{
    isOpen: boolean;
    imageUrl: string;
    imageTitle: string;
  }>({
    isOpen: false,
    imageUrl: "",
    imageTitle: "",
  });

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    investors: 0,
    businesses: 0,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    let filtered = submissions;

    if (filters.status !== "all") {
      filtered = filtered.filter((sub) => sub.status === filters.status);
    }

    if (filters.level !== "all") {
      filtered = filtered.filter((sub) => sub.level === filters.level);
    }

    if (filters.userType !== "all") {
      if (filters.userType === "investor") {
        filtered = filtered.filter(
          (sub) => getUserRole(sub.userId) === "diaspora_investor",
        );
      } else if (filters.userType === "business") {
        filtered = filtered.filter(
          (sub) => getUserRole(sub.userId) === "local_business",
        );
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.fullName?.toLowerCase().includes(searchLower) ||
          getUserEmail(sub.userId).toLowerCase().includes(searchLower) ||
          getUserPhone(sub.userId).toLowerCase().includes(searchLower) ||
          sub.nationality?.toLowerCase().includes(searchLower) ||
          sub.address?.toLowerCase().includes(searchLower),
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/v1/kyc/admin/all");
      const submissionsData = response.data.kycs || [];

      setSubmissions(submissionsData);
      setFilteredSubmissions(submissionsData);

      const total = submissionsData.length;
      const pending = submissionsData.filter(
        (s) => s.status === "pending" || s.status === "under_review",
      ).length;
      const approved = submissionsData.filter(
        (s) => s.status === "approved",
      ).length;
      const rejected = submissionsData.filter(
        (s) => s.status === "rejected",
      ).length;
      const investors = submissionsData.filter(
        (s) => getUserRole(s.userId) === "diaspora_investor",
      ).length;
      const businesses = submissionsData.filter(
        (s) => getUserRole(s.userId) === "local_business",
      ).length;

      setStats({ total, pending, approved, rejected, investors, businesses });
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch KYC submissions",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (kycId: string, notes: string) => {
    try {
      setActionLoading(kycId);
      await api.put(`/api/v1/kyc/admin/${kycId}/approve`, {
        notes,
        sendNotifications: true,
      });
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve KYC");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (kycId: string, reason: string) => {
    try {
      setActionLoading(kycId);
      await api.put(`/api/v1/kyc/admin/${kycId}/reject`, {
        reason,
        notes: reason,
        sendNotifications: true,
      });
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reject KYC");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRequestMoreInfo = async (kycId: string, message: string) => {
    try {
      setActionLoading(kycId);
      await api.put(`/api/v1/kyc/admin/${kycId}/request-info`, {
        message,
        sendNotifications: true,
      });
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to request information");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSendToReview = async (kycId: string) => {
    try {
      setActionLoading(kycId);
      await api.put(`/api/v1/kyc/admin/${kycId}/review`, {
        notes: "Submitted for detailed review",
      });
      await fetchSubmissions();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send for review");
    } finally {
      setActionLoading(null);
    }
  };

  const handleImageClick = (url: string, title: string) => {
    setImageModal({ isOpen: true, imageUrl: url, imageTitle: title });
  };

  const handleViewDetails = (submission: KYCResponse) => {
    setSelectedSubmission(submission);
    setIsDetailsModalOpen(true);
  };

  const getUserDisplayName = (submission: KYCResponse): string => {
    return (
      submission.fullName ||
      getUserFullName(submission.userId) ||
      "Unknown User"
    );
  };

  const getUserEmailDisplay = (submission: KYCResponse): string => {
    return getUserEmail(submission.userId) || "No email";
  };

  const getUserPhoneDisplay = (submission: KYCResponse): string => {
    return getUserPhone(submission.userId) || "";
  };

  // Badge helpers
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center";
    const statusConfig: Record<
      string,
      { bg: string; text: string; icon: any; label: string }
    > = {
      approved: {
        bg: "bg-green-500/20",
        text: "text-green-400",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-500/20",
        text: "text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
      under_review: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: Clock,
        label: "Under Review",
      },
      pending: {
        bg: "bg-yellow-500/20",
        text: "text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      requires_update: {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        icon: AlertCircle,
        label: "Needs Update",
      },
    };
    const config = statusConfig[status] || {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      icon: FileText,
      label: status,
    };
    const Icon = config.icon;
    return (
      <span className={`${baseClasses} ${config.bg} ${config.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getLevelBadge = (level: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (level) {
      case "basic":
        return (
          <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>
            Basic
          </span>
        );
      case "intermediate":
        return (
          <span className={`${baseClasses} bg-purple-500/20 text-purple-400`}>
            Intermediate
          </span>
        );
      case "advanced":
        return (
          <span className={`${baseClasses} bg-[#FFD700]/20 text-[#FFD700]`}>
            Advanced
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
            {level}
          </span>
        );
    }
  };

  const getUserTypeBadge = (submission: KYCResponse) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center";
    const role = getUserRole(submission.userId);
    if (role === "diaspora_investor") {
      return (
        <span className={`${baseClasses} bg-blue-500/20 text-blue-400`}>
          <Users className="w-3 h-3 mr-1" />
          Investor
        </span>
      );
    } else if (role === "local_business") {
      return (
        <span className={`${baseClasses} bg-green-500/20 text-green-400`}>
          <Briefcase className="w-3 h-3 mr-1" />
          Business
        </span>
      );
    }
    return (
      <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
        Unknown
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      {/* Image Modal */}
      <ImageModal
        isOpen={imageModal.isOpen}
        imageUrl={imageModal.imageUrl}
        imageTitle={imageModal.imageTitle}
        onClose={() =>
          setImageModal({ isOpen: false, imageUrl: "", imageTitle: "" })
        }
      />

      {/* Submission Details Modal */}
      <SubmissionDetailsModal
        submission={selectedSubmission}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedSubmission(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        onRequestInfo={handleRequestMoreInfo}
        onSendToReview={handleSendToReview}
        actionLoading={actionLoading}
        onImageClick={handleImageClick}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              KYC Management Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Review and manage KYC submissions
            </p>
          </div>
          <button
            onClick={fetchSubmissions}
            className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-white mb-1">
              {stats.total}
            </div>
            <div className="text-sm text-gray-400">Total</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-400">Approved</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {stats.rejected}
            </div>
            <div className="text-sm text-gray-400">Rejected</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {stats.investors}
            </div>
            <div className="text-sm text-gray-400">Investors</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.businesses}
            </div>
            <div className="text-sm text-gray-400">Business</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-3.5 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, phone..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="requires_update">Needs Update</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <select
                value={filters.level}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, level: e.target.value }))
                }
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <select
                value={filters.userType}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, userType: e.target.value }))
                }
                className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
              >
                <option value="all">All Users</option>
                <option value="investor">Investors</option>
                <option value="business">Business Owners</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#FFD700] border-t-transparent"></div>
              <p className="text-gray-400 mt-4">Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      User
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Type
                    </th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium">
                      Level
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
                  {filteredSubmissions.map((submission) => (
                    <tr
                      key={submission._id}
                      className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div>
                          <div className="font-medium text-white">
                            {getUserDisplayName(submission)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {getUserEmailDisplay(submission)}
                          </div>
                          {getUserPhoneDisplay(submission) && (
                            <div className="text-xs text-gray-500 mt-1">
                              <Phone className="inline w-3 h-3 mr-1" />
                              {getUserPhoneDisplay(submission)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {getUserTypeBadge(submission)}
                      </td>
                      <td className="py-4 px-6">
                        {getLevelBadge(submission.level)}
                      </td>
                      <td className="py-4 px-6">
                        {getStatusBadge(submission.status)}
                      </td>
                      <td className="py-4 px-6 text-gray-400">
                        <div>
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-300" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
