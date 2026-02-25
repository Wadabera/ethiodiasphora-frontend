// src/features/publicInvestment/components/HowItWorks.tsx
import React from "react";
import {
  Search,
  Target,
  TrendingUp,
  Shield,
  Award,
  Users,
  Clock,
  ChevronRight,
} from "lucide-react";

interface HowItWorksProps {
  onGetStartedClick: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStartedClick }) => {
  const steps = [
    {
      icon: Search,
      title: "Discover Opportunities",
      description:
        "Browse through vetted investment opportunities across agriculture, technology, real estate, and more.",
      color: "from-green-400 to-green-500",
      stats: "150+ active investments",
    },
    {
      icon: Target,
      title: "Evaluate & Choose",
      description:
        "Review detailed business plans, financial projections, and risk assessments to make informed decisions.",
      color: "from-green-500 to-green-600",
      stats: "15% avg. return",
    },
    {
      icon: TrendingUp,
      title: "Invest & Track",
      description:
        "Complete KYC, invest securely, and track your portfolio's performance in real-time.",
      color: "from-green-600 to-green-700",
      stats: "10K+ investors",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      text: "Secured by Escrow",
      description: "Your funds are protected",
    },
    {
      icon: Award,
      text: "Vetted Opportunities",
      description: "Thorough due diligence",
    },
    {
      icon: Users,
      text: "Growing Community",
      description: "Join 10,000+ investors",
    },
    { icon: Clock, text: "Quick & Easy", description: "Invest in minutes" },
  ];

  return (
    <div className="py-20 bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="text-green-400">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Start your investment journey in three simple steps
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-green-600 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity`}
                ></div>

                {/* Card */}
                <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-green-500/50 transition-all">
                  {/* Step Number */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{step.description}</p>

                  {/* Stats Badge */}
                  <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                    <span className="text-xs text-green-400">{step.stats}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 hover:border-green-500/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-green-400" />
                  <span className="text-white font-semibold">
                    {benefit.text}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={onGetStartedClick}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all inline-flex items-center gap-2 group"
          >
            Get Started Now
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Already have an account?{" "}
            <button
              onClick={() => (window.location.href = "/login")}
              className="text-green-400 hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
