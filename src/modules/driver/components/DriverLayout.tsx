import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, List, History, User, Wallet, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DriverErrorBoundary from './DriverErrorBoundary';

const DriverLayout: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Início', path: '' },
    { icon: List, label: 'Pedidos', path: 'available' },
    { icon: Wallet, label: 'Carteira', path: 'wallet' },
    { icon: History, label: 'Histórico', path: 'history' },
    { icon: User, label: 'Perfil', path: 'profile' },
  ];

  // Extract slug from path if needed, but for now we use relative paths
  const base = location.pathname.split('/').slice(0, 3).join('/');

  return (
    <DriverErrorBoundary>
      <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-[#FF6B00]/30">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#1A1A1A]/80 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center font-bold text-white">F</div>
            <span className="font-bold text-lg tracking-tight">Food<span className="text-[#FF6B00]">Driver</span></span>
          </div>
          <button className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF6B00] rounded-full border-2 border-[#1A1A1A]"></span>
          </button>
        </header>

        {/* Main Content */}
        <main className="pb-24 max-w-md mx-auto px-4 pt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-lg border-t border-white/5 px-2 py-2 max-w-md mx-auto">
          <div className="flex items-center justify-around">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={`${base}/${item.path}`}
                end={item.path === ''}
                className={({ isActive }) => `
                  flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-300
                  ${isActive ? 'text-[#FF6B00] bg-[#FF6B00]/10' : 'text-white/40 hover:text-white/60'}
                `}
              >
                <item.icon size={20} className="transition-transform duration-300" />
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </DriverErrorBoundary>
  );
};

export default DriverLayout;
