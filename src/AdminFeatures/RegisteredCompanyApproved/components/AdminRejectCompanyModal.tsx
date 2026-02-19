import React, { useState, useEffect } from "react";
import { X, AlertCircle, AlertTriangle, Send, UserMinus } from "lucide-react";

interface AdminRejectCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  companyName?: string;
  registrationNumber?: string;
  actionType: "reject" | "suspend";
}

const rejectionReasons = [
  "Incomplete or incorrect registration documents",
  "Business type not eligible for platform",
  "Invalid TIN or registration number",
  "Suspicious or fraudulent information",
  "Does not meet minimum requirements",
  "Other (specify below)",
];

const suspensionReasons = [
  "Violation of terms of service",
  "Suspicious activity detected",
  "Non-payment of fees",
  "Legal compliance issues",
  "User request",
  "Other (specify below)",
];

const AdminRejectCompanyModal: React.FC<AdminRejectCompanyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName = "Company",
  registrationNumber = "",
  actionType,
}) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReason("");
      setCustomReason("");
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    let finalReason = reason;

    if (reason === "Other (specify below)") {
      if (!customReason.trim()) {
        alert("Please provide a detailed reason");
        return;
      }
      finalReason = customReason;
    } else if (!reason) {
      alert("Please select a reason");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(finalReason);
      handleClose();
    } catch (error) {
      console.error(`Error ${actionType}ing company:`, error);
      alert(`Failed to ${actionType} company. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason("");
    setCustomReason("");
    onClose();
  };

  if (!isOpen) return null;

  const reasons =
    actionType === "reject" ? rejectionReasons : suspensionReasons;
  const title = actionType === "reject" ? "Reject Company" : "Suspend Company";
  const Icon = actionType === "reject" ? AlertTriangle : UserMinus;
  const color = actionType === "reject" ? "red" : "purple";
  const actionText = actionType === "reject" ? "Reject" : "Suspend";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 bg-[#0F0F0F] border border-gray-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
              <Icon className={`w-5 h-5 text-${color}-400`} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-gray-400">
                Provide reason for {actionType}ion
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Warning */}
        <div
          className={`p-4 mx-6 mt-4 bg-${color}-500/10 border border-${color}-500/30 rounded-xl`}
        >
          <div className="flex items-start">
            <AlertCircle
              className={`w-5 h-5 text-${color}-400 mr-3 mt-0.5 flex-shrink-0`}
            />
            <div>
              <p className={`text-sm font-medium text-${color}-400 mb-1`}>
                Important Notice
              </p>
              <p className="text-xs text-gray-300">
                This action cannot be undone. The business owner will be
                notified of the {actionType}ion.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Company Info */}
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              You are {actionType}ing{" "}
              <span className="font-semibold text-white">{companyName}</span>
            </p>
            {registrationNumber && (
              <p className="text-sm text-gray-400">
                Registration:{" "}
                <span className="text-gray-300">{registrationNumber}</span>
              </p>
            )}
          </div>

          {/* Reason Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Select {actionType === "reject" ? "Rejection" : "Suspension"}{" "}
                Reason *
              </label>
              <div className="space-y-2">
                {reasons.map((item) => (
                  <label
                    key={item}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                      reason === item
                        ? `bg-${color}-500/10 border-${color}-500/50`
                        : "bg-[#1A1A1A] border-gray-700 hover:bg-gray-800"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={item}
                      checked={reason === item}
                      onChange={(e) => {
                        setReason(e.target.value);
                        if (e.target.value !== "Other (specify below)") {
                          setCustomReason("");
                        }
                      }}
                      className={`mt-0.5 mr-3 text-${color}-500 focus:ring-${color}-500`}
                      disabled={isSubmitting}
                    />
                    <span className="text-gray-200">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Reason Input */}
            {reason === "Other (specify below)" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Please provide a detailed reason *
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder={`Enter your detailed reason for ${actionType}ion here...`}
                  className="w-full h-32 bg-[#1A1A1A] border border-gray-700 text-white placeholder-gray-500 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 p-6 border-t border-gray-800 bg-[#0A0A0A] rounded-b-2xl">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !reason ||
              (reason === "Other (specify below)" && !customReason.trim())
            }
            className={`px-5 py-2.5 bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                {actionText}ing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {actionText} Company
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminRejectCompanyModal;
