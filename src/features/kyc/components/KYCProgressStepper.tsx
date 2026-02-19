import React from "react";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import type { KYCStatus } from "../types/kycTypes";

interface KYCProgressStepperProps {
  currentLevel: "basic" | "intermediate" | "advanced";
  status: {
    basic: KYCStatus;
    intermediate: KYCStatus;
    advanced: KYCStatus;
  };
  onStepClick?: (level: string) => void;
}

export const KYCProgressStepper: React.FC<KYCProgressStepperProps> = ({
  currentLevel,
  status,
  onStepClick,
}) => {
  const steps = [
    { id: "basic", label: "Basic KYC", description: "Personal Information" },
    {
      id: "intermediate",
      label: "Intermediate",
      description: "Identity Verification",
    },
    { id: "advanced", label: "Advanced", description: "Financial Details" },
  ];

  const getStatusIcon = (stepId: string, stepStatus: KYCStatus) => {
    if (stepStatus === "approved") {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    } else if (stepStatus === "rejected" || stepStatus === "requires_update") {
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    } else if (stepStatus === "under_review") {
      return (
        <div className="w-6 h-6 rounded-full border-2 border-yellow-500 animate-pulse" />
      );
    } else if (stepStatus === "pending" && currentLevel === stepId) {
      return (
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#FFD700] to-yellow-500" />
      );
    } else {
      return <Circle className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex justify-between items-center relative">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div
              className={`flex flex-col items-center cursor-pointer ${onStepClick ? "hover:opacity-80" : ""}`}
              onClick={() => onStepClick && onStepClick(step.id)}
            >
              <div className="relative z-10">
                {getStatusIcon(step.id, status[step.id as keyof typeof status])}
              </div>
              <div className="mt-2 text-center">
                <p className="text-sm font-semibold text-white">{step.label}</p>
                <p className="text-xs text-gray-400">{step.description}</p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 bg-gray-700 relative top-3">
                <div
                  className={`h-full transition-all duration-300 ${
                    currentLevel === step.id ||
                    status[step.id as keyof typeof status] === "approved"
                      ? "bg-gradient-to-r from-[#FFD700] to-yellow-500"
                      : "bg-gray-700"
                  }`}
                  style={{
                    width:
                      status[step.id as keyof typeof status] === "approved"
                        ? "100%"
                        : "50%",
                  }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
