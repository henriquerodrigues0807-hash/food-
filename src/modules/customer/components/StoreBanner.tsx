import React from "react";
import { motion } from "motion/react";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../../shared/components/ui/Button";

interface StoreBannerProps {
  title: string;
  subtitle: string;
  image: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

export const StoreBanner: React.FC<StoreBannerProps> = ({
  title,
  subtitle,
  image,
  ctaText = "Aproveitar",
  onCtaClick,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative h-[240px] md:h-[320px] rounded-[40px] overflow-hidden shadow-2xl group",
        className
      )}
    >
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
      
      <div className="relative h-full flex flex-col justify-center p-8 md:p-12 gap-4 max-w-lg">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-[2px] bg-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-orange-500">
            Oferta Especial
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-[0.9]"
        >
          {title}
        </motion.h2>
        
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-sm md:text-base font-bold text-zinc-400 uppercase tracking-widest"
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <Button onClick={onCtaClick} className="w-fit">
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
