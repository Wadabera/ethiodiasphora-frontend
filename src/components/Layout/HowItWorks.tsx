//import React from 'react';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Sign Up",
      desc: "5-minute KYC verification",
      icon: "📝",
    },
    {
      num: "02",
      title: "Explore",
      desc: "Browse investments & rates",
      icon: "🔍",
    },
    { num: "03", title: "Invest", desc: "Secure execution", icon: "🛡️" },
    { num: "04", title: "Track", desc: "AI insights & monitoring", icon: "📊" },
  ];

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold text-center mb-8 bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
        Simple as 1–2–3–4
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, i) => (
          <div
            key={i}
            className="bg-gray-900/50 rounded-xl p-5 text-center border border-gray-800"
          >
            <div className="text-3xl mb-2">{step.icon}</div>
            <div className="text-4xl font-bold mb-2 bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
              {step.num}
            </div>
            <h3 className="font-bold text-white mb-2">{step.title}</h3>
            <p className="text-sm text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
