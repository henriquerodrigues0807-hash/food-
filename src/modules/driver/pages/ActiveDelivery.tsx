import React, { useEffect } from 'react';
import { useDeliveries } from '../hooks/useDriver';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, CheckCircle2, Navigation, AlertTriangle, Package, User } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const ActiveDelivery: React.FC = () => {
  const { activeDelivery, updateDeliveryStatus, refreshActive, isLoading } = useDeliveries();
  const navigate = useNavigate();

  useEffect(() => {
    refreshActive();
  }, []);

  if (isLoading && !activeDelivery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-8 bg-white/5 rounded-full animate-pulse">
          <Navigation size={64} className="text-white/10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white/20">Carregando entrega...</h2>
        </div>
      </div>
    );
  }

  if (!activeDelivery) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="p-8 bg-white/5 rounded-full text-white/20">
          <Navigation size={64} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Sem entrega ativa</h2>
          <p className="text-white/40 max-w-[250px] mx-auto">Você não tem nenhuma entrega em andamento no momento.</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 'picking_up', label: 'Indo buscar o pedido', icon: Package },
    { id: 'picked_up', label: 'Pedido coletado', icon: CheckCircle2 },
    { id: 'on_way', label: 'A caminho do cliente', icon: Navigation },
    { id: 'delivered', label: 'Entregue', icon: MapPin },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === activeDelivery.status);

  const handleNextStep = () => {
    const nextStep = steps[currentStepIndex + 1];
    if (nextStep) {
      updateDeliveryStatus(nextStep.id as any);
      if (nextStep.id === 'delivered') {
        toast.success('Entrega finalizada com sucesso!');
        navigate('../');
      } else {
        toast.info(nextStep.label);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <div className="h-48 bg-[#1A1A1A] border border-white/5 rounded-[32px] relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <Navigation size={14} className="text-[#FF6B00]" />
            <span className="text-xs font-bold uppercase tracking-widest">3.2 km restantes</span>
          </div>
          <button className="p-3 bg-[#FF6B00] text-white rounded-2xl shadow-lg shadow-[#FF6B00]/20 active:scale-90 transition-transform">
            <Navigation size={20} />
          </button>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="p-6 bg-[#1A1A1A] border border-white/5 rounded-[32px] space-y-6">
        <h3 className="font-bold text-lg tracking-tight">Status da Entrega</h3>
        <div className="space-y-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-white/5 border-l border-dashed border-white/20"></div>
          
          {steps.map((step, i) => {
            const isCompleted = i < currentStepIndex;
            const isCurrent = i === currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center gap-4 relative">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                  isCompleted ? 'bg-green-500 text-white' : 
                  isCurrent ? 'bg-[#FF6B00] text-white ring-4 ring-[#FF6B00]/20' : 
                  'bg-white/5 text-white/20'
                }`}>
                  {isCompleted ? <CheckCircle2 size={12} /> : <step.icon size={12} />}
                </div>
                <span className={`text-sm font-bold transition-all duration-500 ${
                  isCompleted ? 'text-white/40 line-through' : 
                  isCurrent ? 'text-white' : 
                  'text-white/20'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Store & Customer Info */}
      <div className="grid gap-4">
        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <Package size={18} className="text-[#FF6B00]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Loja</span>
            </div>
            <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
              <Phone size={18} />
            </button>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">{activeDelivery.store.name}</p>
            <p className="text-sm text-white/60">{activeDelivery.store.address}</p>
          </div>
        </div>

        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-xl">
                <User size={18} className="text-[#FF6B00]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/40">Cliente</span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                <MessageSquare size={18} />
              </button>
              <button className="p-2 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                <Phone size={18} />
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">{activeDelivery.customer.name}</p>
            <p className="text-sm text-white/60">{activeDelivery.customer.address}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <button
          onClick={handleNextStep}
          className="w-full bg-[#FF6B00] hover:bg-[#FF8533] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#FF6B00]/20"
        >
          {currentStepIndex === steps.length - 1 ? 'Finalizar Entrega' : 'Confirmar Próxima Etapa'}
          <CheckCircle2 size={20} />
        </button>
        <button className="w-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 transition-all">
          <AlertTriangle size={18} />
          Reportar Problema
        </button>
      </div>
    </div>
  );
};

export default ActiveDelivery;
