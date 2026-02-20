import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin mb-4"></div>
      <p className="text-gray-400">Loading remittance options...</p>
    </div>
  );
};

export default LoadingState;
