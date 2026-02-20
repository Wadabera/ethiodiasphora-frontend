// features/remittance/components/RemittanceHero.tsx
import React from "react";
import RemittanceStats from "./RemittanceStats";

interface RemittanceHeroProps {
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  totalProviders: number;
  bestRate: number;
  fastestTime: string;
}

const RemittanceHero: React.FC<RemittanceHeroProps> = ({
  selectedCurrency,
  onCurrencyChange,
  totalProviders,
  bestRate,
  fastestTime,
}) => {
  return (
    <section className="bg-black text-[#FFD700] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Send Money to Ethiopia
          </h1>
          <p className="text-xl text-yellow-400 mb-8 max-w-3xl mx-auto">
            Compare real-time remittance rates from trusted providers. Find the
            cheapest and fastest way to send money home.
          </p>
        </div>

        {/* Stats */}
        <RemittanceStats
          totalProviders={totalProviders}
          bestRate={bestRate}
          fastestTime={fastestTime}
        />

        {/* Currency Quick Select */}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          {["USD", "EUR", "GBP", "AED", "CAD", "SAR"].map((currency) => (
            <button
              key={currency}
              onClick={() => onCurrencyChange(currency)}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all
                ${
                  selectedCurrency === currency
                    ? "bg-[#FFD700] text-black"
                    : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                }
              `}
            >
              {currency}
            </button>
          ))}
        </div>

        {/* Last Updated */}
        <p className="text-center text-sm text-yellow-400 mt-8">
          Last Updated: {new Date().toLocaleString()}
        </p>
      </div>
    </section>
  );
};

export default RemittanceHero;
