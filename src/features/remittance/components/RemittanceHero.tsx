import React from "react";
import { Star } from "lucide-react";

interface RemittanceHeroProps {
  title?: string;
  trustpilotScore?: string;
  reviewsCount?: string;
}

const RemittanceHero: React.FC<RemittanceHeroProps> = ({
  title = "International money transfer",
  trustpilotScore = "Great",
  reviewsCount = "82,565+ reviews",
}) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        {title}
      </h1>
      <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
        Fast, flexible and secure international money transfers across the
        world. Save time and money when you send money internationally with us.
      </p>

      {/* Trustpilot */}
      <div className="flex items-center justify-center gap-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-full py-2 px-6 w-fit mx-auto">
        <div className="flex items-center gap-1">
          <Star className="w-5 h-5 fill-green-500 text-green-500" />
          <Star className="w-5 h-5 fill-green-500 text-green-500" />
          <Star className="w-5 h-5 fill-green-500 text-green-500" />
          <Star className="w-5 h-5 fill-green-500 text-green-500" />
          <Star className="w-5 h-5 fill-green-500 text-green-500" />
        </div>
        <span className="text-white font-semibold">{trustpilotScore}</span>
        <span className="text-gray-400 text-sm">{reviewsCount}</span>
      </div>
    </div>
  );
};

export default RemittanceHero;
