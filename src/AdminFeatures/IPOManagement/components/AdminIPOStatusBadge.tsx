import React from "react";
import {type IPOStatus } from "../types/adminIPOtypes";

interface Props {
  status: IPOStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<IPOStatus, { label: string; className: string }> = {
  pending_approval: {
    label: "Pending Approval",
    className: "bg-yellow-900/30 text-yellow-500 border border-yellow-800",
  },
  announced: {
    label: "Announced",
    className: "bg-blue-900/30 text-blue-500 border border-blue-800",
  },
  open: {
    label: "Open",
    className: "bg-green-900/30 text-green-500 border border-green-800",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-800 text-gray-400 border border-gray-700",
  },
  allotted: {
    label: "Allotted",
    className: "bg-purple-900/30 text-purple-500 border border-purple-800",
  },
  listed: {
    label: "Listed",
    className: "bg-indigo-900/30 text-indigo-500 border border-indigo-800",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-900/30 text-red-500 border border-red-800",
  },
};

export const AdminIPOStatusBadge: React.FC<Props> = ({
  status,
  size = "md",
}) => {
  const config = statusConfig[status];
  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-block rounded-full font-medium ${sizeClass} ${config.className}`}
    >
      {config.label}
    </span>
  );
};
