import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletState, EarningsEntry } from '../types';
import { useDriverStatus } from './DriverStatusContext';
import { deliveryService } from '../services/deliveryService';

interface DriverEarningsContextType {
  wallet: WalletState;
  isLoading: boolean;
  refreshEarnings: () => Promise<void>;
}

const DriverEarningsContext = createContext<DriverEarningsContextType | undefined>(undefined);

const initialWallet: WalletState = {
  available: 1245.80,
  pending: 154.50,
  totalLifetime: 12450.00,
  entries: [
    { id: 'earn-1', deliveryId: 'del-1', amount: 12.50, date: new Date().toISOString(), storeName: 'Burger King' },
    { id: 'earn-2', deliveryId: 'del-2', amount: 8.90, date: new Date().toISOString(), storeName: 'Sushi House' },
  ],
};

export const DriverEarningsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { driver } = useDriverStatus();
  const [wallet, setWallet] = useState<WalletState>(initialWallet);
  const [isLoading, setIsLoading] = useState(false);

  const refreshEarnings = async () => {
    if (!driver) return;
    setIsLoading(true);
    try {
      const history = await deliveryService.getHistory(driver.id, 'day');
      const entries: EarningsEntry[] = history.map(d => ({
        id: `earn-${d.id}`,
        deliveryId: d.id,
        amount: d.value,
        date: d.deliveredAt || d.createdAt,
        storeName: d.storeName
      }));
      setWallet(prev => ({ ...prev, entries }));
    } catch (error) {
      console.error('Failed to fetch earnings history', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DriverEarningsContext.Provider value={{ wallet, isLoading, refreshEarnings }}>
      {children}
    </DriverEarningsContext.Provider>
  );
};

export const useDriverEarnings = () => {
  const context = useContext(DriverEarningsContext);
  if (!context) throw new Error('useDriverEarnings must be used within DriverEarningsProvider');
  return context;
};
