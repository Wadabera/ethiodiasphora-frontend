import React, { useState } from "react";
import {
  Send,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Building,
  Smartphone,
  ShieldCheck,
  RefreshCw,
  Copy,
  Receipt,
} from "lucide-react";

export default function Remittance() {
  const [sendAmount, setSendAmount] = useState<number>(500);
  const [sendCurrency, setSendCurrency] = useState<"USD" | "EUR" | "GBP" | "CAD">("USD");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientBank, setRecipientBank] = useState("Commercial Bank of Ethiopia (CBE)");
  const [accountNumber, setAccountNumber] = useState("");
  const [transferPurpose, setTransferPurpose] = useState("Investment Capital & Family Support");
  const [deliveryMethod, setDeliveryMethod] = useState<"bank" | "telebirr">("bank");
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [txId, setTxId] = useState("");

  const exchangeRates: Record<string, number> = {
    USD: 142.5,
    EUR: 154.2,
    GBP: 182.1,
    CAD: 104.8,
  };

  const currentRate = exchangeRates[sendCurrency] || 142.5;
  const receiveAmount = (sendAmount * currentRate).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const recentTransfers = [
    {
      id: "ETH-TX-98442",
      recipient: "Dawit Haile (Business Account)",
      bank: "CBE Commercial Bank",
      amountUSD: "$2,500.00",
      amountETB: "356,250.00 ETB",
      date: "Sep 28, 2026",
      status: "Completed",
    },
    {
      id: "ETH-TX-98110",
      recipient: "Abebech Tadesse",
      bank: "Telebirr Mobile Wallet",
      amountUSD: "$400.00",
      amountETB: "57,000.00 ETB",
      date: "Sep 24, 2026",
      status: "Completed",
    },
    {
      id: "ETH-TX-97554",
      recipient: "Addis Ababa Realty Escrow",
      bank: "Awash International Bank",
      amountUSD: "$5,000.00",
      amountETB: "712,500.00 ETB",
      date: "Sep 18, 2026",
      status: "Completed",
    },
  ];

  const fillDemoTransfer = () => {
    setSendAmount(1000);
    setSendCurrency("USD");
    setRecipientName("Dawit Haile");
    setRecipientPhone("+251911000002");
    setRecipientBank("Commercial Bank of Ethiopia (CBE)");
    setAccountNumber("1000293849182");
    setDeliveryMethod("bank");
    setTransferPurpose("Agricultural Project Expansion Capital");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `ETH-TX-${Math.floor(10000 + Math.random() * 90000)}`;
    setTxId(generatedId);
    setTransferSuccess(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-yellow-500/15 via-amber-500/10 to-transparent border border-[#FFD700]/30 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFD700]/15 text-[#FFD700] text-xs font-semibold border border-[#FFD700]/30 mb-3">
              <Send size={13} /> Official National Bank Diaspora Remittance
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Fast, Low-Cost Diaspora Money Transfer
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Send foreign currency directly to Ethiopian bank accounts (CBE, Awash, Dashen) or Telebirr with zero hidden fees and competitive official FX incentives.
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoTransfer}
            className="px-5 py-2.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer self-start"
          >
            <Sparkles size={15} /> Demo 1-Click Transfer
          </button>
        </div>
      </div>

      {/* Main Grid: Calculator & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Calculator (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign size={20} className="text-[#FFD700]" /> Send Remittance
            </h2>
            <span className="text-xs text-green-400 font-semibold flex items-center gap-1">
              <ShieldCheck size={14} /> National Bank Regulated
            </span>
          </div>

          {transferSuccess ? (
            <div className="p-8 bg-green-500/10 border border-green-500/30 rounded-2xl text-center space-y-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-white">Transfer Initiated!</h3>
              <p className="text-gray-300 text-xs max-w-md mx-auto">
                Your remittance of <strong className="text-white">${sendAmount} {sendCurrency}</strong> is being processed to <strong className="text-white">{recipientName}</strong> ({receiveAmount} ETB).
              </p>
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-gray-800 inline-block font-mono text-sm text-[#FFD700]">
                Tracking Ref: {txId}
              </div>
              <div>
                <button
                  onClick={() => setTransferSuccess(false)}
                  className="px-6 py-2.5 bg-[#FFD700] text-black font-bold rounded-xl text-xs hover:opacity-90 transition-all cursor-pointer"
                >
                  Send Another Transfer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-6">
              {/* FX Amount Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    You Send
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="10"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(parseFloat(e.target.value) || 0)}
                      required
                      className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-xl py-3 pl-3 pr-20 text-base font-bold outline-none focus:border-[#FFD700]"
                    />
                    <select
                      value={sendCurrency}
                      onChange={(e) => setSendCurrency(e.target.value as any)}
                      className="absolute right-2 bg-gray-800 border border-gray-700 text-white text-xs font-semibold py-1.5 px-2 rounded-lg outline-none cursor-pointer"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    Recipient Gets (ETB)
                  </label>
                  <div className="w-full bg-[#141414] border border-gray-800 text-[#FFD700] rounded-xl py-3 px-4 text-base font-bold flex items-center justify-between">
                    <span>{receiveAmount}</span>
                    <span className="text-xs text-gray-400">ETB</span>
                  </div>
                </div>
              </div>

              {/* Rate & Fee Notice */}
              <div className="p-3 bg-[#1A1A1A] rounded-xl border border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-400">
                  Rate: 1 {sendCurrency} = <strong className="text-white">{currentRate.toFixed(2)} ETB</strong>
                </span>
                <span className="text-green-400 font-bold">Transfer Fee: $0.00 (Promo)</span>
              </div>

              {/* Delivery Method */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Delivery Destination
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("bank")}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      deliveryMethod === "bank"
                        ? "bg-[#FFD700]/15 border-[#FFD700] text-white"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <Building size={18} className="text-[#FFD700]" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Bank Account</div>
                      <div className="text-[10px] text-gray-400">CBE, Awash, Dashen</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMethod("telebirr")}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                      deliveryMethod === "telebirr"
                        ? "bg-[#FFD700]/15 border-[#FFD700] text-white"
                        : "bg-[#1A1A1A] border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <Smartphone size={18} className="text-[#FFD700]" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Telebirr Wallet</div>
                      <div className="text-[10px] text-gray-400">Instant Mobile Credit</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's full legal name"
                    required
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Recipient Phone Number
                    </label>
                    <input
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="+251 9..."
                      required
                      className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      {deliveryMethod === "bank" ? "Bank Name" : "Wallet Service"}
                    </label>
                    {deliveryMethod === "bank" ? (
                      <select
                        value={recipientBank}
                        onChange={(e) => setRecipientBank(e.target.value)}
                        className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                      >
                        <option value="Commercial Bank of Ethiopia (CBE)">
                          Commercial Bank of Ethiopia (CBE)
                        </option>
                        <option value="Awash International Bank">Awash International Bank</option>
                        <option value="Dashen Bank">Dashen Bank</option>
                        <option value="Bank of Abyssinia">Bank of Abyssinia</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        readOnly
                        value="Telebirr (Ethio Telecom Mobile Money)"
                        className="w-full bg-[#141414] border border-gray-800 text-gray-300 rounded-lg p-2.5 text-xs outline-none"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1">
                    {deliveryMethod === "bank" ? "Account Number (IBAN / Local)" : "Telebirr Mobile Phone"}
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder={deliveryMethod === "bank" ? "1000..." : "+2519..."}
                    required
                    className="w-full bg-[#1A1A1A] border border-gray-700 text-white rounded-lg p-2.5 text-xs outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD700] to-yellow-500 hover:from-yellow-400 hover:to-[#FFD700] text-black font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={16} /> Send ${sendAmount} {sendCurrency} Now
              </button>
            </form>
          )}
        </div>

        {/* Right Column: History & Summary (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Summary Card */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6 space-y-4">
            <h3 className="font-bold text-white text-sm pb-2 border-b border-gray-800 flex items-center gap-2">
              <Receipt size={16} className="text-[#FFD700]" /> Why Transfer with EthioDiaspora?
            </h3>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>National Bank Approved:</strong> Direct integration with CBE and EthSwitch for instant local clearing.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Direct Investment Conversion:</strong> Seamlessly channel remittances into equity investments in vetted Ethiopian companies.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Real-time Notifications:</strong> SMS and email alert dispatched to both sender and recipient instantly.
                </span>
              </div>
            </div>
          </div>

          {/* Recent Transfers */}
          <div className="bg-[#0F0F0F] border border-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-white text-sm mb-4">Recent Remittance Transfers</h3>
            <div className="space-y-3">
              {recentTransfers.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-[#141414] border border-gray-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-white truncate">{item.recipient}</span>
                    <span className="text-green-400 font-bold">{item.amountUSD}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{item.bank}</span>
                    <span className="text-gray-300 font-medium">{item.amountETB}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1 border-t border-gray-800/60">
                    <span>{item.date}</span>
                    <span className="text-green-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={10} /> {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}