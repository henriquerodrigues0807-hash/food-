import React, { createContext, useContext, useState, useEffect } from 'react';
import { Delivery, DeliveryStatus } from '../types';
import { deliveryService } from '../services/deliveryService';
import { useDriverStatus } from './DriverStatusContext';

interface DriverDeliveriesContextType {
  activeDelivery: Delivery | null;
  availableDeliveries: Delivery[];
  deliveryHistory: Delivery[];
  isLoading: boolean;
  acceptDelivery: (deliveryId: string) => Promise<void>;
  updateDeliveryStatus: (status: DeliveryStatus) => Promise<void>;
  refreshAvailable: () => Promise<void>;
  refreshActive: () => Promise<void>;
  refreshHistory: () => Promise<void>;
}

const DriverDeliveriesContext = createContext<DriverDeliveriesContextType | undefined>(undefined);

export const DriverDeliveriesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { driver, status } = useDriverStatus();
  const [activeDelivery, setActiveDelivery] = useState<Delivery | null>(null);
  const [availableDeliveries, setAvailableDeliveries] = useState<Delivery[]>([]);
  const [deliveryHistory, setDeliveryHistory] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshAvailable = async () => {
    if (!driver || status !== 'online' || activeDelivery) {
      setAvailableDeliveries([]);
      return;
    }
    setIsLoading(true);
    try {
      const deliveries = await deliveryService.getAvailable(driver.id);
      setAvailableDeliveries(deliveries);
    } catch (error) {
      console.error('Failed to fetch available deliveries', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshActive = async () => {
    if (!driver) return;
    setIsLoading(true);
    try {
      const delivery = await deliveryService.getActive(driver.id);
      setActiveDelivery(delivery);
    } catch (error) {
      console.error('Failed to fetch active delivery', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    if (!driver) return;
    setIsLoading(true);
    try {
      const history = await deliveryService.getHistory(driver.id);
      setDeliveryHistory(history);
    } catch (error) {
      console.error('Failed to fetch delivery history', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDelivery = async (deliveryId: string) => {
    if (!driver) return;
    setIsLoading(true);
    try {
      const delivery = await deliveryService.accept(deliveryId, driver.id);
      setActiveDelivery(delivery);
      setAvailableDeliveries(prev => prev.filter(d => d.id !== deliveryId));
    } catch (error) {
      console.error('Failed to accept delivery', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeliveryStatus = async (newStatus: DeliveryStatus) => {
    if (!activeDelivery) return;
    setIsLoading(true);
    try {
      const updated = await deliveryService.updateStatus(activeDelivery.id, newStatus);
      if (newStatus === 'delivered' || newStatus === 'failed') {
        setActiveDelivery(null);
        setDeliveryHistory(prev => [updated, ...prev]);
      } else {
        setActiveDelivery(updated);
      }
    } catch (error) {
      console.error('Failed to update delivery status', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (driver) {
      refreshActive();
      refreshHistory();
    }
  }, [driver]);

  return (
    <DriverDeliveriesContext.Provider value={{
      activeDelivery,
      availableDeliveries,
      deliveryHistory,
      isLoading,
      acceptDelivery,
      updateDeliveryStatus,
      refreshAvailable,
      refreshActive,
      refreshHistory
    }}>
      {children}
    </DriverDeliveriesContext.Provider>
  );
};

export const useDriverDeliveries = () => {
  const context = useContext(DriverDeliveriesContext);
  if (!context) throw new Error('useDriverDeliveries must be used within DriverDeliveriesProvider');
  return context;
};
