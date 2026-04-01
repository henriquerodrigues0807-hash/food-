import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { StoreCard } from "./StoreCard";
import { Store } from "../../../shared/types";

interface StoreGridProps {
  stores: Store[];
  onStoreClick: (store: Store) => void;
  isLoading?: boolean;
  className?: string;
}

export const StoreGrid: React.FC<StoreGridProps> = ({
  stores,
  onStoreClick,
  isLoading,
  className,
}) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      <AnimatePresence mode="popLayout">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-zinc-900 border border-zinc-800 rounded-3xl animate-pulse" />
          ))
        ) : stores.length > 0 ? (
          stores.map((store, index) => (
            <motion.div
              key={store.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <StoreCard store={store} onClick={() => onStoreClick(store)} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 opacity-20">
            <div className="w-20 h-20 rounded-full border-4 border-dashed border-zinc-500" />
            <span className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">
              Nenhuma loja encontrada
            </span>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
