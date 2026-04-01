import React from "react";
import { motion } from "motion/react";
import { Star, Clock, Bike, MapPin } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../shared/components/ui/Badge";
import { Store } from "../../../shared/types";

interface StoreCardProps {
  store: Store;
  onClick?: () => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
  const { settings } = store;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/50 transition-all cursor-pointer"
    >
      {/* Banner */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={settings.banner}
          alt={settings.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
          <Badge variant={settings.status === "aberto" ? "success" : "secondary"} size="xs">
            {settings.status === "aberto" ? "Aberto" : "Fechado"}
          </Badge>
          {settings.taxaEntrega === 0 && (
            <Badge variant="orange" size="xs">Entrega Grátis</Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
              {settings.nome}
            </h3>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              {settings.categoria} • {settings.raioEntrega}km
            </span>
          </div>
          <div className="shrink-0 -mt-10 relative z-10 p-1 bg-zinc-900 rounded-2xl border-2 border-zinc-800">
            <img
              src={settings.logo}
              alt={settings.nome}
              className="w-12 h-12 rounded-xl object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
              <span className="text-[10px] font-black text-white">{settings.rating || "Novo"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-300">{settings.tempoPreparo}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Bike className="w-3 h-3 text-zinc-500" />
            <span className="text-[10px] font-black text-zinc-300">
              {settings.taxaEntrega === 0 ? "Grátis" : `R$ ${settings.taxaEntrega.toFixed(2)}`}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
