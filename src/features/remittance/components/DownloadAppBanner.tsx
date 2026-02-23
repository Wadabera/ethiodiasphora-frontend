// src/features/remittance/components/DownloadAppBanner.tsx
import React from "react";
import { Smartphone, Download, Star,  } from "lucide-react";

interface DownloadAppBannerProps {
  onDownload: () => void;
}

const DownloadAppBanner: React.FC<DownloadAppBannerProps> = ({
  onDownload,
}) => {
  return (
    <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 rounded-2xl border border-yellow-500/20 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-black" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Get the Ethio Diaspora App
              <span className="bg-yellow-500/20 text-yellow-500 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-500" /> 4.8
              </span>
            </h3>
            <p className="text-gray-400 text-sm">
              Send money faster, track transfers, and get exclusive rates on the
              go
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                10k+ downloads
              </span>
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                Free
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onDownload}
          className="group relative overflow-hidden bg-yellow-500 text-black px-8 py-4 rounded-xl font-semibold hover:bg-yellow-400 transition-all flex items-center gap-2"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download App
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>

      {/* Store badges for desktop */}
      <div className="mt-4 flex items-center justify-center md:justify-start gap-3">
        <a
          href="https://play.google.com/store/apps/details?id=com.ethiodiaspora.app"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
            alt="Google Play"
            className="h-6 w-auto"
          />
        </a>
        <a
          href="https://apps.apple.com/app/ethio-diaspora/id123456789"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
            alt="App Store"
            className="h-6 w-auto"
          />
        </a>
      </div>
    </div>
  );
};

export default DownloadAppBanner;
