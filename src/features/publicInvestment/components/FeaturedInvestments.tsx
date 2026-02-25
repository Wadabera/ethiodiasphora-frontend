// src/features/publicInvestment/components/FeaturedInvestments.tsx
import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import {type PublicInvestment } from "../types/publicInvestment.types";
import PublicInvestmentCard from "./PublicInvestmentCard";

interface FeaturedInvestmentsProps {
  investments: PublicInvestment[];
  onViewAll: () => void;
  onInvestmentClick: (id: string) => void;
}

const FeaturedInvestments: React.FC<FeaturedInvestmentsProps> = ({
  investments,
  onViewAll,
  onInvestmentClick,
}) => {
  if (investments.length === 0) return null;

  return (
    <div className="py-20 bg-gradient-to-b from-gray-900 to-gray-950">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">
                Hand-picked for you
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">
              Featured <span className="text-green-400">Opportunities</span>
            </h2>
            <p className="text-gray-400 text-lg">
              High-potential investments vetted by our experts
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="mt-4 md:mt-0 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all flex items-center gap-2 group"
          >
            View All Investments
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {investments.map((investment) => (
            <PublicInvestmentCard
              key={investment._id}
              investment={investment}
              onClick={onInvestmentClick}
              featured={true}
            />
          ))}
        </div>

        {/* Stats Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Featured investments have completed thorough due diligence and show
            strong potential for growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeaturedInvestments;
