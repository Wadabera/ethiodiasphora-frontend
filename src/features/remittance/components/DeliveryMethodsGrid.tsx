import React from "react";
import {
  Smartphone,
  Landmark,
  Wallet,
  CreditCard,
  ArrowRight,
} from "lucide-react";

interface DeliveryMethod {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  learnMoreLink: string;
}

const DeliveryMethodsGrid: React.FC = () => {
  const methods: DeliveryMethod[] = [
    {
      id: "airtime",
      title: "Airtime top up",
      description:
        "Top up credit for a pre-paid mobile phone number with no extra fees.",
      icon: <Smartphone className="w-8 h-8 text-yellow-500" />,
      learnMoreLink: "#",
    },
    {
      id: "bank",
      title: "Bank transfer",
      description:
        "Send money directly to a bank account. All you need are your receiver's details.",
      icon: <Landmark className="w-8 h-8 text-yellow-500" />,
      learnMoreLink: "#",
    },
    {
      id: "cash",
      title: "Cash pickup",
      description:
        "Send money to be collected in cash by your receiver at any of our pickup locations.",
      icon: <Wallet className="w-8 h-8 text-yellow-500" />,
      learnMoreLink: "#",
    },
    {
      id: "mobile",
      title: "Mobile money",
      description:
        "Instant transfer to your receiver's registered mobile money account number.",
      icon: <CreditCard className="w-8 h-8 text-yellow-500" />,
      learnMoreLink: "#",
    },
  ];

  return (
    <div className="mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
        Ways to send money internationally
      </h2>
      <p className="text-gray-400 mb-8 max-w-3xl">
        The cost and speed of a money transfer depends on the receiving country,
        the receive method as well as how it is paid for. Currently, there are a
        maximum of four different receive methods available.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {methods.map((method) => (
          <div
            key={method.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-600/5"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-600/20 to-yellow-500/20 rounded-xl flex items-center justify-center mb-4">
              {method.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              {method.title}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{method.description}</p>
            <a
              href={method.learnMoreLink}
              className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 transition-colors group"
            >
              Learn more
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryMethodsGrid;
