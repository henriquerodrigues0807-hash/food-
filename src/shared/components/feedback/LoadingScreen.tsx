import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";

interface LoadingScreenProps {
  isLoading: boolean;
  message?: string;
  className?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isLoading,
  message = "Carregando a melhor experiência...",
  className,
}) => {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "fixed inset-0 z-[200] bg-zinc-950 flex flex-col items-center justify-center gap-8 p-6",
            className
          )}
        >
          <div className="relative w-24 h-24">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-zinc-900 border-t-orange-500 shadow-lg shadow-orange-500/20"
            />
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-4 rounded-full bg-zinc-900 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 shadow-md shadow-orange-500/40" />
            </motion.div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-black uppercase tracking-[0.4em] text-white text-center"
            >
              Food App
            </motion.h2>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center"
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
