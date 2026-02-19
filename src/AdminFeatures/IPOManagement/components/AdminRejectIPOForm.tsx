import React, { useState } from "react";
import {type AdminIPO } from "../types/adminIPOtypes";

interface Props {
  ipo: AdminIPO;
  onSubmit: (data: { reason: string; notes?: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminRejectIPOForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const rejectionReasons = [
    "Incomplete Documentation",
    "Invalid Financial Information",
    "Regulatory Non-compliance",
    "Company Verification Failed",
    "Suspicious Activity",
    "Duplicate Application",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Please select a rejection reason");
      return;
    }
    onSubmit({ reason, notes: notes || undefined });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Reject IPO</h3>

        <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded">
          <p className="text-sm text-red-400">
            <span className="font-medium">IPO:</span> {ipo.companyName} (
            {ipo.symbol})
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white ${
                error ? "border-red-500" : "border-gray-700"
              }`}
            >
              <option value="">Select a reason</option>
              {rejectionReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
              placeholder="Add any additional details..."
            />
          </div>

          <div className="bg-yellow-900/30 border border-yellow-800 p-3 rounded mb-4">
            <p className="text-xs text-yellow-400">
              Rejecting this IPO will notify the business owner with the reason
              provided.
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
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Rejecting..." : "Reject IPO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
