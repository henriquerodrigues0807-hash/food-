import React from 'react';
import { useDriver, useDeliveries } from '../hooks/useDriver';
import { motion } from 'motion/react';
import { TrendingUp, Package, Star, Clock, Power, ChevronRight, Wallet, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { driver, stats, toggleOnline } = useDriver();
  const { activeDelivery } = useDeliveries();

  if (!driver) return null;

  return (
    <div className="space-y-6">
      {/* Online/Offline Toggle */}
      <div className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${
        driver.isOnline ? 'border-[#FF6B00]/30 bg-[#FF6B00]/5' : 'border-white/5 bg-[#1A1A1A]'
      }`}>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className={`text-2xl font-bold tracking-tight ${driver.isOnline ? 'text-[#FF6B00]' : 'text-white/40'}`}>
              {driver.isOnline ? 'Você está Online' : 'Você está Offline'}
            </h2>
            <p className="text-sm text-white/40">
              {driver.isOnline ? 'Aguardando novos pedidos...' : 'Fique online para receber pedidos'}
            </p>
          </div>
          <button
            onClick={toggleOnline}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 shadow-xl ${
              driver.isOnline ? 'bg-[#FF6B00] text-white shadow-[#FF6B00]/30' : 'bg-white/5 text-white/20'
            }`}
          >
            <Power size={28} />
          </button>
        </div>
      </div>

      {/* Active Delivery Banner */}
      {activeDelivery && (
        <Link to="active" className="block p-5 bg-[#FF6B00] rounded-3xl shadow-lg shadow-[#FF6B00]/20 active:scale-95 transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Entrega em andamento</p>
                <p className="font-bold text-lg">{activeDelivery.store.name}</p>
              </div>
            </div>
            <ChevronRight size={24} />
          </div>
        </Link>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-green-500/10 text-green-500 w-fit rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Ganhos Hoje</p>
            <p className="text-xl font-bold">R$ {stats.dailyEarnings.toFixed(2)}</p>
          </div>
        </div>
        
        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-blue-500/10 text-blue-500 w-fit rounded-xl">
            <Package size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Entregas</p>
            <p className="text-xl font-bold">{stats.dailyDeliveries}</p>
          </div>
        </div>

        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-yellow-500/10 text-yellow-500 w-fit rounded-xl">
            <Star size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Avaliação</p>
            <p className="text-xl font-bold">{driver.rating}</p>
          </div>
        </div>

        <div className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl space-y-3">
          <div className="p-2 bg-purple-500/10 text-purple-500 w-fit rounded-xl">
            <Clock size={20} />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Tempo Médio</p>
            <p className="text-xl font-bold">{driver.avgDeliveryTime} min</p>
          </div>
        </div>
      </div>

      {/* Weekly Chart Placeholder */}
      <div className="p-6 bg-[#1A1A1A] border border-white/5 rounded-[32px] space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg tracking-tight">Ganhos da Semana</h3>
          <Link to="wallet" className="text-[#FF6B00] text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            Ver Carteira <ChevronRight size={14} />
          </Link>
        </div>
        
        <div className="flex items-end justify-between h-32 gap-2 px-2">
          {stats.weeklyEarnings.map((day, i) => (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.amount / 250) * 100}%` }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-lg ${i === 5 ? 'bg-[#FF6B00]' : 'bg-white/10'}`}
              />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link to="available" className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl flex items-center gap-4 group hover:border-[#FF6B00]/30 transition-colors">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
            <List size={20} />
          </div>
          <span className="font-bold text-sm">Disponíveis</span>
        </Link>
        <Link to="wallet" className="p-5 bg-[#1A1A1A] border border-white/5 rounded-3xl flex items-center gap-4 group hover:border-[#FF6B00]/30 transition-colors">
          <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
            <Wallet size={20} />
          </div>
          <span className="font-bold text-sm">Carteira</span>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
