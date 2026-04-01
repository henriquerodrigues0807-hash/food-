import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface BottomNavProps {
  items: NavItem[];
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, className }) => {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-t border-zinc-900 px-6 py-4 md:hidden",
        className
      )}
    >
      <div className="flex items-center justify-around gap-2">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "relative flex flex-col items-center gap-1.5 transition-all",
                isActive ? "text-orange-500" : "text-zinc-500 hover:text-zinc-300"
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="navActive"
                      className="absolute -inset-2 bg-orange-500/10 rounded-full blur-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className={cn("relative z-10 w-6 h-6", isActive && "scale-110")}>
                    {item.icon}
                  </span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
