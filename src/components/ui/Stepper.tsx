import React from 'react';
import { Check } from 'lucide-react';
import { clsx } from 'clsx';

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const Stepper: React.FC<StepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          
          return (
            <React.Fragment key={step}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative z-10">
                <div
                  className={clsx(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-[#6366F1] bg-[#6366F1] text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                      : isCurrent
                      ? 'border-[#6366F1] bg-[#0b1020] text-[#6366F1] shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                      : 'border-[#1f2937] bg-[#0b1020] text-[#9CA3AF]'
                  )}
                >
                  {isCompleted ? <Check size={18} className="stroke-[3]" /> : <span className="text-sm font-semibold">{index + 1}</span>}
                </div>
                <span
                  className={clsx(
                    'absolute top-12 mt-2 w-max text-xs font-medium transition-colors',
                    isCompleted || isCurrent ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-[2px] mx-4 relative top-[-14px]">
                  <div className="absolute inset-0 bg-[#1f2937] rounded-full" />
                  <div
                    className={clsx(
                      'absolute inset-y-0 left-0 bg-[#6366F1] rounded-full transition-all duration-500 ease-in-out',
                      isCompleted ? 'w-full' : 'w-0'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {/* Spacer to account for absolute positioning of step labels */}
      <div className="h-10"></div>
    </div>
  );
};
