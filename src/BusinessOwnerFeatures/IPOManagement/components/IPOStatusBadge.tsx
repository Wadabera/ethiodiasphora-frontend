import React from "react";
import type{  IPOStatus } from "../../../types";

interface Props {
  status: IPOStatus;
}

const statusConfig: Record<IPOStatus, { label: string; className: string }> = {
  pending_approval: {
    label: "Pending Approval",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  },
  announced: {
    label: "Announced",
    className: "bg-blue-100 text-blue-800 border border-blue-200",
  },
  open: {
    label: "Open",
    className: "bg-green-100 text-green-800 border border-green-200",
  },
  closed: {
    label: "Closed",
    className: "bg-gray-100 text-gray-800 border border-gray-200",
  },
  allotted: {
    label: "Allotted",
    className: "bg-purple-100 text-purple-800 border border-purple-200",
  },
  listed: {
    label: "Listed",
    className: "bg-indigo-100 text-indigo-800 border border-indigo-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border border-red-200",
  },
};

export const IPOStatusBadge: React.FC<Props> = ({ status }) => {
  const config = statusConfig[status];
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
};
