// src/InvestorFearutes/IPOInvesting/components/SubscriptionDetailsModal.tsx

import React from "react";
import { X, Calendar, CheckCircle, XCircle } from "lucide-react";
import { SubscriptionStatusBadge } from "./SubscriptionStatusBadge";

interface SubscriptionDetailsModalProps {
  subscription: any;
  isOpen: boolean;
  onClose: () => void;
}

const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  subscription,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !subscription) return null;

  const formatCurrency = (amount: number): string => {
    if (!amount && amount !== 0) return "ETB 0.00";
    return `ETB ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const formatNumber = (num: number): string => {
    if (!num && num !== 0) return "0";
    return num.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Subscription Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#FFD700] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Company Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {subscription.companyName}
              </h3>
              <p className="text-sm text-[#FFD700]">{subscription.symbol}</p>
            </div>
            <SubscriptionStatusBadge status={subscription.status} />
          </div>

          {/* Application Number */}
          <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400">Application Number</p>
            <p className="text-lg font-mono font-bold text-[#FFD700]">
              {subscription.applicationNumber}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Quantity</p>
              <p className="text-lg font-medium text-white">
                {formatNumber(subscription.quantity)} shares
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Price per Share</p>
              <p className="text-lg font-medium text-white">
                {formatCurrency(subscription.pricePerShare)}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Total Amount</p>
              <p className="text-lg font-medium text-white">
                {formatCurrency(subscription.totalAmount)}
              </p>
            </div>
            <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">Applied Date</p>
              <p className="text-sm text-white">
                {formatDate(subscription.createdAt)}
              </p>
            </div>
          </div>

          {/* Allotment Details */}
          {(subscription.status === "allotted" ||
            subscription.status === "partial") && (
            <div className="bg-green-900/10 border border-green-800/30 p-4 rounded-lg">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-400" />
                Allotment Details
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-400">Allotted Shares</p>
                  <p className="text-lg font-medium text-green-400">
                    {formatNumber(subscription.allottedShares)} shares
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Allotted Amount</p>
                  <p className="text-lg font-medium text-green-400">
                    {formatCurrency(subscription.allottedAmount)}
                  </p>
                </div>
                {subscription.refundAmount && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-400">Refund Amount</p>
                    <p className="text-lg font-medium text-blue-400">
                      {formatCurrency(subscription.refundAmount)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {subscription.status === "rejected" && (
            <div className="bg-red-900/10 border border-red-800/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <XCircle size={16} />
                <h4 className="font-medium">Application Rejected</h4>
              </div>
              <p className="text-sm text-red-300">
                Your application was not successful in the allotment process.
              </p>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="font-medium text-white mb-3 flex items-center gap-2">
              <Calendar size={16} className="text-[#FFD700]" />
              Timeline
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Applied:</span>
                <span className="text-white">
                  {formatDate(subscription.createdAt)}
                </span>
              </div>
              {subscription.allotmentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Allotted:</span>
                  <span className="text-white">
                    {formatDate(subscription.allotmentDate)}
                  </span>
                </div>
              )}
              {subscription.updatedAt !== subscription.createdAt && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Updated:</span>
                  <span className="text-white">
                    {formatDate(subscription.updatedAt)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#FFD700] text-gray-900 rounded-lg hover:bg-[#FFA500] transition-colors font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetailsModal;
