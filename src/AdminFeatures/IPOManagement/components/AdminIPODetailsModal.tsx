import React from "react";
import {type AdminIPO } from "../types/adminIPOtypes";
import { AdminIPOStatusBadge } from "./AdminIPOStatusBadge";

interface Props {
  ipo: AdminIPO;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (ipo: AdminIPO) => void;
  onReject?: (ipo: AdminIPO) => void;
  onOpen?: (ipo: AdminIPO) => void;
  onCloseIPO?: (ipo: AdminIPO) => void;
  onAllot?: (ipo: AdminIPO) => void;
  onList?: (ipo: AdminIPO) => void;
}

export const AdminIPODetailsModal: React.FC<Props> = ({
  ipo,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onOpen,
  onCloseIPO,
  onAllot,
  onList,
}) => {
  if (!isOpen) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
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

  const getActionButtons = () => {
    const buttons = [];

    switch (ipo.status) {
      case "pending_approval":
        buttons.push(
          <button
            key="approve"
            onClick={() => onApprove?.(ipo)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Approve IPO
          </button>,
          <button
            key="reject"
            onClick={() => onReject?.(ipo)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Reject IPO
          </button>,
        );
        break;
      case "announced":
        buttons.push(
          <button
            key="open"
            onClick={() => onOpen?.(ipo)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Open for Subscription
          </button>,
        );
        break;
      case "open":
        buttons.push(
          <button
            key="close"
            onClick={() => onCloseIPO?.(ipo)}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
          >
            Close IPO
          </button>,
        );
        break;
      case "closed":
        buttons.push(
          <button
            key="allot"
            onClick={() => onAllot?.(ipo)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Process Allotment
          </button>,
        );
        break;
      case "allotted":
        buttons.push(
          <button
            key="list"
            onClick={() => onList?.(ipo)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            List as Stock
          </button>,
        );
        break;
    }

    return buttons;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-white">
                {ipo.companyName}
              </h2>
              <AdminIPOStatusBadge status={ipo.status} />
            </div>
            <p className="text-[#FFD700]">{ipo.symbol}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1A1A1A] p-3 rounded">
              <p className="text-sm text-gray-400">Offer Price</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(ipo.offerPrice)}
              </p>
            </div>
            <div className="bg-[#1A1A1A] p-3 rounded">
              <p className="text-sm text-gray-400">Face Value</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(ipo.faceValue)}
              </p>
            </div>
            <div className="bg-[#1A1A1A] p-3 rounded">
              <p className="text-sm text-gray-400">Issue Size</p>
              <p className="text-xl font-bold text-white">
                {formatCurrency(ipo.issueSize)}
              </p>
            </div>
            <div className="bg-[#1A1A1A] p-3 rounded">
              <p className="text-sm text-gray-400">Total Shares</p>
              <p className="text-xl font-bold text-white">
                {ipo.totalShares.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className="bg-blue-900/30 border border-blue-800 p-4 rounded">
            <h3 className="font-medium text-blue-400 mb-3">
              Subscription Status
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-blue-300">Subscribed</p>
                <p className="text-xl font-bold text-white">
                  {ipo.totalSubscribed?.toLocaleString() || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-300">Subscription Ratio</p>
                <p className="text-xl font-bold text-white">
                  {ipo.subscriptionRatio}x
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-300">Applications</p>
                <p className="text-xl font-bold text-white">
                  {ipo.totalApplications}
                </p>
              </div>
              <div>
                <p className="text-sm text-blue-300">Interested</p>
                <p className="text-xl font-bold text-white">
                  {ipo.interestedInvestors}
                </p>
              </div>
            </div>
          </div>

          {/* Lot Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-400">Lot Size</p>
              <p className="font-medium text-white">{ipo.lotSize} shares</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Minimum Lot</p>
              <p className="font-medium text-white">{ipo.minimumLot} lots</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Maximum Lot</p>
              <p className="font-medium text-white">{ipo.maximumLot} lots</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">IPO Type</p>
              <p className="font-medium text-white capitalize">
                {ipo.ipoType.replace("_", " ")}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium text-white mb-3">IPO Timeline</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Start Date</p>
                <p className="font-medium text-white">
                  {formatDate(ipo.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">End Date</p>
                <p className="font-medium text-white">
                  {formatDate(ipo.endDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Business Owner Info */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium text-white mb-3">Business Owner</h3>
            <div className="bg-[#1A1A1A] p-3 rounded">
              <p className="text-white font-medium">{ipo.createdBy.fullName}</p>
              <p className="text-sm text-gray-400">{ipo.createdBy.email}</p>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium text-white mb-2">Description</h3>
            <p className="text-gray-300 whitespace-pre-line">
              {ipo.description}
            </p>
          </div>

          {/* Documents */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="font-medium text-white mb-2">Documents</h3>
            <a
              href={ipo.prospectusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[#FFD700] hover:text-[#FFA500]"
            >
              <span className="mr-1">📄</span>
              Download Prospectus
            </a>
          </div>

          {/* Review Info */}
          {ipo.reviewedBy && (
            <div className="border-t border-gray-700 pt-4">
              <h3 className="font-medium text-white mb-3">
                Review Information
              </h3>
              <div className="bg-gray-800 p-3 rounded space-y-2">
                <p className="text-sm">
                  <span className="text-gray-400">Reviewed By:</span>{" "}
                  <span className="text-white">{ipo.reviewedBy}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-400">Reviewed At:</span>{" "}
                  <span className="text-white">
                    {ipo.reviewedAt && formatDate(ipo.reviewedAt)}
                  </span>
                </p>
                {ipo.approvalNotes && (
                  <p className="text-sm">
                    <span className="text-gray-400">Notes:</span>{" "}
                    <span className="text-white">{ipo.approvalNotes}</span>
                  </p>
                )}
                {ipo.rejectionReason && (
                  <p className="text-sm">
                    <span className="text-gray-400">Rejection Reason:</span>{" "}
                    <span className="text-red-400">{ipo.rejectionReason}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
          >
            Close
          </button>
          {getActionButtons().map((button, index) => (
            <React.Fragment key={index}>{button}</React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
