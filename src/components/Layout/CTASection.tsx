// import React from 'react';

const CTASection = () => {
  const statsCards = [
    { id: 1, amount: "$5.7B", title: "+18% YoY" },
    { id: 2, amount: "+3.5M", title: "+40 Countries" },
    { id: 3, amount: "120B ETB", title: "+128% YTD" },
    { id: 4, amount: "900M", title: "3x GDP Impact" },
  ];

  return (
    <div className="py-30 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.id}
            className="bg-black border border-gray-800 rounded-xl p-6 text-center"
          >
            <div className="text-3xl md:text-4xl font-bold bg-linear-to-r from-orange-500 via-yellow-500 to-orange-700 bg-clip-text text-transparent">
              {card.amount}
            </div>
            <div className="text-gray-400 mt-2">{card.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CTASection;
