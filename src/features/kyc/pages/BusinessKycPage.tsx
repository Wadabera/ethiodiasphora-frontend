// src/features/kyc/pages/BusinessKycPage.tsx
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
  Upload,
  Building,
} from "lucide-react";
import api from "@/services/api";
import { KYCFormBasic } from "@/features/kyc/components/KYCFormBasic";
import { KYCFormIntermediate } from "@/features/kyc/components/KYCFormIntermediate";
import { KYCFormAdvanced } from "@/features/kyc/components/KYCFormAdvanced";
import { KYCProgressStepper } from "@/features/kyc/components/KYCProgressStepper";
import type {
  BasicKYCData,
  IntermediateKYCData,
  AdvancedKYCData,
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

export default function BusinessKycPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [currentLevel, setCurrentLevel] = useState<
    "basic" | "intermediate" | "advanced"
  >("basic");
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/kyc/status");
      setKycStatus(response.data);

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

  // ============================================
  // Helper: Convert File to Base64
  // ============================================
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // ============================================
  // Handle Basic KYC submission (no files - easy)
  // ============================================
  const handleBasicSubmit = async (data: BasicKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      // ✅ Send as JSON - this works because no files
      const jsonData = {
        level: "basic",
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        nationality: data.nationality,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalCode || "",
      };

      console.log("📤 Submitting Basic KYC:", jsonData);

      const response = await api.post("/api/v1/kyc/submit", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Basic KYC response:", response.data);
      await fetchKYCStatus();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (kycStatus?.byLevel.intermediate !== "approved") {
        setCurrentLevel("intermediate");
      }
    } catch (err: any) {
      console.error(
        "❌ Basic KYC submission error:",
        err.response?.data || err,
      );
      setError(err.response?.data?.message || "Failed to submit Basic KYC");
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // Handle Intermediate KYC submission
  // ✅ FIXED: Convert files to Base64 and send as JSON
  // ============================================
  const handleIntermediateSubmit = async (data: IntermediateKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Convert files to Base64
      let idDocumentFrontImageBase64 = data.idDocumentFrontImage as string;
      let idDocumentBackImageBase64 = data.idDocumentBackImage as
        | string
        | undefined;
      let selfieImageBase64 = data.selfieImage as string;

      if (data.idDocumentFrontImage instanceof File) {
        console.log("📎 Converting front image to Base64...");
        idDocumentFrontImageBase64 = await fileToBase64(
          data.idDocumentFrontImage,
        );
      }

      if (data.idDocumentBackImage instanceof File) {
        console.log("📎 Converting back image to Base64...");
        idDocumentBackImageBase64 = await fileToBase64(
          data.idDocumentBackImage,
        );
      }

      if (data.selfieImage instanceof File) {
        console.log("📎 Converting selfie to Base64...");
        selfieImageBase64 = await fileToBase64(data.selfieImage);
      }

      // ✅ Send as JSON with Base64 files
      const jsonData = {
        level: "intermediate", // ✅ This is what backend expects
        idDocumentType: data.idDocumentType,
        idDocumentNumber: data.idDocumentNumber,
        idDocumentFrontImage: idDocumentFrontImageBase64,
        idDocumentBackImage: idDocumentBackImageBase64,
        selfieImage: selfieImageBase64,
        employmentStatus: data.employmentStatus,
        occupation: data.occupation,
        annualIncome: data.annualIncome,
      };

      console.log("📤 Submitting Intermediate KYC:", {
        ...jsonData,
        idDocumentFrontImage: jsonData.idDocumentFrontImage
          ? "Base64 string (length: " +
            jsonData.idDocumentFrontImage.length +
            ")"
          : null,
        idDocumentBackImage: jsonData.idDocumentBackImage
          ? "Base64 string (length: " +
            jsonData.idDocumentBackImage.length +
            ")"
          : null,
        selfieImage: jsonData.selfieImage
          ? "Base64 string (length: " + jsonData.selfieImage.length + ")"
          : null,
      });

      const response = await api.post("/api/v1/kyc/submit", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Intermediate KYC response:", response.data);
      await fetchKYCStatus();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

      if (kycStatus?.byLevel.advanced !== "approved") {
        setCurrentLevel("advanced");
      }
    } catch (err: any) {
      console.error(
        "❌ Intermediate KYC submission error:",
        err.response?.data || err,
      );
      setError(
        err.response?.data?.message || "Failed to submit Intermediate KYC",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================
  // Handle Advanced KYC submission
  // ✅ FIXED: Convert files to Base64 and send as JSON
  // ============================================
  const handleAdvancedSubmit = async (data: AdvancedKYCData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Convert files to Base64
      let bankStatementBase64 = data.bankStatement as string;
      let proofOfAddressBase64 = data.proofOfAddress as string;
      let employmentLetterBase64 = data.employmentLetter as string | undefined;

      if (data.bankStatement instanceof File) {
        console.log("📎 Converting bank statement to Base64...");
        bankStatementBase64 = await fileToBase64(data.bankStatement);
      }

      if (data.proofOfAddress instanceof File) {
        console.log("📎 Converting proof of address to Base64...");
        proofOfAddressBase64 = await fileToBase64(data.proofOfAddress);
      }

      if (data.employmentLetter instanceof File) {
        console.log("📎 Converting employment letter to Base64...");
        employmentLetterBase64 = await fileToBase64(data.employmentLetter);
      }

      // ✅ Send as JSON with Base64 files
      const jsonData = {
        level: "advanced", // ✅ This is what backend expects
        sourceOfFunds: data.sourceOfFunds,
        bankStatement: bankStatementBase64,
        proofOfAddress: proofOfAddressBase64,
        employmentLetter: employmentLetterBase64,
        taxIdentificationNumber: data.taxIdentificationNumber || "",
        bankName: data.bankName || "",
        bankAccountNumber: data.bankAccountNumber || "",
      };

      console.log("📤 Submitting Advanced KYC:", {
        ...jsonData,
        bankStatement: jsonData.bankStatement
          ? "Base64 string (length: " + jsonData.bankStatement.length + ")"
          : null,
        proofOfAddress: jsonData.proofOfAddress
          ? "Base64 string (length: " + jsonData.proofOfAddress.length + ")"
          : null,
        employmentLetter: jsonData.employmentLetter
          ? "Base64 string (length: " + jsonData.employmentLetter.length + ")"
          : null,
      });

      const response = await api.post("/api/v1/kyc/submit", jsonData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Advanced KYC response:", response.data);
      await fetchKYCStatus();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error(
        "❌ Advanced KYC submission error:",
        err.response?.data || err,
      );
      setError(err.response?.data?.message || "Failed to submit Advanced KYC");
    } finally {
      setSubmitting(false);
    }
  };

  // Status helper functions (keep as is)
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

  const calculateCompletion = () => {
    if (!kycStatus) return 0;
    let completed = 0;
    if (kycStatus.byLevel.basic === "approved") completed++;
    if (kycStatus.byLevel.intermediate === "approved") completed++;
    if (kycStatus.byLevel.advanced === "approved") completed++;
    return Math.round((completed / 3) * 100);
  };

  // Loading state
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

  // Return your JSX (unchanged)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black px-4 py-8">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl">
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
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Building className="w-8 h-8 mr-3 text-[#FFD700]" />
              Business KYC Verification
            </h1>
            <p className="text-gray-400 mt-2">
              Complete your business verification to create and manage
              investment opportunities
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-sm bg-gray-800 px-4 py-2 rounded-lg">
              <Building className="w-4 h-4 mr-2 text-[#FFD700]" />
              <span className="text-gray-300">Business Owner</span>
            </div>
            <button
              onClick={() => navigate("/business")}
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
                    Complete all levels to unlock full business features
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-8 shadow-2xl">
              {/* Level Indicators */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                <div className="flex items-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentLevel === "basic"
                        ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    Basic
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentLevel === "intermediate"
                        ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    Intermediate
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentLevel === "advanced"
                        ? "bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/30"
                        : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    Advanced
                  </div>
                </div>
                {kycStatus && (
                  <div className="text-sm text-gray-400">
                    Status:{" "}
                    <span
                      className={getStatusColor(
                        kycStatus.byLevel[currentLevel],
                      )}
                    >
                      {kycStatus.byLevel[currentLevel]
                        .replace("_", " ")
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Content */}
              {currentLevel === "basic" && (
                <div>
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center">
                      <Building className="w-5 h-5 text-blue-400 mr-3" />
                      <p className="text-sm text-blue-300">
                        For business verification, please provide the business
                        owner's personal information
                      </p>
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
                  {kycStatus?.byLevel.basic !== "approved" &&
                  kycStatus?.byLevel.basic !== "pending" ? (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Level Locked
                      </h3>
                      <p className="text-gray-400">
                        You need to complete Basic KYC first
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="flex items-center">
                          <Lock className="w-5 h-5 text-purple-400 mr-3" />
                          <p className="text-sm text-purple-300">
                            Verify business owner identity. All documents will
                            be uploaded securely.
                          </p>
                        </div>
                      </div>
                      <KYCFormIntermediate
                        onSubmit={handleIntermediateSubmit}
                        loading={submitting}
                      />
                    </div>
                  )}
                </div>
              )}

              {currentLevel === "advanced" && (
                <div>
                  {kycStatus?.byLevel.intermediate !== "approved" &&
                  kycStatus?.byLevel.intermediate !== "pending" ? (
                    <div className="text-center py-12">
                      <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        Level Locked
                      </h3>
                      <p className="text-gray-400">
                        You need to complete Intermediate KYC first
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 p-4 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-lg">
                        <div className="flex items-center">
                          <TrendingUp className="w-5 h-5 text-[#FFD700] mr-3" />
                          <p className="text-sm text-yellow-300">
                            Provide business financial information and banking
                            details
                          </p>
                        </div>
                      </div>
                      <KYCFormAdvanced
                        onSubmit={handleAdvancedSubmit}
                        loading={submitting}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Status Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-[#FFD700]" />
                KYC Status
              </h2>

              {kycStatus ? (
                <div className="space-y-6">
                  <div className="p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                    <p className="text-sm text-gray-400 mb-1">Overall Status</p>
                    <div className="flex items-center">
                      {getStatusIcon(kycStatus.overall)}
                      <span
                        className={`ml-2 font-semibold ${getStatusColor(kycStatus.overall)}`}
                      >
                        {kycStatus.overall.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {["basic", "intermediate", "advanced"].map((level) => (
                      <div
                        key={level}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                      >
                        <span className="text-gray-300 capitalize">
                          {level}
                        </span>
                        <div className="flex items-center">
                          {getStatusIcon(
                            kycStatus.byLevel[
                              level as keyof typeof kycStatus.byLevel
                            ],
                          )}
                          <span
                            className={`ml-2 text-sm ${getStatusColor(kycStatus.byLevel[level as keyof typeof kycStatus.byLevel])}`}
                          >
                            {kycStatus.byLevel[
                              level as keyof typeof kycStatus.byLevel
                            ]
                              .replace("_", " ")
                              .toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gradient-to-r from-gray-800 to-black rounded-xl">
                    <h3 className="text-sm font-medium text-white mb-3 flex items-center">
                      <Upload className="w-4 h-4 mr-2 text-[#FFD700]" />
                      Document Guidelines
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-400">
                      <li className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                        Passport, National ID, or Driver's License
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                        Business registration documents
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                        Bank statements (last 3 months)
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                        Proof of business address
                      </li>
                      <li className="flex items-center">
                        <AlertCircle className="w-3 h-3 text-yellow-400 mr-2" />
                        Max file size: 10MB per file
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No KYC data found</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Start by submitting Basic KYC
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
