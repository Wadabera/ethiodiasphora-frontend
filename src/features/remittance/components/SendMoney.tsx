// src/features/remittance/components/SendMoney.tsx
import React, { useState } from "react";
import {
  Send,
  Smartphone,
  QrCode,
  X,
  CheckCircle,
  Star,
} from "lucide-react";

interface SendMoneyProps {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  providerName?: string;
  onSend: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({
  amount,
  fromCurrency,
  toCurrency,
  providerName,
  
}) => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSendClick = () => {
    setShowDownloadModal(true);
  };

  const handleDownloadApp = async (platform: "ios" | "android") => {
    setDownloading(true);

    // Simulate download preparation
    setTimeout(() => {
      if (platform === "ios") {
        window.open(
          "https://apps.apple.com/app/ethio-diaspora/id123456789",
          "_blank",
        );
      } else {
        window.open(
          "https://play.google.com/store/apps/details?id=com.ethiodiaspora.app",
          "_blank",
        );
      }
      setDownloading(false);
    }, 500);
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate received amount (using a sample rate)
  const receivedAmount = amount * 131.0083;

  return (
    <>
      <button
        onClick={handleSendClick}
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold py-4 px-6 rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-yellow-500/20 mt-4"
      >
        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        Send Money
      </button>

      {/* Download App Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full p-6 relative animate-fadeIn shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setShowDownloadModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"></div>
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <Smartphone className="w-10 h-10 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white">
                Complete Your Transfer
              </h3>
              <p className="text-gray-400 mt-2">
                Download the Ethio Diaspora app to complete your secure money
                transfer
              </p>
            </div>

            {/* Transfer Summary */}
            <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">You send</span>
                <span className="text-white font-bold text-xl">
                  {formatAmount(amount)} {fromCurrency}
                </span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-400">Recipient gets</span>
                <span className="text-green-400 font-bold text-xl">
                  {formatAmount(receivedAmount)} {toCurrency}
                </span>
              </div>
              {providerName && (
                <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                  <span className="text-gray-400">Provider</span>
                  <span className="text-yellow-500 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    {providerName}
                  </span>
                </div>
              )}
            </div>

            {/* Download Options */}
            <div className="space-y-3">
              <button
                onClick={() => handleDownloadApp("android")}
                disabled={downloading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Google Play"
                      className="h-8"
                    />
                    <span>Download for Android</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownloadApp("ios")}
                disabled={downloading}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                  alt="App Store"
                  className="h-8"
                />
                <span>Download for iOS</span>
              </button>

              <button
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors py-2"
              >
                <QrCode className="w-4 h-4" />
                {showQRCode ? "Hide QR Code" : "Show QR Code"}
              </button>

              {showQRCode && (
                <div className="bg-white p-4 rounded-xl flex justify-center animate-fadeIn">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://ethiodiaspora.com/download?amount=${amount}&currency=${fromCurrency}`}
                    alt="Download QR Code"
                    className="w-32 h-32"
                  />
                </div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Secure Transfer</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span>4.8 Rating</span>
                </div>
              </div>
              <p className="text-center text-xs text-gray-600">
                10,000+ downloads • Bank-grade security
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SendMoney;
