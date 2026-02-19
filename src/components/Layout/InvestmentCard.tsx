// import React from 'react';

const InvestmentCard = () => {
  const investmentFeatures = [
    {
      id: 1,
      icon: "💸",
      title: "Smart Remittances",
      description:
        "Compare fees across 30+ providers. Save up to 8% on every transfer with real-time rate comparison.",
      highlights: ["30+ providers", "8% average savings", "Real-time rates"],
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: 2,
      icon: "📈",
      title: "ESX Stock Trading",
      description:
        "Live access to Ethiopian Stock Exchange. Trade Wegaqen, Berhan Bank, and more with real-time data.",
      highlights: [
        "Live market access",
        "Real-time data",
        "Wegaqen, Berhan Bank",
      ],
      gradient: "from-orange-500 to-red-600",
    },
    {
      id: 3,
      icon: "🎯",
      title: "Investment Hub",
      description:
        "Discover vetted opportunities: real estate, startups, agriculture. AI-matched to your goals.",
      highlights: ["Vetted opportunities", "AI matching", "Multiple sectors"],
      gradient: "from-yellow-500 to-orange-600",
    },
    {
      id: 4,
      icon: "🧠",
      title: "Market Intelligence",
      description:
        "50+ daily sources aggregated. AI-powered insights on Ethiopian economy, policy, and trends.",
      highlights: ["50+ sources", "AI-powered", "Daily updates"],
      gradient: "from-orange-400 to-yellow-500",
    },
    {
      id: 5,
      icon: "🛡️",
      title: "Bank-Grade Security",
      description:
        "5-layer KYC/AML. Zero-trust architecture. Your investments protected by military-grade encryption.",
      highlights: ["5-layer security", "Zero-trust", "Military-grade"],
      gradient: "from-yellow-600 to-orange-700",
    },
    {
      id: 6,
      icon: "⚡",
      title: "Instant Execution",
      description:
        "Sub-second trades. Real-time portfolio updates. Mobile-first design works offline.",
      highlights: ["Sub-second trades", "Offline mode", "Mobile-first"],
      gradient: "from-orange-600 to-red-700",
    },
  ];

  return (
    <section className="py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          <span className="bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
            Everything You Need to Invest
          </span>
        </h2>
        <p className="text-xl text-gray-400">
          From remittances to real estate—one platform, infinite possibilities
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {investmentFeatures.map((feature) => (
          <div
            key={feature.id}
            className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/30 hover:shadow-2xl hover:shadow-yellow-500/10 transition-all duration-300"
          >
            {/* Icon with Gradient Background */}
            <div
              className={`w-16 h-16 rounded-xl bg-linear-to-r ${feature.gradient} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300`}
            >
              {feature.icon}
            </div>

            {/* Title with Gradient Text */}
            <h3
              className={`text-2xl font-bold mb-4 bg-linear -to-r ${feature.gradient} bg-clip-text text-transparent`}
            >
              {feature.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 mb-6">{feature.description}</p>

            {/* Highlights */}
            <div className="flex flex-wrap gap-2 mb-6">
              {feature.highlights.map((highlight, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full"
                >
                  {highlight}
                </span>
              ))}
            </div>

            {/* Bottom Indicator */}
            <div className="pt-4 border-t border-gray-800">
              <div
                className={`h-1 w-16 rounded-full bg-linear-to-r ${feature.gradient}`}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="text-center mt-12 pt-8 border-t border-gray-800 max-w-4xl mx-auto">
        <p className="text-gray-400 mb-8">
          Join 50,000+ investors already using our platform to grow their wealth
        </p>
        <button className="bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 text-black font-bold text-lg px-8 py-3 rounded-full hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300">
          Start Investing Now →
        </button>
      </div>
    </section>
  );
};

export default InvestmentCard;
