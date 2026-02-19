// features/kyc/admin/pages/AdminKYCViewSubmission.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchKYCById, approveKYC, rejectKYC } from "../slices/kycAdminSlice";
import AdminKYCReviewModal from "../components/AdminKYCReviewModal";

const AdminKYCViewSubmission: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentSubmission, loading } = useSelector(
    (state: any) => state.kycAdmin,
  );
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject">("approve");

  useEffect(() => {
    if (id) {
      dispatch(fetchKYCById(id));
    }
  }, [id, dispatch]);

  const handleApprove = () => {
    setActionType("approve");
    setShowReviewModal(true);
  };

  const handleReject = () => {
    setActionType("reject");
    setShowReviewModal(true);
  };

  const handleModalSubmit = (notes: string) => {
    if (actionType === "approve") {
      dispatch(approveKYC({ kycId: id!, reviewNotes: notes }));
    } else {
      dispatch(rejectKYC({ kycId: id!, reviewNotes: notes }));
    }
    setShowReviewModal(false);
    navigate("/admin/kyc/pending");
  };

  if (loading) return <div>Loading KYC submission...</div>;
  if (!currentSubmission) return <div>KYC submission not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/kyc/pending")}
        className="mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Pending
      </button>

      <div className="bg-white shadow rounded-lg p-6">
        {/* User Info */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">
            {currentSubmission.fullName}
          </h1>
          <div className="flex gap-4 text-gray-600">
            <span>📧 {currentSubmission.userId.email}</span>
            <span>📱 {currentSubmission.userId.phoneNumber}</span>
            <span
              className={`px-3 py-1 rounded-full ${
                currentSubmission.userId.role === "diaspora_investor"
                  ? "bg-purple-100 text-purple-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {currentSubmission.userId.role}
            </span>
          </div>
        </div>

        {/* KYC Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Personal Information</h3>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {new Date(currentSubmission.dateOfBirth).toLocaleDateString()}
            </p>
            <p>
              <strong>Nationality:</strong> {currentSubmission.nationality}
            </p>
            <p>
              <strong>Occupation:</strong>{" "}
              {currentSubmission.occupation || "Not provided"}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Address</h3>
            <p>{currentSubmission.address}</p>
            <p>
              {currentSubmission.city}, {currentSubmission.country}
            </p>
            <p>
              <strong>Postal Code:</strong> {currentSubmission.postalCode}
            </p>
          </div>
        </div>

        {/* Status & Review History */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">KYC Status</h3>
          <div
            className={`inline-block px-4 py-2 rounded-full ${
              currentSubmission.status === "approved"
                ? "bg-green-100 text-green-800"
                : currentSubmission.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {currentSubmission.status.toUpperCase()}
          </div>

          {currentSubmission.reviewNotes && (
            <div className="mt-4 p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Review Notes:</h4>
              <p>{currentSubmission.reviewNotes}</p>
              {currentSubmission.reviewedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  Reviewed on:{" "}
                  {new Date(currentSubmission.reviewedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons (if pending) */}
        {currentSubmission.status === "under_review" && (
          <div className="flex gap-4">
            <button
              onClick={handleApprove}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              ✅ Approve KYC
            </button>
            <button
              onClick={handleReject}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              ❌ Reject KYC
            </button>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AdminKYCReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleModalSubmit}
        actionType={actionType}
      />
    </div>
  );
};
