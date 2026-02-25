// src/features/publicInvestment/components/PublicInvestmentCard.tsx
import React from "react";
import {
  Building2,
  MapPin,
  Users,
  // TrendingUp,
  ChevronRight,
  Star,
  Clock,
} from "lucide-react";
import type{ PublicInvestment } from "../types/publicInvestment.types";

interface PublicInvestmentCardProps {
  investment: PublicInvestment;
  onClick: (id: string) => void;
  featured?: boolean;
}

const PublicInvestmentCard: React.FC<PublicInvestmentCardProps> = ({
  investment,
  onClick,
  featured = false,
}) => {
  const progress = (investment.currentFunding / investment.fundingGoal) * 100;
  const investorCount = investment.investments?.length || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently added";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      onClick={() => onClick(investment._id)}
      className={`group relative bg-gray-900 border rounded-2xl p-6 transition-all cursor-pointer ${
        featured
          ? "border-green-500/50 hover:border-green-500 shadow-lg shadow-green-500/10"
          : "border-gray-800 hover:border-green-500/50 hover:shadow-2xl hover:shadow-green-500/5"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black rounded-full text-xs font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-black" />
            Featured
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-medium border border-green-500/30">
            {investment.sector || "Business"}
          </span>
        </div>
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDate(investment.createdAt)}
        </span>
      </div>

      {/* Title & Company */}
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
        {investment.title}
      </h3>
      <div className="flex items-center gap-2 text-gray-400 mb-4">
        <Building2 className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm truncate">{investment.businessName}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-800/30 rounded-xl">
        <div>
          <p className="text-xs text-gray-500 mb-1">Funding Goal</p>
          <p className="text-white font-bold text-sm">
            {formatCurrency(investment.fundingGoal)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Expected ROI</p>
          <p className="text-green-400 font-bold text-sm">
            {investment.expectedReturn}%
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Min Investment</p>
          <p className="text-white font-bold text-sm">
            {formatCurrency(investment.minimumInvestment)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Period</p>
          <p className="text-white font-bold text-sm">
            {investment.investmentPeriod} months
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-400">Progress</span>
          <span className="text-green-400 font-medium">
            {progress.toFixed(1)}%
          </span>
        </div>
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">
            Raised: {formatCurrency(investment.currentFunding)}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Users className="w-3 h-3" />
            {investorCount} investors
          </span>
        </div>
      </div>

      {/* Location & CTA */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="w-4 h-4" />
          <span>Ethiopia</span>
        </div>
        <button className="text-green-400 hover:text-green-300 font-medium flex items-center gap-1 group/btn">
          View Details
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Verification Badge */}
      {investment.isVerified && (
        <div className="absolute bottom-4 left-4">
          <span className="text-xs text-green-500 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Verified
          </span>
        </div>
      )}
    </div>
  );
};

export default PublicInvestmentCard;
