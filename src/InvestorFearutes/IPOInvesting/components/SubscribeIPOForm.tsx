// InvestorFeatures/IPOInvesting/components/SubscribeIPOForm.tsx

import React, { useState, useEffect } from "react";
import type{ InvestorIPO, SubscribeRequest } from "../types/investorIPOtypes";

interface Props {
  ipo: InvestorIPO;
  onSubmit: (data: SubscribeRequest) => void;
  onCancel: () => void;
  loading: boolean;
  error?: string | null;
}

export const SubscribeIPOForm: React.FC<Props> = ({
  ipo,
  onSubmit,
  onCancel,
  loading,
  error,
}) => {
  const [lots, setLots] = useState<number>(ipo.minimumLot);
  const [quantity, setQuantity] = useState<number>(
    ipo.minimumLot * ipo.lotSize,
  );
  const [bidPrice, setBidPrice] = useState<number>(ipo.offerPrice);
  const [useBidPrice, setUseBidPrice] = useState(false);

  const minQuantity = ipo.minimumLot * ipo.lotSize;
  const maxQuantity = ipo.maximumLot * ipo.lotSize;
  const totalAmount = quantity * (useBidPrice ? bidPrice : ipo.offerPrice);

  useEffect(() => {
    setQuantity(lots * ipo.lotSize);
  }, [lots, ipo.lotSize]);

  const handleLotsChange = (newLots: number) => {
    if (newLots >= ipo.minimumLot && newLots <= ipo.maximumLot) {
      setLots(newLots);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= minQuantity && newQuantity <= maxQuantity) {
      const calculatedLots = Math.floor(newQuantity / ipo.lotSize);
      setLots(calculatedLots);
      setQuantity(calculatedLots * ipo.lotSize);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ipoId: ipo._id,
      quantity,
      bidPrice: useBidPrice ? bidPrice : undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#2A2A2A] rounded-lg border border-gray-700 p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold text-white mb-4">
          Subscribe to {ipo.symbol}
        </h3>

        {/* IPO Summary */}
        <div className="bg-[#1A1A1A] p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Company</span>
            <span className="text-white font-medium">{ipo.companyName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-400">Offer Price</span>
            <span className="text-[#FFD700] font-medium">
              ETB {ipo.offerPrice}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Lot Size</span>
            <span className="text-white">{ipo.lotSize} shares</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-900/30 border border-red-800 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Lots Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Number of Lots
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleLotsChange(lots - 1)}
                disabled={lots <= ipo.minimumLot}
                className="w-10 h-10 bg-[#1A1A1A] border border-gray-700 rounded-md text-white disabled:opacity-50 hover:bg-gray-800"
              >
                -
              </button>
              <input
                type="number"
                value={lots}
                onChange={(e) =>
                  handleLotsChange(parseInt(e.target.value) || ipo.minimumLot)
                }
                min={ipo.minimumLot}
                max={ipo.maximumLot}
                className="w-20 bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white text-center"
              />
              <button
                type="button"
                onClick={() => handleLotsChange(lots + 1)}
                disabled={lots >= ipo.maximumLot}
                className="w-10 h-10 bg-[#1A1A1A] border border-gray-700 rounded-md text-white disabled:opacity-50 hover:bg-gray-800"
              >
                +
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Min: {ipo.minimumLot} lots · Max: {ipo.maximumLot} lots
            </p>
          </div>

          {/* Quantity Display */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Total Shares
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || minQuantity)
              }
              min={minQuantity}
              max={maxQuantity}
              step={ipo.lotSize}
              className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
            />
          </div>

          {/* Bid Price Option */}
          <div className="mb-4">
            <label className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                checked={useBidPrice}
                onChange={(e) => setUseBidPrice(e.target.checked)}
                className="rounded border-gray-600 bg-[#1A1A1A] text-[#FFD700] focus:ring-[#FFD700]"
              />
              <span className="text-sm text-gray-300">
                Place bid above offer price
              </span>
            </label>

            {useBidPrice && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Bid Price (ETB)
                </label>
                <input
                  type="number"
                  value={bidPrice}
                  onChange={(e) =>
                    setBidPrice(parseFloat(e.target.value) || ipo.offerPrice)
                  }
                  min={ipo.offerPrice}
                  step="0.01"
                  className="w-full bg-[#1A1A1A] border border-gray-700 rounded-md px-3 py-2 text-white"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Higher bids may get priority in allotment
                </p>
              </div>
            )}
          </div>

          {/* Total Amount */}
          <div className="bg-[#1A1A1A] p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Amount</span>
              <span className="text-2xl font-bold text-[#FFD700]">
                ETB {totalAmount.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {lots} lots × {ipo.lotSize} shares × ETB{" "}
              {useBidPrice ? bidPrice : ipo.offerPrice}
            </p>
          </div>

          {/* Terms */}
          <div className="bg-yellow-900/30 border border-yellow-800 p-3 rounded mb-4">
            <p className="text-xs text-yellow-400">
              By subscribing, you agree to the terms and conditions. Funds will
              be deducted from your wallet upon allotment.
            </p>
          </div>

          {/* Actions */}
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
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading
                ? "Processing..."
                : `Subscribe · ETB ${totalAmount.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
