// import React from "react";
import { Link } from "react-router-dom";

const Investnow = () => {
  const brandGradient =
    "bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-700";

  const investments = [
    {
      id: 1,
      title: "Technology",
      roi: "18.5%",
      funded: "65%",
      investors: 42,
      icon: "💻",
    },
    {
      id: 2,
      title: "Manufacturing",
      roi: "22.3%",
      funded: "47%",
      investors: 28,
      icon: "🏭",
    },
    {
      id: 3,
      title: "Tourism",
      roi: "15.8%",
      funded: "47%",
      investors: 56,
      icon: "🏨",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className={`text-3xl font-bold mb-2 ${brandGradient} bg-clip-text text-transparent`}
        >
          Investment Opportunities
        </h2>
        <p className="text-gray-400">Login to start investing</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {investments.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 rounded-xl p-5 border border-gray-800"
          >
            {/* Card Content */}
            <div className="text-3xl mb-3">{item.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>

            <div className="mb-4">
              <div className="text-gray-400 text-sm">Expected ROI</div>
              <div
                className={`text-2xl font-bold ${brandGradient} bg-clip-text text-transparent`}
              >
                {item.roi}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Funded</span>
                <span
                  className={`font-semibold ${brandGradient} bg-clip-text text-transparent`}
                >
                  {item.funded}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full">
                <div
                  className={`h-full rounded-full ${brandGradient}`}
                  style={{ width: item.funded }}
                ></div>
              </div>
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className={`block w-full text-center py-3 rounded-lg font-bold ${brandGradient} text-black hover:shadow-lg hover:shadow-yellow-500/30 transition-all duration-300`}
            >
              Login to Invest
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Investnow;
