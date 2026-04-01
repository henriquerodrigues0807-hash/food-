import React from "react";
import { cn } from "../../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              "w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 transition-all focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10",
              icon && "pl-12",
              error && "border-red-500/50 focus:border-red-500 focus:ring-red-500/10",
              className
            )}
            {...props}
          />
        </div>
        {error ? (
          <span className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider">
            {error}
          </span>
        ) : helperText ? (
          <span className="text-[10px] font-medium text-zinc-500 ml-1 uppercase tracking-wider">
            {helperText}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
