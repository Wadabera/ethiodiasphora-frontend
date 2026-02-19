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
  Send,
  MessageSquare,
  Users,
  Briefcase,
} from "lucide-react";
import api from "@/services/api";
import type { KYCResponse } from "@/features/kyc/types/kyctypes";

export default function AdminKycPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<KYCResponse[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<KYCResponse[]>(
    [],
  );
  const [selectedSubmission, setSelectedSubmission] =
    useState<KYCResponse | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    level: "all",
    userType: "all",
    search: "",
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    investors: 0,
    businesses: 0,
  });

  // Fetch submissions on mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Filter submissions when filters change
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
          (sub) =>
            sub.userRole === "investor" ||
            sub.userId?.role === "diaspora_investor" ||
            (sub.userId?.role && sub.userId.role.includes("investor")),
        );
      } else if (filters.userType === "business") {
        filtered = filtered.filter(
          (sub) =>
            sub.userRole === "business_owner" ||
            sub.userId?.role === "local_business" ||
            (sub.userId?.role && sub.userId.role.includes("business")),
        );
      }
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (sub) =>
          sub.fullName.toLowerCase().includes(searchLower) ||
          (sub.userId?.email || "").toLowerCase().includes(searchLower) ||
          sub.nationality.toLowerCase().includes(searchLower) ||
          sub.address.toLowerCase().includes(searchLower) ||
          (sub.userId?.phoneNumber || "").toLowerCase().includes(searchLower),
      );
    }

    setFilteredSubmissions(filtered);
  }, [submissions, filters]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching KYC submissions...");
      const response = await api.get("/api/v1/kyc/admin/all");
      console.log("API Response:", response.data);

      // Extract kycs array from response
      const submissionsData = response.data.kycs || [];
      console.log("Found submissions:", submissionsData.length);

      setSubmissions(submissionsData);
      setFilteredSubmissions(submissionsData);

      // Calculate statistics
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
        (s) =>
          s.userRole === "investor" || s.userId?.role === "diaspora_investor",
      ).length;
      const businesses = submissionsData.filter(
        (s) =>
          s.userRole === "business_owner" ||
          s.userId?.role === "local_business",
      ).length;

      setStats({
        total,
        pending,
        approved,
        rejected,
        investors,
        businesses,
      });
    } catch (err: any) {
      console.error("Error fetching KYC:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });
      setError(
        err.response?.data?.message || "Failed to fetch KYC submissions",
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get user role display
  const getUserRoleDisplay = (submission: KYCResponse) => {
    if (submission.userRole) {
      return submission.userRole === "investor" ? "Investor" : "Business Owner";
    }

    if (!submission.userId) return "Unknown";
    switch (submission.userId.role) {
      case "diaspora_investor":
        return "Investor";
      case "local_business":
        return "Business Owner";
      case "admin":
        return "Admin";
      default:
        return submission.userId.role || "Unknown";
    }
  };

  // Handle Approve KYC - Send notifications to both investor and diaspora
  const handleApprove = async (kycId: string) => {
    if (!reviewNotes.trim()) {
      alert("Please add review notes before approving");
      return;
    }

    try {
      setActionLoading(kycId);

      console.log("Approving KYC:", kycId);
      await api.put(`/api/v1/kyc/admin/${kycId}/approve`, {
        notes: reviewNotes,
        sendNotifications: true, // Automatically send notifications
      });

      // Update local state - change status to approved (green)
      updateSubmissionStatus(kycId, "approved", reviewNotes);

      setReviewNotes("");
      alert(
        "KYC approved successfully! Notifications sent to both user and diaspora.",
      );

      setTimeout(() => fetchSubmissions(), 1000);
    } catch (err: any) {
      console.error("Approve error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to approve KYC");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Reject KYC - Send notifications to both user and business

  const handleReject = async (kycId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }

    try {
      setActionLoading(kycId);

      console.log("Rejecting KYC:", kycId);
      // Make sure to use PUT method
      const response = await api.put(`/api/v1/kyc/admin/${kycId}/reject`, {
        reason: rejectionReason,
        notes: rejectionReason,
        sendNotifications: true,
      });

      console.log("Reject response:", response.data);

      // Update local state - change status to rejected (red)
      updateSubmissionStatus(
        kycId,
        "rejected",
        rejectionReason,
        rejectionReason,
      );

      setRejectionReason("");
      alert("KYC rejected! Notifications sent to both user and business.");

      // Refresh data after a delay
      setTimeout(() => fetchSubmissions(), 1000);
    } catch (err: any) {
      console.error("Reject error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config, // This will show the request method
      });

      // Check if it's a method issue
      if (err.response?.status === 405 || err.message.includes("GET")) {
        setError("Method not allowed. Please use PUT request.");
      } else {
        setError(err.response?.data?.message || "Failed to reject KYC");
      }
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Send to Review - Change status to under_review (yellow)
  const handleSendToReview = async (kycId: string) => {
    try {
      setActionLoading(kycId);

      await api.put(`/api/v1/kyc/admin/${kycId}/review`, {
        notes: "Submitted for detailed review",
      });

      // Update local state - change status to under_review (yellow)
      updateSubmissionStatus(
        kycId,
        "under_review",
        "Submitted for detailed review",
      );

      alert("KYC sent for review");
    } catch (err: any) {
      console.error("Review error:", err.response?.data);
      setError(err.response?.data?.message || "Failed to send for review");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Request More Info
  const handleRequestMoreInfo = async (kycId: string, message: string) => {
    try {
      setActionLoading(kycId);

      await api.put(`/api/v1/kyc/admin/${kycId}/request-info`, {
        message,
        sendNotifications: true,
      });

      updateSubmissionStatus(kycId, "requires_update", message);
      alert("Additional information requested! Notification sent to user.");

      setTimeout(() => fetchSubmissions(), 1000);
    } catch (err: any) {
      console.error("Request info error:", err.response?.data);
      setError(
        err.response?.data?.message || "Failed to request more information",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Helper function to update submission status
  const updateSubmissionStatus = (
    kycId: string,
    status: string,
    notes?: string,
    rejectionReason?: string,
  ) => {
    const updateObj = {
      status,
      reviewNotes: notes,
      rejectionReason,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSubmissions((prev) =>
      prev.map((sub) => (sub._id === kycId ? { ...sub, ...updateObj } : sub)),
    );
    setFilteredSubmissions((prev) =>
      prev.map((sub) => (sub._id === kycId ? { ...sub, ...updateObj } : sub)),
    );

    if (selectedSubmission?._id === kycId) {
      setSelectedSubmission((prev) =>
        prev ? { ...prev, ...updateObj } : null,
      );
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center";

    // Status color mapping
    const statusConfig = {
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

    const config = statusConfig[status as keyof typeof statusConfig] || {
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

  // Helper function to get level badge
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

  // Helper function to get user type badge
  const getUserTypeBadge = (submission: KYCResponse) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const userType = getUserRoleDisplay(submission);

    if (userType === "Investor") {
      return (
        <span
          className={`${baseClasses} bg-blue-500/20 text-blue-400 flex items-center`}
        >
          <Users className="w-3 h-3 mr-1" />
          Investor
        </span>
      );
    } else if (userType === "Business Owner") {
      return (
        <span
          className={`${baseClasses} bg-green-500/20 text-green-400 flex items-center`}
        >
          <Briefcase className="w-3 h-3 mr-1" />
          Business
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-gray-500/20 text-gray-400`}>
          {userType}
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              KYC Management Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Review and manage KYC submissions from investors and business
              owners
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchSubmissions}
              className="px-4 py-2 bg-gradient-to-r from-gray-800 to-black border border-gray-700 rounded-lg text-gray-300 hover:text-white hover:border-gray-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <div className="text-sm text-gray-400">
              <Shield className="inline w-4 h-4 mr-1" />
              Admin Panel
            </div>
          </div>
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
            <div className="text-sm text-gray-400">Total Submissions</div>
          </div>
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-400">Pending Review</div>
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
            <div className="text-sm text-gray-400">Business Owners</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Submissions List (Left 3/4) */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-3.5 text-gray-500"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Search by name, email, phone, or address..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          search: e.target.value,
                        }))
                      }
                      className="w-full bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="requires_update">Needs Update</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Level
                  </label>
                  <select
                    value={filters.level}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, level: e.target.value }))
                    }
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
                  >
                    <option value="all">All Levels</option>
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* User Type Filter */}
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    User Type
                  </label>
                  <select
                    value={filters.userType}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        userType: e.target.value,
                      }))
                    }
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent"
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
                  {submissions.length > 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Try changing filters to see more submissions
                    </p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-800">
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">
                          User Info
                        </th>
                        <th className="text-left py-4 px-6 text-gray-400 font-medium">
                          User Type
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
                                {submission.fullName ||
                                  submission.id?.email ||
                                  "Unknown User"}
                              </div>
                              <div className="text-sm text-gray-400">
                                {submission.id?.email || "No email"}
                              </div>
                              {submission.id?.phoneNumber && (
                                <div className="text-xs text-gray-500 mt-1">
                                  <Phone className="inline w-3 h-3 mr-1" />
                                  {submission.id.phoneNumber}
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
                              {new Date(
                                submission.createdAt,
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(
                                submission.createdAt,
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  setSelectedSubmission(submission)
                                }
                                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-gray-300" />
                              </button>

                              {/* Review Button for pending submissions */}
                              {submission.status === "pending" && (
                                <button
                                  onClick={() =>
                                    handleSendToReview(submission._id)
                                  }
                                  disabled={actionLoading === submission._id}
                                  className="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 rounded-lg transition-colors disabled:opacity-50"
                                  title="Send to Review"
                                >
                                  <MessageSquare className="w-4 h-4 text-yellow-400" />
                                </button>
                              )}

                              {/* Approve/Reject for under review */}
                              {(submission.status === "under_review" ||
                                submission.status === "pending") && (
                                <>
                                  <button
                                    onClick={() => {
                                      const notes = prompt(
                                        "Enter approval notes:",
                                      );
                                      if (notes) {
                                        setReviewNotes(notes);
                                        setTimeout(
                                          () => handleApprove(submission._id),
                                          100,
                                        );
                                      }
                                    }}
                                    disabled={actionLoading === submission._id}
                                    className="p-2 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors disabled:opacity-50"
                                    title="Approve"
                                  >
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      const reason = prompt(
                                        "Enter rejection reason:",
                                      );
                                      if (reason) {
                                        setRejectionReason(reason);
                                        setTimeout(
                                          () => handleReject(submission._id),
                                          100,
                                        );
                                      }
                                    }}
                                    disabled={actionLoading === submission._id}
                                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50"
                                    title="Reject"
                                  >
                                    <XCircle className="w-4 h-4 text-red-400" />
                                  </button>
                                </>
                              )}

                              {/* Request Info for all except approved/rejected */}
                              {submission.status !== "approved" &&
                                submission.status !== "rejected" && (
                                  <button
                                    onClick={() => {
                                      const message = prompt(
                                        "Enter message requesting more information:",
                                      );
                                      if (message) {
                                        handleRequestMoreInfo(
                                          submission._id,
                                          message,
                                        );
                                      }
                                    }}
                                    disabled={actionLoading === submission._id}
                                    className="p-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg transition-colors disabled:opacity-50"
                                    title="Request More Info"
                                  >
                                    <AlertCircle className="w-4 h-4 text-orange-400" />
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Details Panel (Right 1/4) */}
          <div className="lg:col-span-1">
            <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">
                Submission Details
              </h2>

              {selectedSubmission ? (
                <div className="space-y-6">
                  {/* User Info */}
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-gray-700 rounded-lg mr-3">
                        <User className="w-5 h-5 text-[#FFD700]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white">
                          {selectedSubmission.fullName ||
                            selectedSubmission.userId?.email ||
                            "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {selectedSubmission.userId?.email || "No email"}
                        </p>
                        <div className="mt-2">
                          {getUserTypeBadge(selectedSubmission)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      {selectedSubmission.userId?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.userId.email}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.userId?.phoneNumber && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.userId.phoneNumber}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* KYC Info */}
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                    <h4 className="font-medium text-white mb-3">
                      KYC Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        {getLevelBadge(selectedSubmission.level)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Status:</span>
                        {getStatusBadge(selectedSubmission.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted:</span>
                        <span className="text-white">
                          {new Date(
                            selectedSubmission.createdAt,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedSubmission.reviewedAt && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Reviewed:</span>
                          <span className="text-white">
                            {new Date(
                              selectedSubmission.reviewedAt,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Personal/Business Info */}
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                    <h4 className="font-medium text-white mb-3">
                      {getUserRoleDisplay(selectedSubmission) === "Investor"
                        ? "Personal"
                        : "Business"}{" "}
                      Information
                    </h4>
                    <div className="space-y-3 text-sm">
                      {selectedSubmission.fullName && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.fullName}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.dateOfBirth && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            DOB:{" "}
                            {new Date(
                              selectedSubmission.dateOfBirth,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.nationality && (
                        <div className="flex items-center">
                          <Globe className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.nationality}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.address && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.address}
                            {selectedSubmission.city &&
                              `, ${selectedSubmission.city}`}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.country && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            {selectedSubmission.country}
                          </span>
                        </div>
                      )}
                      {selectedSubmission.occupation && (
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-gray-300">
                            Occupation: {selectedSubmission.occupation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review History */}
                  {selectedSubmission.reviewNotes && (
                    <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                      <h4 className="font-medium text-white mb-3">
                        Review Notes
                      </h4>
                      <p className="text-sm text-gray-300">
                        {selectedSubmission.reviewNotes}
                      </p>
                      {selectedSubmission.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-500/10 rounded">
                          <p className="text-sm text-red-300">
                            <strong>Rejection Reason:</strong>{" "}
                            {selectedSubmission.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Panel */}
                  {(selectedSubmission.status === "pending" ||
                    selectedSubmission.status === "under_review") && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Review Notes
                        </label>
                        <textarea
                          value={reviewNotes}
                          onChange={(e) => setReviewNotes(e.target.value)}
                          placeholder="Add review notes..."
                          className="w-full h-32 bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleApprove(selectedSubmission._id)}
                          disabled={actionLoading === selectedSubmission._id}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          {actionLoading === selectedSubmission._id
                            ? "Processing..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt("Enter rejection reason:");
                            if (reason) {
                              setRejectionReason(reason);
                              setTimeout(
                                () => handleReject(selectedSubmission._id),
                                100,
                              );
                            }
                          }}
                          disabled={actionLoading === selectedSubmission._id}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          {actionLoading === selectedSubmission._id
                            ? "Processing..."
                            : "Reject"}
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          const message = prompt(
                            "Enter message requesting more information:",
                          );
                          if (message) {
                            handleRequestMoreInfo(
                              selectedSubmission._id,
                              message,
                            );
                          }
                        }}
                        disabled={actionLoading === selectedSubmission._id}
                        className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        Request More Info
                      </button>

                      {selectedSubmission.status === "pending" && (
                        <button
                          onClick={() =>
                            handleSendToReview(selectedSubmission._id)
                          }
                          disabled={actionLoading === selectedSubmission._id}
                          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium py-2.5 rounded-lg transition-all disabled:opacity-50"
                        >
                          Send to Review
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Select a submission to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
