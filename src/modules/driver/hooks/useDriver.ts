import { useDriverStatus } from '../context/DriverStatusContext';
import { useDriverDeliveries } from '../context/DriverDeliveriesContext';
import { useDriverEarnings } from '../context/DriverEarningsContext';

export const useDriver = () => {
  const { driver, status, stats, toggleOnline } = useDriverStatus();
  return {
    driver,
    status,
    stats,
    toggleOnline,
  };
};

export const useDeliveries = () => {
  const {
    activeDelivery,
    availableDeliveries,
    deliveryHistory,
    isLoading,
    acceptDelivery,
    updateDeliveryStatus,
    refreshAvailable,
    refreshActive,
    refreshHistory
  } = useDriverDeliveries();

  return {
    activeDelivery,
    availableDeliveries,
    deliveryHistory,
    isLoading,
    acceptDelivery,
    updateDeliveryStatus,
    refreshAvailable,
    refreshActive,
    refreshHistory
  };
};

export const useEarnings = () => {
  const { wallet, isLoading, refreshEarnings } = useDriverEarnings();
  return {
    wallet,
    isLoading,
    refreshEarnings
  };
};
