import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { cn } from "../../../lib/utils";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20",
      secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
      ghost: "bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-white",
      danger: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20",
      outline: "bg-transparent border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-base",
      icon: "p-2.5",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: props.disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: props.disabled || isLoading ? 1 : 0.98 }}
        className={cn(
          "relative flex items-center justify-center gap-2 rounded-full font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
