import { useState, useEffect, useMemo } from 'react';
import { getStoreAvailability, StoreSchedule, StoreAvailabilityResult } from '../../shared/engines/storeAvailabilityEngine';

/**
 * Hook para monitorar disponibilidade da loja em tempo real.
 * Reage a mudanças no horário e status da loja.
 */
export const useStoreAvailability = (schedule: StoreSchedule) => {
  const [now, setNow] = useState(new Date());

  // Atualizar 'now' a cada minuto para reagir a horários de abertura/fechamento
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const availabilityResult = useMemo<StoreAvailabilityResult>(() => {
    return getStoreAvailability(schedule, now);
  }, [schedule, now]);

  return {
    availability: availabilityResult,
    canOrder: availabilityResult.canOrder,
    status: availabilityResult.status,
    message: availabilityResult.message
  };
};
