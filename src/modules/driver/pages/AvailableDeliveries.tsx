import React from 'react';
import { useDeliveries, useDriver } from '../hooks/useDriver';
import { useDeliveryPolling } from '../hooks/useDeliveryPolling';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Navigation, ArrowRight, Package, Info, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { DeliverySkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const AvailableDeliveries: React.FC = () => {
  const { availableDeliveries, acceptDelivery, isLoading } = useDeliveries();
  const { status } = useDriver();

  // Enable polling for new deliveries
  useDeliveryPolling({ intervalMs: 8000 });

  const handleAccept = (id: string) => {
    acceptDelivery(id);
    toast.success('Corrida aceita! Vá até a loja para coletar o pedido.');
  };

  if (status === 'offline') {
    return (
      <EmptyState
        icon={<WifiOff size={64} />}
        title="Você está Offline"
        description="Fique online no painel principal para ver as entregas disponíveis."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Pedidos <span className="text-[#FF6B00]">Disponíveis</span></h2>
        {!isLoading && (
          <span className="px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#FF6B00]/20">
            {availableDeliveries.length} Novos
          </span>
        )}
      </div>

      {isLoading && availableDeliveries.length === 0 ? (
        <DeliverySkeleton />
      ) : (
        <AnimatePresence mode="popLayout">
          {availableDeliveries.length > 0 ? (
            availableDeliveries.map((delivery, i) => (
              <motion.div
                key={delivery.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 bg-[#1A1A1A] border border-white/5 rounded-[32px] space-y-6 relative overflow-hidden group"
              >
                {/* Pulse effect for new items */}
                <div className="absolute top-0 right-0 p-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B00] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FF6B00]"></span>
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#FF6B00]">{delivery.store.name}</p>
                    <h3 className="text-lg font-bold tracking-tight">R$ {delivery.value.toFixed(2)}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-white/40">
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Navigation size={14} />
                      {delivery.distanceKm}km
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold">
                      <Clock size={14} />
                      {delivery.estimatedTimeMin}m
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative">
                  {/* Visual Route Line */}
                  <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-white/5 border-l border-dashed border-white/20"></div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full flex items-center justify-center z-10">
                      <Package size={12} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Coleta</p>
                      <p className="text-sm font-medium text-white/80">{delivery.store.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-6 h-6 bg-white/5 text-white/40 rounded-full flex items-center justify-center z-10">
                      <MapPin size={12} />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Entrega</p>
                      <p className="text-sm font-medium text-white/80">{delivery.customer.address}</p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95, backgroundColor: "#FF6B00", color: "#FFFFFF" }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={() => handleAccept(delivery.id)}
                  className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-[#FF6B00] hover:text-white transition-all group-hover:shadow-lg group-hover:shadow-[#FF6B00]/20"
                >
                  Aceitar Corrida
                  <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={<Package size={64} />}
              title="Nenhum pedido"
              description="Não há pedidos disponíveis no momento. Fique atento!"
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default AvailableDeliveries;
