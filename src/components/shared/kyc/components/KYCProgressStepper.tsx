// features/kyc/shared/components/KYCProgressStepper.tsx
import React from "react";

interface KYCProgressStepperProps {
  currentStep: number;
  steps: Array<{ id: number; title: string }>;
}

const KYCProgressStepper: React.FC<KYCProgressStepperProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              {/* Step Circle */}
              <div
                className={`
                w-12 h-12 rounded-full flex items-center justify-center
                border-2 font-bold transition-all duration-300
                ${
                  isCompleted
                    ? "bg-yellow-500 border-yellow-500 text-black"
                    : isActive
                      ? "bg-black border-yellow-500 text-yellow-500"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                }
              `}
              >
                {isCompleted ? "✓" : step.id}
              </div>

              {/* Step Title */}
              <div
                className={`
                mt-3 text-sm font-medium transition-all duration-300
                ${isActive || isCompleted ? "text-black" : "text-gray-400"}
              `}
              >
                {step.title}
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={`
                  absolute top-6 left-1/2 w-full h-0.5 -z-10
                  ${isCompleted ? "bg-yellow-500" : "bg-gray-200"}
                `}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KYCProgressStepper;
