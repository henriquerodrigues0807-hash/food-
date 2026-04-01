import React from 'react';
import { useDriver } from '../hooks/useDriver';
import { motion } from 'motion/react';
import { User, Camera, ShieldCheck, Star, Package, Clock, LogOut, Settings, ChevronRight, FileText, Bike, Car, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { driver } = useDriver();
  const navigate = useNavigate();

  if (!driver) return null;

  const handleLogout = () => {
    toast.info('Saindo da conta...');
    navigate('/');
  };

  const vehicleIcons = {
    moto: Bike,
    bicicleta: Bike,
    carro: Car,
    a_pe: User,
  };

  const VehicleIcon = vehicleIcons[driver.vehicleType as keyof typeof vehicleIcons] || Bike;

  const menuItems = [
    { icon: FileText, label: 'Documentos', status: 'Aprovado', color: 'text-green-500' },
    { icon: Settings, label: 'Configurações de Veículo', status: driver.vehicleType, color: 'text-white/40' },
    { icon: ShieldCheck, label: 'Segurança e Senha', status: '', color: 'text-white/40' },
    { icon: Settings, label: 'Preferências do App', status: '', color: 'text-white/40' },
  ];

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 bg-gradient-to-br from-[#FF6B00] to-[#FF8533] rounded-[48px] p-1 shadow-2xl shadow-[#FF6B00]/30 group-hover:scale-105 transition-transform duration-500">
            <div className="w-full h-full bg-[#1A1A1A] rounded-[44px] flex items-center justify-center overflow-hidden relative">
              {driver.profilePhoto ? (
                <img src={driver.profilePhoto} alt={driver.name} className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-white/10" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={24} className="text-white" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 bg-green-500 text-white rounded-2xl border-4 border-[#0F0F0F] shadow-lg">
            <ShieldCheck size={20} />
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">{driver.name}</h2>
          <div className="flex items-center justify-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest">
            <VehicleIcon size={14} className="text-[#FF6B00]" />
            Entregador Parceiro
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[#1A1A1A] border border-white/5 rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Entregas</p>
          <p className="font-bold text-lg">{driver.totalDeliveries}</p>
        </div>
        <div className="p-4 bg-[#1A1A1A] border border-white/5 rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Nota</p>
          <div className="flex items-center justify-center gap-1">
            <Star size={14} className="text-yellow-500" fill="currentColor" />
            <p className="font-bold text-lg">{driver.rating}</p>
          </div>
        </div>
        <div className="p-4 bg-[#1A1A1A] border border-white/5 rounded-3xl text-center space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Aceitação</p>
          <p className="font-bold text-lg">{driver.acceptanceRate}%</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-[32px] overflow-hidden">
        {menuItems.map((item, i) => (
          <button
            key={item.label}
            className={`w-full p-6 flex items-center justify-between group transition-colors hover:bg-white/5 ${
              i !== menuItems.length - 1 ? 'border-b border-white/5' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00] transition-colors">
                <item.icon size={20} />
              </div>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
              {item.status && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${item.color}`}>
                  {item.status}
                </span>
              )}
              <ChevronRight size={18} className="text-white/20 group-hover:text-white transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full p-6 bg-red-500/10 border border-red-500/20 rounded-[32px] flex items-center justify-center gap-3 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all active:scale-95"
      >
        <LogOut size={20} />
        Sair da Conta
      </button>

      <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/10 pb-4">
        FoodDriver v1.0.0 • 2026
      </p>
    </div>
  );
};

export default Profile;
