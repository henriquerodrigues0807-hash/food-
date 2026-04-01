import React from 'react';
import { useEarnings } from '../hooks/useDriver';
import { motion } from 'motion/react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, History, Package, ChevronRight, CreditCard, Banknote } from 'lucide-react';
import { toast } from 'sonner';
import { EarningsSkeleton } from '../components/Skeletons';
import EmptyState from '../components/EmptyState';

const Wallet: React.FC = () => {
  const { wallet, isLoading } = useEarnings();

  const handleWithdraw = () => {
    if (wallet.available > 0) {
      toast.success('Solicitação de saque enviada! O valor estará na sua conta em até 24h.');
    } else {
      toast.error('Saldo insuficiente para saque.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Minha <span className="text-[#FF6B00]">Carteira</span></h2>
        <button className="p-3 bg-[#1A1A1A] border border-white/5 rounded-2xl text-white/40 hover:text-white transition-colors">
          <CreditCard size={20} />
        </button>
      </div>

      {/* Balance Card */}
      <div className="p-8 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-[40px] shadow-2xl shadow-[#FF6B00]/30 space-y-8 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl"></div>
        
        <div className="space-y-1 relative">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60">Saldo Disponível</p>
          <p className="text-4xl font-bold tracking-tight">R$ {wallet.available.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={handleWithdraw}
            className="flex-1 bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            <Banknote size={20} />
            Sacar Agora
          </button>
          <button className="p-4 bg-white/20 text-white rounded-2xl hover:bg-white/30 transition-all active:scale-95">
            <ArrowUpRight size={24} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-green-500/10 text-green-500 w-fit rounded-xl">
            <ArrowDownLeft size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Ganhos Totais</p>
            <p className="text-xl font-bold">R$ {wallet.totalLifetime.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        
        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-blue-500/10 text-blue-500 w-fit rounded-xl">
            <ArrowUpRight size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Ganhos Pendentes</p>
            <p className="text-xl font-bold">R$ {wallet.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg tracking-tight">Extrato Recente</h3>
          <button className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            Ver Tudo <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-3">
          {isLoading && wallet.entries.length === 0 ? (
            <EarningsSkeleton />
          ) : wallet.entries.length > 0 ? (
            wallet.entries.slice(0, 5).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-[#1A1A1A] border border-white/5 rounded-2xl flex items-center justify-between group hover:border-[#FF6B00]/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-xl group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
                    <Package size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-sm">Entrega - {entry.storeName}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">
                      {new Date(entry.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-green-500">+ R$ {entry.amount.toFixed(2)}</p>
              </motion.div>
            ))
          ) : (
            <EmptyState
              icon={<History size={40} />}
              title="Nenhuma transação"
              description="Suas transações recentes aparecerão aqui."
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
