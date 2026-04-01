import React, { useState, useEffect } from 'react';
import { useDeliveries } from '../hooks/useDriver';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Filter, ChevronRight, Package, MapPin, Star, History as HistoryIcon } from 'lucide-react';
import { DeliverySkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const History: React.FC = () => {
  const { deliveryHistory, isLoading, refreshHistory } = useDeliveries();
  const [filter, setFilter] = useState<'hoje' | 'semana' | 'mes'>('hoje');

  useEffect(() => {
    refreshHistory();
  }, []);

  const filters = [
    { id: 'hoje', label: 'Hoje' },
    { id: 'semana', label: 'Semana' },
    { id: 'mes', label: 'Mês' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Histórico de <span className="text-[#FF6B00]">Entregas</span></h2>
        <button className="p-3 bg-[#1A1A1A] border border-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
          <Calendar size={20} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#1A1A1A] border border-white/5 rounded-2xl">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              filter === f.id ? 'bg-[#FF6B00] text-white shadow-lg shadow-[#FF6B00]/20' : 'text-white/40 hover:text-white/60'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="p-6 bg-[#FF6B00] rounded-[32px] shadow-lg shadow-[#FF6B00]/20 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Total Acumulado</p>
          <p className="text-3xl font-bold">R$ {deliveryHistory.reduce((acc, d) => acc + d.value, 0).toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white/20 rounded-3xl">
          <Package size={32} />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {isLoading && deliveryHistory.length === 0 ? (
          <DeliverySkeleton />
        ) : (
          <AnimatePresence mode="popLayout">
            {deliveryHistory.length > 0 ? (
              deliveryHistory.map((delivery, i) => (
                <motion.div
                  key={delivery.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-4 group hover:border-[#FF6B00]/30 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-xl group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
                        <Package size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-widest text-white/20">
                          {new Date(delivery.deliveredAt || delivery.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="font-bold">{delivery.store.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#FF6B00]">R$ {delivery.value.toFixed(2)}</p>
                      <div className="flex items-center justify-end gap-1 text-yellow-500 text-[10px] font-bold">
                        <Star size={10} fill="currentColor" />
                        5.0
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/40">
                    <div className="flex items-center gap-2 text-xs font-medium">
                      <MapPin size={14} />
                      {delivery.customer.address.split(',')[0]}
                    </div>
                    <div className="w-1 h-1 bg-white/10 rounded-full"></div>
                    <div className="text-xs font-medium">
                      {delivery.distanceKm}km
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <EmptyState
                icon={<HistoryIcon size={64} />}
                title="Sem histórico"
                description="Você ainda não realizou nenhuma entrega neste período."
              />
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default History;
