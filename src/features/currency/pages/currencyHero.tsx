import React from 'react';
import { Sparkles, Heart, Zap, Shield, Globe, Users, MapPin, Clock } from "lucide-react";
import placeholderlogo from "../assets/CurrencyofPlaceholder.jpeg";
const currencyHero = () => {
  return (
    <div>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
       {/* Hero Section with Logo and Motivation */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Left Side - Large Glowing Logo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-3xl blur-3xl group-hover:bg-yellow-500/30 transition-all duration-700"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 rounded-3xl blur-2xl animate-pulse"></div>
      
                  <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border-2 border-yellow-500/30 p-12 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
      
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <div className="absolute inset-0 border-4 border-yellow-500 rounded-full animate-ping opacity-20"></div>
                        <div className="absolute inset-0 border-2 border-yellow-500 rounded-full animate-pulse"></div>
      
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                          <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-2xl animate-pulse"></div>
                          <img
                            src={placeholderlogo}
                            alt="Ethio Diaspora"
                            className="w-full h-full object-contain relative z-10 drop-shadow-2xl animate-float"
                          />
                        </div>
                      </div>
      
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
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl border border-gray-700 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-8 h-8 text-yellow-500 animate-heartbeat" />
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">
                      Welcome Home, Diaspora!
                    </h2>
                  </div>
      
                  <p className="text-gray-300 text-lg leading-relaxed mb-8">
                    Track real-time currency exchange rates from all Ethiopian banks.
                    Make informed decisions when sending money home.
                  </p>
      
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        <span className="text-white font-semibold">Real-Time</span>
                      </div>
                      <p className="text-xs text-gray-400">Live updates</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-yellow-500" />
                        <span className="text-white font-semibold">
                          20+ Currencies
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">Major world currencies</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-yellow-500" />
                        <span className="text-white font-semibold">27+ Banks</span>
                      </div>
                      <p className="text-xs text-gray-400">All Ethiopian banks</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-yellow-500" />
                        <span className="text-white font-semibold">10k+ Users</span>
                      </div>
                      <p className="text-xs text-gray-400">Join community</p>
                    </div>
                  </div>
      
                  <div className="flex items-center gap-2 text-gray-400 border-t border-gray-800 pt-4">
                    <MapPin className="w-4 h-4 text-yellow-500 animate-pulse" />
                    <span className="text-sm">Serving Ethiopians worldwide</span>
                    <Clock className="w-4 h-4 text-yellow-500 ml-auto animate-spin-slow" />
                  </div>
                </div>
              </div>
              
        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">20+</p>
            <p className="text-gray-400 text-sm">World Currencies</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">27</p>
            <p className="text-gray-400 text-sm">Ethiopian Banks</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">24/7</p>
            <p className="text-gray-400 text-sm">Live Updates</p>
          </div>
          <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700 text-center backdrop-blur-sm">
            <p className="text-2xl font-bold text-yellow-500">#1</p>
            <p className="text-gray-400 text-sm">In Ethiopia</p>
          </div>
        </div>

      this is the currency of hero
    </div>
  );
}

export default currencyHero;
