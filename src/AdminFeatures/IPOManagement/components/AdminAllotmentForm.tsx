// AdminFeatures/IPOManagement/components/AdminAllotmentForm.tsx

import React, { useState,  } from "react";
import {type AdminIPO } from "../types/adminIPOtypes";

interface Props {
  ipo: AdminIPO;
  onSubmit: (data: {
    method: "proportional" | "lottery" | "priority";
    notes?: string;
  }) => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminAllotmentForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [method, setMethod] = useState<"proportional" | "lottery" | "priority">(
    "proportional",
  );
  const [notes, setNotes] = useState("");

  const totalShares = ipo.totalShares;
  const subscribedShares = ipo.totalSubscribed || 0;
  const oversubscribed = subscribedShares > totalShares;
  const calculatedRatio = oversubscribed
    ? (totalShares / subscribedShares) * 100
    : 100;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-white mb-4">
          Process IPO Allotment
        </h3>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#1A1A1A] p-3 rounded">
            <p className="text-sm text-gray-400">Available Shares</p>
            <p className="text-xl font-bold text-white">
              {totalShares.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-3 rounded">
            <p className="text-sm text-gray-400">Subscribed Shares</p>
            <p className="text-xl font-bold text-white">
              {subscribedShares.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-3 rounded">
            <p className="text-sm text-gray-400">Subscription Ratio</p>
            <p className="text-xl font-bold text-white">
              {ipo.subscriptionRatio}x
            </p>
          </div>
          <div className="bg-[#1A1A1A] p-3 rounded">
            <p className="text-sm text-gray-400">Applications</p>
            <p className="text-xl font-bold text-white">
              {ipo.totalApplications}
            </p>
          </div>
        </div>

        {oversubscribed && (
          <div className="bg-yellow-900/30 border border-yellow-800 p-4 rounded-lg mb-6">
            <p className="text-yellow-400 font-medium">
              IPO is oversubscribed!
            </p>
            <p className="text-sm text-yellow-300 mt-1">
              Shares will be allotted based on the selected method.
              {method === "proportional" &&
                ` Proportional ratio: ${calculatedRatio.toFixed(2)}%`}
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit({ method, notes });
          }}
        >
          {/* Allotment Method */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Allotment Method
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-[#1A1A1A] rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800">
                <input
                  type="radio"
                  checked={method === "proportional"}
                  onChange={() => setMethod("proportional")}
                  className="text-[#FFD700] focus:ring-[#FFD700] bg-[#1A1A1A] border-gray-600"
                />
                <div>
                  <span className="text-white font-medium">
                    Proportional Allotment
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    All investors receive shares proportionally to their
                    application
                    {oversubscribed &&
                      ` (${calculatedRatio.toFixed(2)}% of applied shares)`}
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-[#1A1A1A] rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800">
                <input
                  type="radio"
                  checked={method === "lottery"}
                  onChange={() => setMethod("lottery")}
                  className="text-[#FFD700] focus:ring-[#FFD700] bg-[#1A1A1A] border-gray-600"
                />
                <div>
                  <span className="text-white font-medium">Lottery System</span>
                  <p className="text-xs text-gray-400 mt-1">
                    Random selection among applicants, winners get full lots
                  </p>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 bg-[#1A1A1A] rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-800">
                <input
                  type="radio"
                  checked={method === "priority"}
                  onChange={() => setMethod("priority")}
                  className="text-[#FFD700] focus:ring-[#FFD700] bg-[#1A1A1A] border-gray-600"
                />
                <div>
                  <span className="text-white font-medium">Priority Based</span>
                  <p className="text-xs text-gray-400 mt-1">
                    Priority given to early applicants and larger investors
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
              placeholder="Add any notes about the allotment process..."
            />
          </div>

          <div className="bg-purple-900/30 border border-purple-800 p-3 rounded mb-4">
            <p className="text-xs text-purple-400">
              Allotment will calculate shares for each applicant, process
              refunds for unallotted amounts, and send notifications to
              investors.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Process Allotment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
