// AdminFeatures/IPOManagement/components/AdminListStockForm.tsx

import React, { useState } from "react";
import {type AdminIPO } from "../types/adminIPOtypes";

interface Props {
  ipo: AdminIPO;
  onSubmit: (data: {
    listingPrice: number;
    exchange: string;
    listingDate?: string;
  }) => void;
  onCancel: () => void;
  loading: boolean;
}

export const AdminListStockForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [listingPrice, setListingPrice] = useState<number>(ipo.offerPrice);
  const [exchange, setExchange] = useState("ESX");
  const [listingDate, setListingDate] = useState("");
  const [useCustomDate, setUseCustomDate] = useState(false);
  const [errors, setErrors] = useState<{ listingPrice?: string }>({});

  const exchanges = ["ESX", "Ethiopian Stock Exchange", "Addis Stock Exchange"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!listingPrice || listingPrice <= 0) {
      setErrors({ listingPrice: "Listing price must be greater than 0" });
      return;
    }

    onSubmit({
      listingPrice,
      exchange,
      listingDate: useCustomDate ? listingDate : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-md w-full">
        <h3 className="text-xl font-bold text-white mb-4">List IPO as Stock</h3>

        <div className="mb-4 p-3 bg-indigo-900/30 border border-indigo-800 rounded">
          <p className="text-sm text-indigo-400">
            <span className="font-medium">IPO:</span> {ipo.companyName} (
            {ipo.symbol})
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Listing Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Listing Price (ETB) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={listingPrice}
              onChange={(e) => {
                setListingPrice(parseFloat(e.target.value));
                setErrors({});
              }}
              min="0.01"
              step="0.01"
              className={`w-full bg-[#1A1A1A] border rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] ${
                errors.listingPrice ? "border-red-500" : "border-gray-700"
              }`}
            />
            {errors.listingPrice && (
              <p className="text-red-500 text-xs mt-1">{errors.listingPrice}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Offer Price: ETB {ipo.offerPrice}
            </p>
          </div>

          {/* Exchange */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Exchange
            </label>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
            >
              {exchanges.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Listing Date */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={useCustomDate}
                onChange={(e) => setUseCustomDate(e.target.checked)}
                className="rounded border-gray-600 bg-[#1A1A1A] text-[#FFD700] focus:ring-[#FFD700]"
              />
              <span className="text-sm text-gray-300">
                Set custom listing date
              </span>
            </label>

            {useCustomDate && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Listing Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={listingDate}
                  onChange={(e) => setListingDate(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                />
              </div>
            )}
          </div>

          <div className="bg-green-900/30 border border-green-800 p-3 rounded mb-4">
            <p className="text-xs text-green-400">
              Listing this IPO will make shares tradable on the exchange and
              update investor portfolios. The stock will be available in market
              data endpoints.
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
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Listing..." : "List as Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
