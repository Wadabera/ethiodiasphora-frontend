// src/features/business/IPOManagement/components/IPODetailsModal.tsx

import React from "react";
import {type IPO } from "../types/businessIPOtypes";
import IPOStatusBadge from "./IPOStatusBadge";

interface IPODetailsModalProps {
  ipo: IPO | null;
  isOpen: boolean;
  onClose: () => void;
}

const IPODetailsModal: React.FC<IPODetailsModalProps> = ({
  ipo,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !ipo) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">IPO Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold text-gray-900">
                {ipo.companyName}
              </h3>
              <p className="text-lg text-gray-600">{ipo.symbol}</p>
            </div>
            <IPOStatusBadge status={ipo.status} />
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Offer Price</p>
              <p className="text-lg font-bold">
                {formatCurrency(ipo.offerPrice)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Issue Size</p>
              <p className="text-lg font-bold">
                {formatCurrency(ipo.issueSize)}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Total Shares</p>
              <p className="text-lg font-bold">
                {ipo.totalShares.toLocaleString()}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Face Value</p>
              <p className="text-lg font-bold">
                {formatCurrency(ipo.faceValue)}
              </p>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">
              Subscription Status
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-700">Total Subscribed</p>
                <p className="text-xl font-bold text-blue-900">
                  {ipo.totalSubscribed?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Subscription Ratio</p>
                <p className="text-xl font-bold text-blue-900">
                  {ipo.subscriptionRatio}x
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Total Applications</p>
                <p className="text-xl font-bold text-blue-900">
                  {ipo.totalApplications}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-700">Interested Investors</p>
                <p className="text-xl font-bold text-blue-900">
                  {ipo.interestedInvestors}
                </p>
              </div>
            </div>
          </div>

          {/* Lot Details */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Lot Size</p>
              <p className="font-medium">{ipo.lotSize} shares</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Minimum Lot</p>
              <p className="font-medium">{ipo.minimumLot} lots</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Maximum Lot</p>
              <p className="font-medium">{ipo.maximumLot} lots</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">IPO Timeline</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Start Date</p>
                <p className="font-medium">{formatDate(ipo.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">End Date</p>
                <p className="font-medium">{formatDate(ipo.endDate)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-700">{ipo.description}</p>
          </div>

          {/* Documents */}
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Documents</h4>
            <a
              href={ipo.prospectusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Download Prospectus
            </a>
          </div>

          {/* Rejection Reason (if rejected) */}
          {ipo.status === "rejected" && ipo.rejectionReason && (
            <div className="border-t pt-4">
              <h4 className="font-medium text-red-600 mb-2">
                Rejection Reason
              </h4>
              <p className="text-gray-700 bg-red-50 p-3 rounded">
                {ipo.rejectionReason}
              </p>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4 text-xs text-gray-500">
            <p>Created: {formatDate(ipo.createdAt)}</p>
            <p>Last Updated: {formatDate(ipo.updatedAt)}</p>
            <p>Views: {ipo.viewCount}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IPODetailsModal;
