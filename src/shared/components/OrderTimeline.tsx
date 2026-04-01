import React from "react";
import { motion } from "motion/react";
import { Check, Clock, Bike, MapPin, Package, Store, CheckCircle2 } from "lucide-react";
import { OrderStatus, DeliveryMode } from "../../shared/orderStateMachine";
import { cn } from "../../lib/utils";

interface OrderTimelineProps {
  mode: DeliveryMode;
  currentStatus: OrderStatus;
  className?: string;
}

const TIMELINE_STEPS: Record<DeliveryMode, { status: OrderStatus; label: string; icon: any }[]> = {
  delivery: [
    { status: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
    { status: 'preparing', label: 'Em Preparo', icon: Package },
    { status: 'ready', label: 'Pronto', icon: Store },
    { status: 'driver_assigned', label: 'Entregador', icon: Bike },
    { status: 'collecting', label: 'Coletando', icon: Clock },
    { status: 'in_transit', label: 'Em Rota', icon: MapPin },
    { status: 'delivered', label: 'Entregue', icon: Check },
  ],
  pickup: [
    { status: 'confirmed', label: 'Confirmado', icon: CheckCircle2 },
    { status: 'preparing', label: 'Em Preparo', icon: Package },
    { status: 'ready_for_pickup', label: 'Retirada', icon: Store },
    { status: 'picked_up', label: 'Retirado', icon: Check },
  ]
};

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ mode, currentStatus, className }) => {
  const steps = TIMELINE_STEPS[mode];
  
  // Find current step index
  const currentStepIndex = steps.findIndex(s => s.status === currentStatus);
  
  // If status is cancelled or failed, we might need special handling, 
  // but for now let's just show progress up to where it got.
  
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex || currentStatus === 'delivered' || currentStatus === 'picked_up';
        const isActive = index === currentStepIndex;
        const Icon = step.icon;

        return (
          <div key={step.status} className="flex gap-4 relative">
            {/* Line */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "absolute left-[15px] top-8 w-[2px] h-full bg-zinc-800",
                  isCompleted && "bg-orange-500"
                )} 
              />
            )}

            {/* Circle */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-500",
                isCompleted ? "bg-orange-500 text-white" : 
                isActive ? "bg-zinc-900 border-2 border-orange-500 text-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]" : 
                "bg-zinc-900 border border-zinc-800 text-zinc-600"
              )}
            >
              <Icon className="w-4 h-4" />
            </div>

            {/* Label */}
            <div className="flex flex-col pt-1">
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest transition-colors duration-500",
                isCompleted || isActive ? "text-white" : "text-zinc-600"
              )}>
                {step.label}
              </span>
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-[9px] font-bold text-orange-500 uppercase tracking-widest mt-1"
                >
                  Status Atual
                </motion.span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
