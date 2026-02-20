// features/remittance/components/DeliveryMethodSelector.tsx
import React from "react";
import type{ DeliveryMethod } from "../types/remittance.types";

interface DeliveryMethodSelectorProps {
  selectedMethod: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
  className?: string;
}

const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
  className = "",
}) => {
  const methods = [
    {
      id: "bank_transfer" as DeliveryMethod,
      label: "Bank Transfer",
      icon: "🏦",
      description: "Direct to bank account",
      time: "1-2 hours",
    },
    {
      id: "cash_pickup" as DeliveryMethod,
      label: "Cash Pickup",
      icon: "💵",
      description: "Pick up at agent location",
      time: "10-30 min",
    },
    {
      id: "mobile_money" as DeliveryMethod,
      label: "Mobile Money",
      icon: "📱",
      description: "To M-Birr or Telebirr",
      time: "Instant",
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {methods.map((method) => (
        <button
          key={method.id}
          onClick={() => onMethodChange(method.id)}
          className={`
            p-5 rounded-xl border-2 transition-all text-left
            ${
              selectedMethod === method.id
                ? "border-[#FFD700] bg-yellow-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }
          `}
        >
          <div className="text-3xl mb-3">{method.icon}</div>
          <h4 className="font-bold text-black mb-1">{method.label}</h4>
          <p className="text-sm text-gray-600 mb-2">{method.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">⏱️ {method.time}</span>
            {selectedMethod === method.id && (
              <span className="text-[#FFD700] text-sm">✓ Selected</span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DeliveryMethodSelector;
