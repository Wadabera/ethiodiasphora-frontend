import React from "react";
import { Check, Clock, ChevronDown } from "lucide-react";

interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  time: string;
  icon: string;
}

interface DeliveryMethodSelectorProps {
  selectedMethod: string;
  onSelect: (methodId: string) => void;
  className?: string;
}

const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  selectedMethod,
  onSelect,
  className = "",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const methods: DeliveryMethod[] = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Direct to bank account",
      time: "1-2 hours",
      icon: "🏦",
    },
    {
      id: "cash_pickup",
      name: "Cash Pickup",
      description: "Pick up at agent location",
      time: "Minutes",
      icon: "💵",
    },
    {
      id: "mobile_wallet",
      name: "Mobile Wallet",
      description: "Send to mobile money",
      time: "Instant",
      icon: "📱",
    },
    {
      id: "debit_card",
      name: "Debit Card Deposit",
      description: "Direct to card",
      time: "Within 1 hour",
      icon: "💳",
    },
    {
      id: "airtime",
      name: "Airtime Top Up",
      description: "Pre-paid mobile credit",
      time: "Instant",
      icon: "📲",
    },
  ];

  const selected = methods.find((m) => m.id === selectedMethod) || methods[0];

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        Receive method
      </label>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 flex items-center justify-between hover:border-yellow-500/50 transition-all focus:outline-none focus:border-yellow-500"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{selected.icon}</span>
          <div className="text-left">
            <p className="text-white font-medium">{selected.name}</p>
            <p className="text-xs text-gray-400">{selected.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-sm text-gray-300">
            <Clock className="w-3 h-3" />
            {selected.time}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 mt-2 w-full bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
            {methods.map((method) => (
              <button
                key={method.id}
                onClick={() => {
                  onSelect(method.id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-all ${
                  selectedMethod === method.id
                    ? "bg-yellow-500/10 border-l-2 border-yellow-500"
                    : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left">
                    <p className="text-white font-medium">{method.name}</p>
                    <p className="text-xs text-gray-400">
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm text-gray-300">
                    <Clock className="w-3 h-3" />
                    {method.time}
                  </div>
                  {selectedMethod === method.id && (
                    <Check className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliveryMethodSelector;
