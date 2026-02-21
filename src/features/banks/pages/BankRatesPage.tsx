import React from "react";
import {
  Heart,
  Zap,
  Shield,
  Globe,
  Users,
  MapPin,
  Sparkles,
  Star,
  Clock,
} from "lucide-react";
import placeholderlogo from "../assets/placeholderlogo.jpeg";

const BankRatesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Glowing Orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

        {/* Floating Particles */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-500/30 rounded-full animate-bounce"></div>
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-blue-500/30 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-500/40 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-2 h-2 bg-purple-500/30 rounded-full animate-ping delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* Hero Section with Logo and Motivation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Side - Large Glowing Logo */}
          <div className="relative group">
            {/* Glowing effect layers */}
            <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-3xl group-hover:bg-yellow-500/30 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 rounded-3xl blur-2xl animate-pulse"></div>

            {/* Main Logo Container */}
            <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-yellow-500/30 p-12 overflow-hidden group-hover:border-yellow-500/60 transition-all duration-500">
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

              {/* Logo */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {/* Pulsing ring */}
                  <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 border-2 border-yellow-500 rounded-full animate-pulse"></div>

                  {/* Logo image with glow */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl animate-pulse"></div>
                    <img
                      src={placeholderlogo}
                      alt="Ethio Diaspora"
                      className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-float group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Brand name with glow */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mt-8 relative">
                  <span className="bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-gradient">
                    Ethio Diaspora
                  </span>
                  <Sparkles className="absolute -top-6 -right-6 w-8 h-8 text-yellow-500 animate-spin-slow" />
                </h1>
                <p className="text-gray-400 text-xl mt-2">
                  Your Bridge to Ethiopia
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Motivational Content */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700 p-8 hover:border-yellow-500/50 transition-all duration-500 group">
            {/* Welcome Header */}
            <div className="flex items-center gap-3 mb-6">
              <Heart className="w-8 h-8 text-yellow-500 animate-heartbeat" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                Welcome Home, Diaspora!
              </h2>
            </div>

            {/* Main Message */}
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              Stay connected with your homeland through real-time exchange rates
              from all Ethiopian banks. Whether you're sending money home or
              planning your next visit, we've got you covered.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all group/feature">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-semibold">
                    Real-Time Rates
                  </span>
                </div>
                <p className="text-xs text-gray-400">Updated every minute</p>
                <Star className="absolute top-2 right-2 w-3 h-3 text-yellow-500/50" />
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all group/feature">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-semibold">
                    Secure & Trusted
                  </span>
                </div>
                <p className="text-xs text-gray-400">Bank-grade security</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all group/feature">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-semibold">All Banks</span>
                </div>
                <p className="text-xs text-gray-400">27+ Ethiopian banks</p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 hover:border-yellow-500/50 transition-all group/feature">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-semibold">10k+ Users</span>
                </div>
                <p className="text-xs text-gray-400">Join our community</p>
              </div>
            </div>

            {/* Footer Message */}
            <div className="flex items-center gap-2 text-gray-400 border-t border-gray-800 pt-4">
              <MapPin className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-sm">Serving Ethiopians worldwide</span>
              <Clock className="w-4 h-4 text-yellow-500 ml-auto animate-spin-slow" />
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-4 right-4 opacity-20">
              <Sparkles className="w-16 h-16 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">27+</p>
            <p className="text-gray-400 text-sm">Banks</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">20</p>
            <p className="text-gray-400 text-sm">Currencies</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">10k+</p>
            <p className="text-gray-400 text-sm">Happy Users</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">24/7</p>
            <p className="text-gray-400 text-sm">Live Updates</p>
          </div>
        </div>

        {/* Placeholder for Bank Content */}
        <div className="bg-gray-800/20 rounded-2xl border border-gray-800 p-8 backdrop-blur-sm">
          <p className="text-gray-400 text-center">
            Bank exchange rates will be displayed here...
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-heartbeat {
          animation: heartbeat 2s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .delay-1000 {
          animation-delay: 1000ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
};

export default BankRatesPage;
