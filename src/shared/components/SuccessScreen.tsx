import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "../../lib/utils";

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ 
  title, 
  subtitle, 
  actionLabel = "Acompanhar Pedido", 
  onAction, 
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 gap-8", className)}>
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
        className="relative"
      >
        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="relative w-32 h-32 rounded-full bg-emerald-500 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
          <CheckCircle2 className="w-16 h-16 text-white" />
        </div>
      </motion.div>

      <div className="flex flex-col gap-3">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-black uppercase tracking-tight text-white"
        >
          {title}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm font-bold text-zinc-500 uppercase tracking-widest max-w-xs mx-auto"
        >
          {subtitle}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-xs"
      >
        <Button 
          variant="primary" 
          className="w-full h-16 text-sm font-black uppercase tracking-[0.2em]"
          onClick={onAction}
        >
          {actionLabel}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </motion.div>
    </div>
  );
};
