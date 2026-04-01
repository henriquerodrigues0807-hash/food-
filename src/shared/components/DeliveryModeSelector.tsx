import React from "react";
import { Bike, ShoppingBag, Clock, MapPin } from "lucide-react";
import { cn } from "../../lib/utils";
import { DeliveryMode } from "../../shared/orderStateMachine";

interface DeliveryModeSelectorProps {
  selected: DeliveryMode;
  onChange: (mode: DeliveryMode) => void;
  storeSettings: any;
  className?: string;
}

export const DeliveryModeSelector: React.FC<DeliveryModeSelectorProps> = ({ selected, onChange, storeSettings, className }) => {
  const modes = [
    {
      id: 'delivery',
      label: 'Entrega em casa',
      icon: Bike,
      description: `Taxa R$ ${storeSettings.taxaEntrega?.toFixed(2) || '0.00'} • ${storeSettings.tempoEntrega || '30-45 min'}`,
      enabled: storeSettings.aceitaEntrega !== false
    },
    {
      id: 'pickup',
      label: 'Retirar na loja',
      icon: ShoppingBag,
      description: `Grátis • Pronto em ${storeSettings.tempoPreparo || '15-20 min'}`,
      enabled: storeSettings.aceitaRetirada !== false
    }
  ];

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>
      {modes.map((mode) => (
        <button
          key={mode.id}
          disabled={!mode.enabled}
          onClick={() => onChange(mode.id as DeliveryMode)}
          className={cn(
            "flex items-center gap-4 p-6 rounded-[32px] border-2 transition-all text-left",
            selected === mode.id 
              ? "bg-orange-500/10 border-orange-500 text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]" 
              : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700",
            !mode.enabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className={cn(
            "p-4 rounded-2xl transition-colors",
            selected === mode.id ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-600"
          )}>
            <mode.icon className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <span className={cn(
              "text-xs font-black uppercase tracking-widest",
              selected === mode.id ? "text-white" : "text-zinc-400"
            )}>
              {mode.label}
            </span>
            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
              {mode.description}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
