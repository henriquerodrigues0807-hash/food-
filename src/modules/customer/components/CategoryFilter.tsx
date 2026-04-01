import React from "react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";

interface Category {
  id: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
  onChange: (id: string) => void;
  className?: string;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-4 overflow-x-auto no-scrollbar py-4", className)}>
      {categories.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <motion.button
            key={category.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(category.id)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-3 min-w-[80px] h-[100px] rounded-3xl border transition-all duration-300",
              isActive 
                ? "bg-orange-500 border-orange-500 shadow-lg shadow-orange-500/20" 
                : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
            )}
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-transform duration-500",
              isActive ? "scale-110 rotate-12" : "bg-zinc-950 border border-zinc-800"
            )}>
              {category.icon}
            </div>
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest leading-none transition-colors",
              isActive ? "text-white" : "text-zinc-500"
            )}>
              {category.label}
            </span>
            
            {isActive && (
              <motion.div
                layoutId="categoryActive"
                className="absolute inset-0 bg-white/10 rounded-3xl blur-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
