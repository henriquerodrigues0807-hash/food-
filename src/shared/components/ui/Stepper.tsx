import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../../lib/utils";

interface Step {
  id: string | number;
  label: string;
  icon?: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("flex items-center justify-between w-full gap-4", className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isActive = stepNumber === currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 flex-1">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-500",
                  isCompleted
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step.icon || index + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-black uppercase tracking-[0.2em] text-center transition-all duration-500",
                  isActive ? "text-orange-500" : isCompleted ? "text-emerald-500" : "text-zinc-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="h-[1px] flex-1 bg-zinc-800 relative top-[-10px]">
                <div
                  className={cn(
                    "absolute inset-0 bg-emerald-500 transition-all duration-500 origin-left",
                    isCompleted ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
