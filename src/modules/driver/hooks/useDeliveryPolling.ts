import { useEffect, useRef } from 'react';
import { useDeliveries, useDriver } from './useDriver';

interface UseDeliveryPollingOptions {
  intervalMs?: number;
  enabled?: boolean;
}

export const useDeliveryPolling = (options: UseDeliveryPollingOptions = {}) => {
  const { intervalMs = 10000, enabled = true } = options;
  const { refreshAvailable, activeDelivery } = useDeliveries();
  const { status } = useDriver();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const shouldPoll = enabled && status === 'online' && !activeDelivery;

    if (shouldPoll) {
      // Initial fetch
      refreshAvailable();

      // Start polling
      timerRef.current = setInterval(() => {
        refreshAvailable();
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [enabled, status, activeDelivery, intervalMs, refreshAvailable]);
};
