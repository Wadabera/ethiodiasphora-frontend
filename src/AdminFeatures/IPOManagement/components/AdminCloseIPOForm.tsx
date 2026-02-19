// AdminFeatures/IPOManagement/components/AdminCloseIPOForm.tsx

import React, { useState } from "react";
import {type AdminIPO } from "../types/adminIPOtypes";

interface Props {
  ipo: AdminIPO;
  onSubmit: (data: { closeDate?: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminCloseIPOForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [closeDate, setCloseDate] = useState("");
  const [useCustomDate, setUseCustomDate] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      closeDate: useCustomDate ? closeDate : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Close IPO</h3>

        <div className="mb-4 p-3 bg-orange-900/30 border border-orange-800 rounded">
          <p className="text-sm text-orange-400">
            <span className="font-medium">IPO:</span> {ipo.companyName} (
            {ipo.symbol})
          </p>
          <div className="flex justify-between mt-2 text-xs text-orange-300">
            <span>
              Subscribed: {ipo.totalSubscribed?.toLocaleString() || 0} shares
            </span>
            <span>Applications: {ipo.totalApplications}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={(e) => setUseCustomDate(e.target.checked)}
                className="rounded border-gray-600 bg-[#1A1A1A] text-[#FFD700] focus:ring-[#FFD700]"
              />
              <span className="text-sm text-gray-300">
                Set custom close date
              </span>
            </label>

            {useCustomDate && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Close Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={closeDate}
                  onChange={(e) => setCloseDate(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
            )}
          </div>

          <div className="bg-yellow-900/30 border border-yellow-800 p-3 rounded mb-4">
            <p className="text-xs text-yellow-400">
              Closing this IPO will prevent new subscriptions. You can then
              proceed with the allotment process.
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
              className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50"
            >
              {loading ? "Closing..." : "Close IPO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
