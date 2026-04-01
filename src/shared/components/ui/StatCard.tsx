import React from "react";
import { motion } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "../../../lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number; // percentage
  trendLabel?: string;
  className?: string;
  color?: "orange" | "emerald" | "blue" | "red" | "zinc";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  className,
  color = "zinc",
}) => {
  const colors = {
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-orange-500/5",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/5",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-blue-500/5",
    red: "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5",
    zinc: "bg-zinc-800 text-zinc-400 border-zinc-700 shadow-zinc-900/50",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={cn(
        "relative p-6 rounded-3xl border shadow-xl flex flex-col gap-4 overflow-hidden group",
        colors[color],
        className
      )}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
        <div className="scale-[3]">{icon}</div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">{icon}</div>
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-black uppercase tracking-tight text-white">
          {value}
        </h3>
        {trend !== undefined && (
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black",
                trend >= 0 ? "bg-emerald-500/20 text-emerald-500" : "bg-red-500/20 text-red-500"
              )}
            >
              {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </div>
            {trendLabel && (
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};
