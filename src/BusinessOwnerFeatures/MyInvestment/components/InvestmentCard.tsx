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
  Edit3,
  // UserCheck,
  FileText,
  // AlertTriangle,
} from "lucide-react";

interface InvestmentCardProps {
  investment: Investment;
  showActions?: boolean;
  isNew?: boolean;
  showInvestorCount?: boolean;
  onViewInvestors?: () => void;
}

const InvestmentCard: React.FC<InvestmentCardProps> = ({
  investment,
  showActions = true,
  isNew = false,
  showInvestorCount = true,
  onViewInvestors,
}) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showInvestorsPreview, setShowInvestorsPreview] = useState(false);

  // Calculate progress percentage
  const calculateProgress = () => {
    if (investment.fundingGoal === 0) return 0;
    const progress = (investment.currentFunding / investment.fundingGoal) * 100;
    return Math.min(100, Math.round(progress * 10) / 10);
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
          bg: "from-green-500 to-green-600",
        };
      case "pending":
        return {
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Pending Approval",
          bg: "from-yellow-500 to-yellow-600",
        };
      case "draft":
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: <FileText className="w-3.5 h-3.5" />,
          label: "Draft",
          bg: "from-gray-500 to-gray-600",
        };
      case "completed":
        return {
          color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: "Completed",
          bg: "from-blue-500 to-blue-600",
        };
      case "rejected":
        return {
          color: "bg-red-500/20 text-red-400 border-red-500/30",
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "Rejected",
          bg: "from-red-500 to-red-600",
        };
      default:
        return {
          color: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          icon: null,
          label: investment.status,
          bg: "from-gray-500 to-gray-600",
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

  // Get investor count
  const investorCount =
    investment.totalInvestors || investment.investments?.length || 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get time remaining
  const getTimeRemaining = () => {
    if (!investment.createdAt) return "Ongoing";
    const startDate = new Date(investment.createdAt);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (investment.investmentPeriod || 12));

    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Ended";
    if (diffDays < 30) return `${diffDays} days left`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months left`;
    return `${Math.floor(diffDays / 365)} years left`;
  };

  return (
    <div
      className={`bg-gray-900/50 backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl relative ${
        isNew ? "ring-2 ring-yellow-500/50" : ""
      } ${
        isCreator
          ? "border-yellow-500/30 hover:border-yellow-500/50 hover:shadow-yellow-500/10"
          : "border-gray-800 hover:border-yellow-500/50 hover:shadow-yellow-500/10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* New Badge */}
      {isNew && (
        <div className="absolute -top-2 -right-2 animate-pulse z-10">
          <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-xs font-bold rounded-full shadow-lg">
            NEW
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2 mb-2">
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${statusConfig.color}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>

            {isCreator && (
              <span className="px-2.5 py-1.5 bg-yellow-500/20 text-yellow-400 text-xs font-medium rounded-full border border-yellow-500/30 flex items-center gap-1">
                <Building className="w-3 h-3" />
                Owner
              </span>
            )}

            {myInvestment && (
              <span className="px-2.5 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full border border-blue-500/30 flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Invested
              </span>
            )}

            {investment.isVerified && (
              <span className="px-2.5 py-1.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full border border-green-500/30 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          <h3
            className="text-xl font-bold text-white group cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => navigate(`/investments/${investment._id}`)}
          >
            {investment.title}
            <ChevronRight className="w-4 h-4 inline ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>

          <div className="flex items-center flex-wrap gap-2 mt-1">
            <p className="text-gray-400 text-sm flex items-center gap-1">
              <Building className="w-3.5 h-3.5" />
              {investment.businessName}
            </p>
            <span className="text-gray-600 text-xs">•</span>
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              {investment.location || "Ethiopia"}
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
      <p className="text-gray-300 mb-6 line-clamp-2 text-sm leading-relaxed">
        {investment.description}
      </p>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Percent className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-xs text-gray-400">Expected ROI</span>
          </div>
          <p className="text-xl font-bold text-white">
            {investment.expectedReturn}%
          </p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-xs text-gray-400">Duration</span>
          </div>
          <p className="text-xl font-bold text-white">
            {investment.investmentPeriod}m
          </p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-xs text-gray-400">Investors</span>
          </div>
          <p className="text-xl font-bold text-white">{investorCount}</p>
        </div>

        <div className="bg-gray-800/30 rounded-xl p-3 hover:bg-gray-800/50 transition-colors group">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
            <span className="text-xs text-gray-400">Risk</span>
          </div>
          <div className="text-xl font-bold text-white capitalize">
            {investment.riskFactors?.toLowerCase() || "Medium"}
          </div>
        </div>
      </div>

      {/* Funding Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div>
            <p className="text-xs text-gray-400 mb-1">Funding Progress</p>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-white font-bold">
                {formatCurrency(investment.currentFunding || 0)}
              </span>
              <span className="text-gray-400 text-sm">/</span>
              <span className="text-white text-sm">
                {formatCurrency(investment.fundingGoal)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-white">{progress}%</span>
            <p className="text-xs text-gray-500">funded</p>
          </div>
        </div>

        <div className="h-2.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, ${
                isCreator ? "#eab308, #ca8a04" : "#10b981, #059669"
              })`,
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-500">
            Min: {formatCurrency(investment.minimumInvestment)}
          </span>
          <span className="text-xs text-gray-500">{getTimeRemaining()}</span>
        </div>

        {/* My Investment Display */}
        {myInvestment && (
          <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-blue-300">
                  Your investment:{" "}
                  <span className="font-bold text-blue-400">
                    {formatCurrency(myInvestment.amount || 0)}
                  </span>
                </span>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
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

      {/* Investors Preview - Only for business owners */}
      {isCreator && showInvestorCount && investorCount > 0 && (
        <div className="mb-4 p-3 bg-purple-500/5 border border-purple-500/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">
                {investorCount} Investor{investorCount !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (onViewInvestors) {
                  onViewInvestors();
                }
              }}
              className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
            >
              View Details
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Recent investors preview */}
          {investment.investments && investment.investments.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              {investment.investments.slice(0, 3).map((inv, idx) => (
                <div
                  key={idx}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white"
                  title={`${(inv.investorId as any)?.name || "Anonymous"} - ${formatCurrency(inv.amount)}`}
                >
                  {(
                    (inv.investorId as any)?.name?.charAt(0) || "I"
                  ).toUpperCase()}
                </div>
              ))}
              {investment.investments.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] text-white">
                  +{investment.investments.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-gray-800">
          <button
            onClick={() => navigate(`/investments/${investment._id}`)}
            className="flex-1 px-4 py-2.5 bg-gray-800/50 text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-all flex items-center justify-center gap-2 group"
          >
            <Eye className="w-4 h-4 group-hover:scale-110 transition-transform" />
            View Details
          </button>

          {isCreator && investment.status === "pending" && (
            <button
              onClick={() =>
                navigate(`/business/investments/edit/${investment._id}`)
              }
              className="flex-1 px-4 py-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl hover:bg-yellow-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              <Edit3 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Edit
            </button>
          )}

          {!isCreator && (
            <button
              onClick={() =>
                navigate(`/investor/investments/${investment._id}`)
              }
              className={`flex-1 px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg ${
                investment.status === "published"
                  ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 hover:shadow-yellow-500/25"
                  : "bg-gray-700 text-gray-400 cursor-not-allowed"
              }`}
              disabled={investment.status !== "published"}
            >
              {myInvestment ? (
                <>
                  <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Add More
                </>
              ) : (
                <>
                  <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  {investment.status === "published"
                    ? "Invest Now"
                    : "Not Available"}
                </>
              )}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default InvestmentCard;
