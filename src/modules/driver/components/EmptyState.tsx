import React from 'react';
import { motion } from 'motion/react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center space-y-6"
    >
      <div className="p-8 bg-white/5 rounded-full text-white/20">
        {icon}
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <p className="text-white/40 max-w-[250px] mx-auto">{description}</p>
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-[#FF6B00] text-white font-bold rounded-2xl shadow-lg shadow-[#FF6B00]/20 active:scale-95 transition-transform"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
