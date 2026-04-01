import React from "react";
import { cn } from "../../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "outline" | "orange";
  size?: "xs" | "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({ className, variant = "primary", size = "sm", children, ...props }) => {
  const variants = {
    primary: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
    secondary: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    success: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20",
    info: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    outline: "bg-transparent text-zinc-400 border border-zinc-800",
    orange: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-[9px]",
    sm: "px-2.5 py-1 text-[10px]",
    md: "px-3.5 py-1.5 text-xs",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-black uppercase tracking-widest",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
