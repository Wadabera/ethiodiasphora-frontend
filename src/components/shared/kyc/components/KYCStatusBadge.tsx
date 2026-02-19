// features/kyc/shared/components/KYCStatusBadge.tsx
import React from "react";
import type{ KYCStatus } from "../../types/types";

interface KYCStatusBadgeProps {
  status: KYCStatus;
  size?: "sm" | "md" | "lg";
}

const KYCStatusBadge: React.FC<KYCStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const config = { 
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      border: "border-yellow-300",
      icon: "⏳",
    },
    under_review: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      border: "border-blue-300",
      icon: "🔍",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-800",
      border: "border-green-300",
      icon: "✅",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-800",
      border: "border-red-300",
      icon: "❌",
    },
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const { bg, text, border, icon } = config[status];
  const sizeClass = sizeClasses[size];

  return (
    <span
      className={`
      inline-flex items-center gap-1.5
      ${bg} ${text} ${border}
      ${sizeClass}
      font-medium rounded-lg border
    `}
    >
      <span>{icon}</span>
      <span className="capitalize">{status.replace("_", " ")}</span>
    </span>
  );
};

export default KYCStatusBadge;
