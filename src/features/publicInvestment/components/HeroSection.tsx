// src/features/publicInvestment/components/HeroSection.tsx
import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,

  Users,
  Target,
  Leaf,
  Shield,
  Award,
} from "lucide-react";

import { useAppSelector } from "@/hooks/hooks";

interface HeroSectionProps {
  onExploreClick: () => void;
  onLearnMoreClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onLearnMoreClick,
}) => {
  const { list } = useAppSelector((state) => state.publicInvestments);

  // Calculate stats from fetched data
  const [stats, setStats] = useState({
    totalInvestments: 0,
    totalFunded: 0,
    totalInvestors: 0,
    averageReturn: 0,
  });

  useEffect(() => {
    if (list.length > 0) {
      const totalFunded = list.reduce(
        (sum, inv) => sum + (inv.currentFunding || 0),
        0,
      );
      const totalInvestors = list.reduce(
        (sum, inv) => sum + (inv.investments?.length || 0),
        0,
      );
      const avgReturn =
        list.reduce((sum, inv) => sum + (inv.expectedReturn || 0), 0) /
        list.length;

      setStats({
        totalInvestments: list.length,
        totalFunded,
        totalInvestors,
        averageReturn: Math.round(avgReturn * 10) / 10,
      });
    }
  }, [list]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      className="relative min-h-[600px] flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, , url('https://images.unsplash.com/photo-1542601906990-b4d3fb778bdf?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/5 rounded-full blur-3xl"></div>

        {/* Floating Leaves */}
        <div className="absolute top-40 right-20 opacity-20 animate-float">
          <Leaf className="w-16 h-16 text-green-300" />
        </div>
        <div className="absolute bottom-40 left-20 opacity-20 animate-float delay-1000">
          <Leaf className="w-12 h-12 text-green-300" />
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-20 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full text-green-400 text-sm mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>Empowering Ethiopian Innovation & Growth</span>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
          Invest in{" "}
          <span className="bg-gradient-to-r from-green-300 to-green-100 bg-clip-text text-transparent">
            Ethiopia's Future
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12 animate-slide-up delay-200">
          Join a community of forward-thinking investors supporting Ethiopian
          businesses. From agriculture to technology, discover vetted
          opportunities that create impact and generate returns.
        </p>

        {/* Stats - Now calculated from fetched data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12 animate-slide-up delay-300">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats.totalInvestments || 150}+
            </div>
            <div className="text-sm text-gray-300">Active Opportunities</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatCurrency(stats.totalFunded || 12500000)}
            </div>
            <div className="text-sm text-gray-300">Total Funded</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {formatNumber(stats.totalInvestors || 2500)}
            </div>
            <div className="text-sm text-gray-300">Active Investors</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {stats.averageReturn || 15}%
            </div>
            <div className="text-sm text-gray-300">Avg. Annual Return</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up delay-500">
          <button
            onClick={onExploreClick}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-500/25 group"
          >
            Explore Opportunities
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onLearnMoreClick}
            className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-bold rounded-xl transition-all border border-white/20"
          >
            How It Works
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-300">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span>Secured by Escrow</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-green-400" />
            <span>Vetted Opportunities</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span>{stats.totalInvestors || "10K+"} Investors</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-green-400" />
            <span>Track Record</span>
          </div>
        </div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="w-full h-auto"
        >
          <path
            fill="#030712"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 1s ease-out; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; opacity: 0; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
};

export default HeroSection;
