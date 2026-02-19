// features/investments/components/InvestOnProject.tsx
import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/hooks";
import { investInOpportunity } from "../slices/PublishedInvestmentSlice";
import {
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Banknote,
  CreditCard,
  Globe2,
} from "lucide-react";

interface InvestOnProjectProps {
  investmentId: string;
  investmentTitle: string;
  minimumInvestment: number;
  maxInvestment?: number;
  fundingGoal: number;
  currentFunding: number;
  onSuccess?: () => void;
  onClose?: () => void;
}

const InvestOnProject: React.FC<InvestOnProjectProps> = ({
  investmentId,
  investmentTitle,
  minimumInvestment,
  maxInvestment,
  fundingGoal,
  currentFunding,
  onSuccess,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<number>(minimumInvestment || 100);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [notes, setNotes] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const remainingAmount = fundingGoal - currentFunding;
  const maxAllowed = maxInvestment
    ? Math.min(maxInvestment, remainingAmount)
    : remainingAmount;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAmount(value);
    setError(null);
  };

  const handleInvest = async () => {
    // Validation
    if (amount < minimumInvestment) {
      setError(`Minimum investment is $${minimumInvestment}`);
      return;
    }
    if (amount > maxAllowed) {
      setError(`Maximum investment is $${maxAllowed}`);
      return;
    }

    setIsInvesting(true);
    setError(null);

    try {
      const result = await dispatch(
        investInOpportunity({
          id: investmentId,
          amount,
          paymentMethod,
          notes: notes.trim() || `Investing in ${investmentTitle}`,
        }),
      ).unwrap();

      console.log("Investment success:", result);
      setSuccess(true);

      // Call onSuccess callback after 2 seconds
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err: any) {
      console.error("Investment failed:", err);
      setError(err || "Investment failed. Please try again.");
    } finally {
      setIsInvesting(false);
    }
  };

  const presetAmounts = [
    minimumInvestment,
    minimumInvestment * 5,
    minimumInvestment * 10,
    Math.min(minimumInvestment * 20, maxAllowed),
  ].filter((v, i, a) => v <= maxAllowed && a.indexOf(v) === i);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(val);

  if (success) {
    return (
      <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 rounded-2xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">
          Investment Submitted!
        </h3>
        <p className="text-gray-300 mb-4">
          You invested{" "}
          <span className="text-green-400 font-bold text-xl">
            {formatCurrency(amount)}
          </span>
        </p>
        <p className="text-sm text-gray-400 mb-6">
          Status:{" "}
          <span className="text-yellow-400 font-medium">Pending Approval</span>
        </p>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-gray-400">Transaction ID</p>
          <p className="text-sm font-mono text-white">
            {investmentId.slice(-12)}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Invest in</h3>
          <p className="text-gray-400 text-sm line-clamp-1">
            {investmentTitle}
          </p>
        </div>
        <div className="px-3 py-1.5 bg-yellow-400/10 border border-yellow-400/30 rounded-lg">
          <span className="text-xs font-medium text-yellow-400">
            Minimum ${minimumInvestment}
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Investment Amount
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <DollarSign className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            min={minimumInvestment}
            max={maxAllowed}
            step={100}
            className="w-full bg-gray-800 border-2 border-gray-700 text-white text-2xl font-bold pl-11 pr-4 py-4 rounded-xl focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20 transition-all"
            placeholder="Enter amount"
          />
        </div>

        {/* Preset Amounts */}
        <div className="flex flex-wrap gap-2 mt-3">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              onClick={() => setAmount(preset)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                amount === preset
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
              }`}
            >
              {formatCurrency(preset)}
            </button>
          ))}
          <span className="text-xs text-gray-500 ml-auto self-center">
            Available: {formatCurrency(remainingAmount)}
          </span>
        </div>
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-3">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setPaymentMethod("bank_transfer")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "bank_transfer"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            }`}
          >
            <Banknote
              className={`w-5 h-5 ${
                paymentMethod === "bank_transfer"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs ${
                paymentMethod === "bank_transfer"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            >
              Bank
            </span>
          </button>

          <button
            onClick={() => setPaymentMethod("card")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "card"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            }`}
          >
            <CreditCard
              className={`w-5 h-5 ${
                paymentMethod === "card" ? "text-yellow-400" : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs ${
                paymentMethod === "card" ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              Card
            </span>
          </button>

          <button
            onClick={() => setPaymentMethod("diaspora_remittance")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === "diaspora_remittance"
                ? "border-yellow-500 bg-yellow-500/10"
                : "border-gray-700 bg-gray-800/50 hover:bg-gray-800"
            }`}
          >
            <Globe2
              className={`w-5 h-5 ${
                paymentMethod === "diaspora_remittance"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            />
            <span
              className={`text-xs ${
                paymentMethod === "diaspora_remittance"
                  ? "text-yellow-400"
                  : "text-gray-400"
              }`}
            >
              Diaspora
            </span>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Note (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Excited to support Ethiopian innovation!"
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-yellow-500 resize-none"
          rows={2}
        />
      </div>

      {/* Summary */}
      <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400">Investment Amount</span>
          <span className="text-lg font-bold text-white">
            {formatCurrency(amount)}
          </span>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-700">
          <span className="text-sm text-gray-400">Expected Return (15%)</span>
          <span className="text-base font-semibold text-green-400">
            +{formatCurrency(amount * 0.15)}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleInvest}
          disabled={
            isInvesting || amount < minimumInvestment || amount > maxAllowed
          }
          className="flex-1 px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isInvesting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Confirm Investment
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        By investing, you agree to our Terms of Service and Investment Agreement
      </p>
    </div>
  );
};

export default InvestOnProject;
