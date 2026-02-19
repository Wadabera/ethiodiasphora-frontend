// BusinessOwnerFeatures/kyc/components/BusinessKYCStatus.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import type{ KYCStatusResponse } from "@/components/shared/types/types";

interface BusinessKYCStatusProps {
  kycData: KYCStatusResponse | null;
  loading?: boolean;
}

const BusinessKYCStatus: React.FC<BusinessKYCStatusProps> = ({
  kycData,
  loading = false,
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-gray-100 p-6 rounded-lg">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!kycData) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">📋</span>
        </div>
        <h3 className="text-xl font-bold text-black mb-2">No KYC Found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You need to complete KYC verification before you can post investment
          opportunities.
        </p>
        <button
          onClick={() => navigate("/business/kyc/submit")}
          className="px-6 py-3 bg-black text-yellow-500 rounded-lg hover:bg-gray-900 font-medium"
        >
          Start KYC Verification →
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      case "under_review":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "✅";
      case "rejected":
        return "❌";
      case "under_review":
        return "⏳";
      default:
        return "📝";
    }
  };

  const latestRecord = kycData.records?.[0];

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <div
        className={`p-6 rounded-xl border-2 ${
          kycData.overall === "approved"
            ? "border-green-200 bg-green-50"
            : kycData.overall === "rejected"
              ? "border-red-200 bg-red-50"
              : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-black mb-1">
              Overall KYC Status
            </h3>
            <p className="text-gray-600">
              {kycData.overall === "approved"
                ? "Your business is verified and ready!"
                : kycData.overall === "rejected"
                  ? "Your KYC needs attention"
                  : kycData.overall === "under_review"
                    ? "Under review by admin team"
                    : "Pending submission"}
            </p>
          </div>
          <div
            className={`px-4 py-2 rounded-full border font-medium flex items-center gap-2 ${getStatusColor(
              kycData.overall,
            )}`}
          >
            <span>{getStatusIcon(kycData.overall)}</span>
            <span className="capitalize">
              {kycData.overall.replace("_", " ")}
            </span>
          </div>
        </div>
      </div>

      {/* Level-wise Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-black mb-4">
          Verification Progress
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(kycData.byLevel).map(([level, status]) => (
            <div key={level} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-black capitalize">
                  {level}
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(status)}`}
                >
                  {status.replace("_", " ")}
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    status === "approved"
                      ? "bg-green-500"
                      : status === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                  }`}
                  style={{
                    width:
                      status === "approved"
                        ? "100%"
                        : status === "rejected"
                          ? "100%"
                          : "50%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Submission Details */}
      {latestRecord && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-black mb-4">
            Latest Submission
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Business Information
              </h4>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Name:</span>{" "}
                  <span className="font-medium text-black">
                    {latestRecord.fullName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Submitted:</span>{" "}
                  <span className="font-medium text-black">
                    {new Date(latestRecord.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Level:</span>{" "}
                  <span className="font-medium text-black capitalize">
                    {latestRecord.level}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Status Details</h4>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">Last Updated:</span>{" "}
                  <span className="font-medium text-black">
                    {new Date(latestRecord.updatedAt).toLocaleDateString()}
                  </span>
                </p>
                {latestRecord.reviewedAt && (
                  <p>
                    <span className="text-gray-600">Reviewed:</span>{" "}
                    <span className="font-medium text-black">
                      {new Date(latestRecord.reviewedAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          {kycData.overall === "rejected" && latestRecord.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <h4 className="font-bold text-red-800 mb-1">Rejection Reason:</h4>
              <p className="text-red-700">{latestRecord.rejectionReason}</p>
              <button
                onClick={() => navigate("/business/kyc/submit")}
                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Resubmit with corrections →
              </button>
            </div>
          )}

          {/* Review Notes */}
          {latestRecord.reviewNotes && kycData.overall !== "rejected" && (
            <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
              <h4 className="font-bold text-blue-800 mb-1">Review Notes:</h4>
              <p className="text-blue-700">{latestRecord.reviewNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        {kycData.overall === "approved" ? (
          <button
            onClick={() => navigate("/business/investment/create")}
            className="px-6 py-3 bg-black text-yellow-500 rounded-lg hover:bg-gray-900 font-medium"
          >
            Post Investment Opportunity →
          </button>
        ) : kycData.overall === "rejected" ? (
          <button
            onClick={() => navigate("/business/kyc/submit")}
            className="px-6 py-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 font-medium"
          >
            Resubmit KYC
          </button>
        ) : (
          <button
            onClick={() => navigate("/business/kyc/submit")}
            className="px-6 py-3 bg-black text-yellow-500 rounded-lg hover:bg-gray-900 font-medium"
          >
            Update KYC Information
          </button>
        )}

        <button
          onClick={() => navigate("/business/investment")}
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
        >
          View Investments
        </button>
      </div>
    </div>
  );
};

export default BusinessKYCStatus;
