// import React from 'react';

const LovedByThousands = () => {
  return (
    <section className="py-20 px-4 bg-linear-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
              Loved by Thousands
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Join our growing community of satisfied investors
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* Card 1 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-5xl font-bold mb-4 bg-linear-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              50,000+
            </div>
            <div className="text-gray-300 font-semibold text-lg mb-2">
              Active Investors
            </div>
            <div className="text-gray-400 text-sm">
              Across 40+ countries worldwide
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-5xl font-bold mb-4 bg-linear -to-r from-orange-500 to-yellow-600 bg-clip-text text-transparent">
              98%
            </div>
            <div className="text-gray-300 font-semibold text-lg mb-2">
              Satisfaction Rate
            </div>
            <div className="text-gray-400 text-sm">
              Based on user reviews & feedback
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-5xl font-bold mb-4 bg-linear-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
              $500M+
            </div>
            <div className="text-gray-300 font-semibold text-lg mb-2">
              Total Investments
            </div>
            <div className="text-gray-400 text-sm">
              Deployed across various sectors
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center hover:border-yellow-500/30 transition-all duration-300">
            <div className="text-5xl font-bold mb-4 bg-linear-to-r from-orange-600 to-yellow-700 bg-clip-text text-transparent">
              4.9/5
            </div>
            <div className="text-gray-300 font-semibold text-lg mb-2">
              Platform Rating
            </div>
            <div className="text-gray-400 text-sm">
              On Trustpilot & App Store
            </div>
          </div>
        </div>

        {/* Simple Stats Bar */}
        <div className="bg-linear-to-r from-gray-900 to-black border border-gray-800 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">$0</div>
              <div className="text-gray-400">No setup fees</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-400 mb-2">
                5 min
              </div>
              <div className="text-gray-400">Quick onboarding</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-500 mb-2">
                24/7
              </div>
              <div className="text-gray-400">Dedicated support</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-500 mb-2">
                100%
              </div>
              <div className="text-gray-400">Secure platform</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LovedByThousands;
