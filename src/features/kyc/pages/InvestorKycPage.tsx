import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Home,
  TrendingUp,
  FileText,
  Lock,
  Globe,
  Upload,
} from "lucide-react";
import api from "@/services/api";
import { KYCFormBasic } from "@/features/kyc/components/KYCFormBasic";
import { KYCFormIntermediate } from "@/features/kyc/components/KYCFormIntermediate";
import { KYCFormAdvanced } from "@/features/kyc/components/KYCFormAdvanced";
import { KYCProgressStepper } from "@/features/kyc/components/KYCProgressStepper";
import type {
 
} from "../types/kycTypes";

interface KYCStatus {
  overall: string;
  byLevel: {
    basic: string;
    intermediate: string;
    advanced: string;
  };
  records: Array<{
    _id: string;
    level: "basic" | "intermediate" | "advanced";
    status: string;
    reviewedAt?: string;
    reviewNotes?: string;
    createdAt: string;
  }>;
}

export default function InvestorKycPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [currentLevel, setCurrentLevel] = useState<
    "basic" | "intermediate" | "advanced"
  >("basic");
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch KYC status on component mount
  useEffect(() => {
    fetchKYCStatus();
  }, []);

  // Function to fetch KYC status from API
  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/kyc/status");
      setKycStatus(response.data);

      // Determine which level to show based on current status
      if (response.data.byLevel.basic !== "approved") {
        setCurrentLevel("basic");
      } else if (response.data.byLevel.intermediate !== "approved") {
        setCurrentLevel("intermediate");
      } else if (response.data.byLevel.advanced !== "approved") {
        setCurrentLevel("advanced");
      }
    } catch (err: any) {
      console.error("Fetch KYC status error:", err);
      setError(err.response?.data?.message || "Failed to fetch KYC status");
    } finally {
      setLoading(false);
    }
  };

  // Handle Basic KYC submission
  const handleBasicSubmit = async (data: BasicKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting Basic KYC data:", data);

      // According to API docs, Basic KYC requires these fields
      const requestData = {
        level: "basic",
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode || "",
      };

      console.log("Sending Basic KYC request:", requestData);

      const response = await api.post("/api/v1/kyc/submit", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Basic KYC response:", response.data);

      // Refresh status to show as pending
      await fetchKYCStatus();

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Auto-select next level
      if (kycStatus?.byLevel.intermediate !== "approved") {
        setCurrentLevel("intermediate");
      }
    } catch (err: any) {
      console.error("Basic KYC submission error:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config,
      });
      setError(err.response?.data?.message || "Failed to submit Basic KYC");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Intermediate KYC submission
  const handleIntermediateSubmit = async (data: IntermediateKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting Intermediate KYC data:", data);

      // First upload any files
      const idDocumentFrontImageUrl =
        data.idDocumentFrontImage instanceof File
          ? await uploadFile(data.idDocumentFrontImage, "id_front")
          : data.idDocumentFrontImage;

      const idDocumentBackImageUrl =
        data.idDocumentBackImage instanceof File
          ? await uploadFile(data.idDocumentBackImage, "id_back")
          : data.idDocumentBackImage;

      const selfieImageUrl =
        data.selfieImage instanceof File
          ? await uploadFile(data.selfieImage, "selfie")
          : data.selfieImage;

      // Prepare request data
      const requestData = {
        level: "intermediate",
        idDocumentType: data.idDocumentType,
        idDocumentNumber: data.idDocumentNumber,
        idDocumentFrontImage: idDocumentFrontImageUrl,
        idDocumentBackImage: idDocumentBackImageUrl,
        selfieImage: selfieImageUrl,
        employmentStatus: data.employmentStatus,
        occupation: data.occupation,
        annualIncome: data.annualIncome,
      };

      console.log("Sending Intermediate KYC request:", requestData);

      const response = await api.post("/api/v1/kyc/submit", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Intermediate KYC response:", response.data);

      // Refresh status
      await fetchKYCStatus();

      // Show success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      // Auto-select next level
      if (kycStatus?.byLevel.advanced !== "approved") {
        setCurrentLevel("advanced");
      }
    } catch (err: any) {
      console.error("Intermediate KYC submission error:", err);
      setError(
        err.response?.data?.message || "Failed to submit Intermediate KYC",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Advanced KYC submission
  const handleAdvancedSubmit = async (data: AdvancedKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      console.log("Submitting Advanced KYC data:", data);

      // Upload files
      const bankStatementUrl =
        data.bankStatement instanceof File
          ? await uploadFile(data.bankStatement, "bank_statement")
          : data.bankStatement;

      const proofOfAddressUrl =
        data.proofOfAddress instanceof File
          ? await uploadFile(data.proofOfAddress, "proof_of_address")
          : data.proofOfAddress;

      const employmentLetterUrl =
        data.employmentLetter instanceof File
          ? await uploadFile(data.employmentLetter, "employment_letter")
          : data.employmentLetter;

      // Prepare request data
      const requestData = {
        level: "advanced",
        sourceOfFunds: data.sourceOfFunds,
        bankStatement: bankStatementUrl,
        proofOfAddress: proofOfAddressUrl,
        employmentLetter: employmentLetterUrl,
        taxIdentificationNumber: data.taxIdentificationNumber || "",
        bankName: data.bankName || "",
        bankAccountNumber: data.bankAccountNumber || "",
      };

      console.log("Sending Advanced KYC request:", requestData);

      const response = await api.post("/api/v1/kyc/submit", requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Advanced KYC response:", response.data);

      // Refresh status
      await fetchKYCStatus();

      // Show success
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error("Advanced KYC submission error:", err);
      setError(err.response?.data?.message || "Failed to submit Advanced KYC");
    } finally {
      setSubmitting(false);
    }
  };

  // Upload file helper function
  const uploadFile = async (file: File, type: string): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      console.log(`Uploading ${type} file:`, file.name);

      const response = await api.post("/api/v1/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(`File upload response for ${type}:`, response.data);

      return response.data.url || response.data.location || response.data.path;
    } catch (err: any) {
      console.error(`File upload error for ${type}:`, err);
      throw new Error(
        `Failed to upload ${type}: ${err.response?.data?.message || err.message}`,
      );
    }
  };

  // Status helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-400";
      case "rejected":
        return "text-red-400";
      case "under_review":
      case "pending":
        return "text-yellow-400";
      case "requires_update":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "under_review":
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!kycStatus) return 0;

    let completed = 0;
    if (kycStatus.byLevel.basic === "approved") completed++;
    if (kycStatus.byLevel.intermediate === "approved") completed++;
    if (kycStatus.byLevel.advanced === "approved") completed++;

    return Math.round((completed / 3) * 100);
  };

  if (loading && !kycStatus) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#FFD700] border-t-transparent mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Loading KYC Status
          </h2>
          <p className="text-gray-400">
            Please wait while we fetch your verification status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 mr-3" />
              <div>
                <p className="font-bold">KYC Submitted Successfully!</p>
                <p className="text-sm opacity-90">
                  Your submission is now under admin review
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">KYC Verification</h1>
            <p className="text-gray-400 mt-2">
              Complete your verification to unlock investment opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm">
              <Globe className="w-4 h-4 mr-2 text-[#FFD700]" />
              <span className="text-gray-300">Diaspora Investor</span>
            </div>
            <button
              onClick={() => navigate("/investor")}
              className="flex items-center text-[#FFD700] hover:text-yellow-400 transition-colors"
            >
              <Home className="w-5 h-5 mr-2" />
              Dashboard
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
              <p className="text-sm font-medium text-red-400">{error}</p>
            </div>
          </div>
        )}

        {/* Progress Overview */}
        {kycStatus && (
          <div className="mb-8">
            <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Verification Progress
                  </h2>
                  <p className="text-gray-400">
                    Complete all levels to unlock full access
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#FFD700]">
                    {calculateCompletion()}%
                  </div>
                  <div className="text-sm text-gray-400">Complete</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-6">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD700] to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${calculateCompletion()}%` }}
                />
              </div>

              {/* Level Progress Stepper */}
              <KYCProgressStepper
                currentLevel={currentLevel}
                status={kycStatus.byLevel}
                onStepClick={(level) => {
                  const canClick =
                    level === "basic" ||
                    (level === "intermediate" &&
                      (kycStatus.byLevel.basic === "approved" ||
                        kycStatus.byLevel.basic === "pending")) ||
                    (level === "advanced" &&
                      (kycStatus.byLevel.intermediate === "approved" ||
                        kycStatus.byLevel.intermediate === "pending"));

                  if (canClick) {
                    setCurrentLevel(level as any);
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col gap-8">
          {/* Form Section */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-8 shadow-2xl">
            {currentLevel === "basic" && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-500/20 rounded-xl mr-4">
                      <FileText className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Basic Information
                      </h2>
                      <p className="text-gray-400">
                        Start with your personal details
                      </p>
                    </div>
                  </div>
                </div>
                <KYCFormBasic
                  onSubmit={handleBasicSubmit}
                  loading={submitting}
                />
              </div>
            )}

            {currentLevel === "intermediate" && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl mr-4">
                      <Lock className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Identity Verification
                      </h2>
                      <p className="text-gray-400">
                        Verify your identity with documents
                      </p>
                    </div>
                  </div>
                  {kycStatus?.byLevel.basic !== "approved" &&
                    kycStatus?.byLevel.basic !== "pending" && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
                          <p className="text-yellow-300">
                            You must complete Basic KYC before proceeding to
                            Identity Verification
                          </p>
                        </div>
                      </div>
                    )}
                </div>
                {(kycStatus?.byLevel.basic === "approved" ||
                  kycStatus?.byLevel.basic === "pending") && (
                  <KYCFormIntermediate
                    onSubmit={handleIntermediateSubmit}
                    loading={submitting}
                  />
                )}
              </div>
            )}

            {currentLevel === "advanced" && (
              <div>
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-[#FFD700]/20 rounded-xl mr-4">
                      <TrendingUp className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        Financial Verification
                      </h2>
                      <p className="text-gray-400">
                        Complete your financial profile
                      </p>
                    </div>
                  </div>
                  {kycStatus?.byLevel.intermediate !== "approved" &&
                    kycStatus?.byLevel.intermediate !== "pending" && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-6">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-yellow-400 mr-3" />
                          <p className="text-yellow-300">
                            You must complete Identity Verification before
                            proceeding to Financial Verification
                          </p>
                        </div>
                      </div>
                    )}
                </div>
                {(kycStatus?.byLevel.intermediate === "approved" ||
                  kycStatus?.byLevel.intermediate === "pending") && (
                  <KYCFormAdvanced
                    onSubmit={handleAdvancedSubmit}
                    loading={submitting}
                  />
                )}
              </div>
            )}
          </div>

          {/* Status Table Section */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-[#FFD700]" />
              KYC Status Overview
            </h2>

            {kycStatus && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">
                        Level
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">
                        Submitted Date
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">
                        Review Notes
                      </th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {kycStatus.records.map((record) => (
                      <tr
                        key={record._id}
                        className="border-b border-gray-800 hover:bg-gray-900/50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="font-medium text-white capitalize">
                            {record.level}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {getStatusIcon(record.status)}
                            <span
                              className={`ml-2 font-medium ${getStatusColor(record.status)}`}
                            >
                              {record.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-400">
                          {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-gray-400 max-w-xs">
                          {record.reviewNotes || "No notes yet"}
                        </td>
                        <td className="py-4 px-6">
                          {record.status === "requires_update" && (
                            <button
                              onClick={() => setCurrentLevel(record.level)}
                              className="px-4 py-2 bg-gradient-to-r from-[#FFD700] to-yellow-500 text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Update
                            </button>
                          )}
                          {record.status === "pending" && (
                            <span className="text-yellow-400">
                              Under Admin Review
                            </span>
                          )}
                          {record.status === "approved" && (
                            <span className="text-green-400 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completed
                            </span>
                          )}
                          {record.status === "rejected" && (
                            <button
                              onClick={() => setCurrentLevel(record.level)}
                              className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Resubmit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* File Upload Section (Optional) */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
              <Upload className="w-6 h-6 mr-3 text-[#FFD700]" />
              Document Upload Guidelines
            </h2>
            <div className="p-6 bg-gradient-to-r from-gray-800 to-black rounded-xl">
              <h3 className="font-medium text-white mb-3">
                Supported Documents
              </h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Passport (PDF, JPG, PNG)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  National ID (PDF, JPG, PNG)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Driver's License (PDF, JPG, PNG)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Bank Statements (PDF)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Proof of Address (PDF, JPG, PNG)
                </li>
              </ul>
              <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
                <p className="text-yellow-300 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Maximum file size: 10MB per file
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
