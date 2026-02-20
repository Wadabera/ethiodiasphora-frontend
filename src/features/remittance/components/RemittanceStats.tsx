// features/remittance/components/RemittanceStats.tsx
import React from "react";

interface RemittanceStatsProps {
  totalProviders: number;
  bestRate: number;
  fastestTime: string;
  totalVolume?: string;
}

const RemittanceStats: React.FC<RemittanceStatsProps> = ({
  totalProviders,
  bestRate,
  fastestTime,
  totalVolume = "$5.7B",
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20">
        <p className="text-3xl font-bold text-[#FFD700]">{totalProviders}</p>
        <p className="text-sm text-gray-300 mt-2">Active Providers</p>
        <p className="text-xs text-yellow-400 mt-1">Worldwide</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20">
        <p className="text-3xl font-bold text-[#FFD700]">{bestRate}</p>
        <p className="text-sm text-gray-300 mt-2">Best Rate</p>
        <p className="text-xs text-yellow-400 mt-1">ETB per USD</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20">
        <p className="text-3xl font-bold text-[#FFD700]">{fastestTime}</p>
        <p className="text-sm text-gray-300 mt-2">Fastest Delivery</p>
        <p className="text-xs text-yellow-400 mt-1">Instant transfer</p>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-yellow-500/20">
        <p className="text-3xl font-bold text-[#FFD700]">{totalVolume}</p>
        <p className="text-sm text-gray-300 mt-2">Annual Remittance</p>
        <p className="text-xs text-yellow-400 mt-1">to Ethiopia</p>
      </div>
    </div>
  );
};

export default RemittanceStats;
