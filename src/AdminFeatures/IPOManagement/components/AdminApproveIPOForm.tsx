import React, { useState } from "react";
import {type AdminIPO } from "../types/adminIPOtypes";

interface Props {
  ipo: AdminIPO;
  onSubmit: (data: { notes: string }) => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminApproveIPOForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      setError("Approval notes are required");
      return;
    }
    onSubmit({ notes });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">Approve IPO</h3>

        <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded">
          <p className="text-sm text-green-400">
            <span className="font-medium">IPO:</span> {ipo.companyName} (
            {ipo.symbol})
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Approval Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setError("");
              }}
              rows={4}
              className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white ${
                error ? "border-red-500" : "border-gray-700"
              }`}
              placeholder="Add any notes or conditions for approval..."
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <div className="bg-yellow-900/30 border border-yellow-800 p-3 rounded mb-4">
            <p className="text-xs text-yellow-400">
              Approving this IPO will change status to "Announced" and make it
              visible to investors.
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
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Approving..." : "Approve IPO"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
