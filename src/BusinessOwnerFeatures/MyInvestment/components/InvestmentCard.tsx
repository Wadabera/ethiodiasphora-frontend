// features/investments/components/InvestmentCard.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Investment } from "@/types/index";
import {
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  Building,
  ChevronRight,
  Share2,
  Heart,
} from "lucide-react";

interface InvestmentCardProps {
  investment: Investment;
  showActions?: boolean;
  isNew?: boolean;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  showActions = true,
  isNew = false,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (investment.fundingGoal === 0) return 0;
    const progress = (investment.currentFunding / investment.fundingGoal) * 100;
    return Math.min(100, Math.round(progress));
  };

  // Get status color and icon
  const getStatusConfig = () => {
    switch (investment.status) {
      case "published":
      case "active":
        return {
          color: "bg-green-500/20 text-green-400 border-green-500/30",
          icon: <TrendingUp className="w-3.5 h-3.5" />,
          label: "Active",
        };
      case "pending":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Pending",
        };
      case "draft":
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Draft",
        };
      case "completed":
        return {
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: "Completed",
        };
      case "rejected":
        return {
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "Rejected",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: null,
          label: investment.status,
        };
    }
  };

  // Get my investment amount if I've invested
  const getMyInvestment = () => {
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");
    const myInvestment = investment.investments?.find(
      (inv: any) => inv.investorId?._id === userId,
    );
    return myInvestment;
  };

  const progress = calculateProgress();
  const statusConfig = getStatusConfig();
  const myInvestment = getMyInvestment();
  const isCreator =
    investment.businessOwnerId ===
    (localStorage.getItem("userId") || sessionStorage.getItem("userId"));

  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 hover:scale-[1.02] relative ${
        isNew ? "ring-2 ring-yellow-500/50" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* New Badge */}
      {isNew && (
        <div className="absolute -top-2 -right-2 animate-pulse">
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded-full shadow-lg">
            NEW
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusConfig.color}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>

            {isCreator && (
              <span className="px-2.5 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30">
                <Building className="w-3 h-3 inline mr-1" />
                Creator
              </span>
            )}

            {myInvestment && (
              <span className="px-2.5 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30">
                <DollarSign className="w-3 h-3 inline mr-1" />
                Investor
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white group cursor-pointer">
            {investment.title}
            <ChevronRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>

          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-400 text-sm">{investment.businessName}</p>
            <span className="text-gray-600">•</span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {investment.location}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl transition-colors ${
              isLiked
                ? "bg-red-500/20 text-red-400"
                : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? "fill-red-400" : ""}`} />
          </button>
          <button className="p-2 rounded-xl bg-gray-800/50 text-gray-400 hover:bg-gray-800 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 mb-6 line-clamp-2">
        {investment.description}
      </p>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-sm text-gray-400">Expected ROI</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {investment.expectedReturn}%
          </p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-sm text-gray-400">Duration</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {investment.investmentPeriod} months
          </p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-sm text-gray-400">Investors</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {investment.interestedInvestors || 0}
          </p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-sm text-gray-400">Risk</span>
          </div>
          <div className="text-2xl font-bold text-white capitalize">
            {investment.riskFactors?.toLowerCase() || "Medium"}
          </div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-sm text-gray-400">Funding Progress</p>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <div className="text-white font-bold">
                ETB {investment.currentFunding.toLocaleString()}
              </div>
              <span className="text-gray-400">/</span>
              <span className="text-white">
                ETB {investment.fundingGoal.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold text-white">{progress}%</span>
            <p className="text-xs text-gray-500">funded</p>
          </div>
        </div>

        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: isHovered
                ? "linear-gradient(to right, #f59e0b, #d97706)"
                : "linear-gradient(to right, #eab308, #ca8a04)",
            }}
          />
        </div>

        {/* My Investment Display */}
        {myInvestment && (
          <div className="mt-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">
                Your investment:{" "}
                <span className="font-bold">
                  ETB {myInvestment.amount?.toLocaleString() || "0"}
                </span>
              </span>
              <span
                className={`ml-auto text-xs px-2 py-1 rounded-full ${
                  myInvestment.status === "pending"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {myInvestment.status}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-800">
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/investments/${investment._id}`)}
              className="px-4 py-2.5 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-all flex items-center gap-2 group"
            >
              <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Details
            </button>

            {isCreator && investment.status === "pending" && (
              <button
                onClick={() =>
                  navigate(`/business/investments/edit/${investment._id}`)
                }
                className="px-4 py-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-all flex items-center gap-2 group"
              >
                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Edit
              </button>
            )}
          </div>

          <button
            onClick={() => navigate(`/investments/${investment._id}/invest`)}
            className="px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-xl hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 group shadow-lg hover:shadow-yellow-500/25"
            disabled={investment.status !== "published"}
          >
            {myInvestment ? "Add More" : "Invest Now"}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
};

export default InvestmentCard;
