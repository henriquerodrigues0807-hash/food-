import React, { createContext, useContext, useState } from 'react';
import { Driver, DriverStatus } from '../types';

interface DriverStats {
  dailyEarnings: number;
  dailyDeliveries: number;
  weeklyEarnings: { day: string; amount: number }[];
  weeklyDeliveries: number;
}

interface DriverStatusContextType {
  driver: Driver | null;
  status: DriverStatus;
  stats: DriverStats;
  setStatus: (status: DriverStatus) => void;
  setDriver: (driver: Driver | null) => void;
  toggleOnline: () => void;
}

const DriverStatusContext = createContext<DriverStatusContextType | undefined>(undefined);

const mockDriver: Driver = {
  id: 'driver-1',
  name: 'Henrique Rodrigues',
  cpf: '123.456.789-00',
  phone: '(11) 98765-4321',
  email: 'henrique@example.com',
  vehicle: 'moto',
  vehicleType: 'moto',
  radiusKm: 10,
  rating: 4.9,
  totalDeliveries: 1250,
  acceptanceRate: 98,
  status: 'offline',
  isOnline: false,
  avgDeliveryTime: 22,
  createdAt: '2025-01-01T10:00:00Z',
};

const mockStats: DriverStats = {
  dailyEarnings: 145.80,
  dailyDeliveries: 12,
  weeklyEarnings: [
    { day: 'Seg', amount: 120 },
    { day: 'Ter', amount: 180 },
    { day: 'Qua', amount: 150 },
    { day: 'Qui', amount: 210 },
    { day: 'Sex', amount: 190 },
    { day: 'Sáb', amount: 250 },
    { day: 'Dom', amount: 140 },
  ],
  weeklyDeliveries: 68,
};

export const DriverStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [driver, setDriver] = useState<Driver | null>(mockDriver);
  const [status, setStatus] = useState<DriverStatus>('offline');
  const [stats] = useState<DriverStats>(mockStats);

  const toggleOnline = () => {
    const newStatus = status === 'online' ? 'offline' : 'online';
    setStatus(newStatus);
    if (driver) setDriver({ ...driver, status: newStatus, isOnline: newStatus === 'online' });
  };

  return (
    <DriverStatusContext.Provider value={{ driver, status, stats, setStatus, setDriver, toggleOnline }}>
      {children}
    </DriverStatusContext.Provider>
  );
};

export const useDriverStatus = () => {
  const context = useContext(DriverStatusContext);
  if (!context) throw new Error('useDriverStatus must be used within DriverStatusProvider');
  return context;
};
