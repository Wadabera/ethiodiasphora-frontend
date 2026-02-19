import React from "react";
import {type AdminIPO } from "../types/adminIPOtypes";
import { AdminIPOStatusBadge } from "./AdminIPOStatusBadge";

interface Props {
  ipos: AdminIPO[];
  loading: boolean;
  onViewDetails: (ipo: AdminIPO) => void;
  onApprove?: (ipo: AdminIPO) => void;
  onReject?: (ipo: AdminIPO) => void;
  onOpen?: (ipo: AdminIPO) => void;
  onClose?: (ipo: AdminIPO) => void;
  onAllot?: (ipo: AdminIPO) => void;
  onList?: (ipo: AdminIPO) => void;
  showActions?: boolean;
}

export const AdminIPOTable: React.FC<Props> = ({
  ipos = [],
  loading,
  onViewDetails,
  onApprove,
  onReject,
  onOpen,
  onClose,
  onAllot,
  onList,
  showActions = true,
}) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `ETB ${amount.toLocaleString()}`;
  };

  const getAvailableActions = (ipo: AdminIPO) => {
    const actions = [];

    switch (ipo.status) {
      case "pending_approval":
        actions.push(
          {
            label: "Approve",
            onClick: onApprove,
            color: "text-green-500 hover:text-green-400",
          },
          {
            label: "Reject",
            onClick: onReject,
            color: "text-red-500 hover:text-red-400",
          },
        );
        break;
      case "announced":
        actions.push({
          label: "Open",
          onClick: onOpen,
          color: "text-green-500 hover:text-green-400",
        });
        break;
      case "open":
        actions.push({
          label: "Close",
          onClick: onClose,
          color: "text-orange-500 hover:text-orange-400",
        });
        break;
      case "closed":
        actions.push({
          label: "Process Allotment",
          onClick: onAllot,
          color: "text-purple-500 hover:text-purple-400",
        });
        break;
      case "allotted":
        actions.push({
          label: "List as Stock",
          onClick: onList,
          color: "text-indigo-500 hover:text-indigo-400",
        });
        break;
    }

    return actions;
  };

  if (loading) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-4">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse h-12 bg-gray-800 rounded"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (ipos.length === 0) {
    return (
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-12 text-center">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-xl font-medium text-white mb-2">No IPOs Found</h3>
        <p className="text-gray-400">
          There are no IPOs matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1A1A1A] border-b border-gray-700">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Company
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Symbol
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Offer Price
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Issue Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Subscription
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">
                Business Owner
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {ipos.map((ipo) => {
              const actions = getAvailableActions(ipo);

              return (
                <tr
                  key={ipo._id}
                  className="hover:bg-[#1A1A1A] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">
                      {ipo.companyName}
                    </div>
                    <div className="text-xs text-gray-500">{ipo.sector}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-white">
                    {ipo.symbol}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatCurrency(ipo.offerPrice)}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {formatCurrency(ipo.issueSize)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-white">
                      {ipo.totalSubscribed?.toLocaleString() || 0} shares
                    </div>
                    <div className="text-xs text-gray-500">
                      {ipo.subscriptionRatio}x
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <AdminIPOStatusBadge status={ipo.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-white">
                      {ipo.createdBy?.fullName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {ipo.createdBy?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => onViewDetails(ipo)}
                        className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium"
                      >
                        View
                      </button>

                      {showActions &&
                        actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => action.onClick?.(ipo)}
                            className={`${action.color} text-sm font-medium`}
                          >
                            {action.label}
                          </button>
                        ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
