import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: "pills" | "underline";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = "pills",
}) => {
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar pb-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap",
              variant === "pills"
                ? isActive
                  ? "text-white"
                  : "text-zinc-500 hover:text-zinc-300"
                : isActive
                ? "text-orange-500"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            <span className="relative z-10">{tab.label}</span>
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className={cn(
                  "absolute inset-0 z-0",
                  variant === "pills"
                    ? "bg-orange-500 rounded-full"
                    : "border-b-2 border-orange-500"
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
