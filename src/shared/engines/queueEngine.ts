import { Order } from '../types/index';

export interface StoreQueueState {
  storeId: string;
  currentLoad: number;       // pedidos em preparo agora
  maxConcurrentOrders: number;  // definido pelo vendedor
  avgPrepTimeMinutes: number;
  queue: QueueEntry[];
}

export interface QueueEntry {
  orderId: string;
  priority: 'normal' | 'high';  // high = pedido com atraso
  estimatedReadyAt: string;
  position: number;
}

export interface QueueResult {
  accepted: boolean;
  estimatedReadyAt: string;
  queuePosition: number;
  waitMinutes: number;
  reason?: 'STORE_AT_CAPACITY';
}

/**
 * Motor de Fila de Pedidos e Controle de Carga
 * Gerencia a aceitação de pedidos e estimativas de tempo de preparo.
 */
export const enqueueOrder = (
  order: Order,
  queueState: StoreQueueState
): QueueResult => {
  const { currentLoad, maxConcurrentOrders, avgPrepTimeMinutes, queue } = queueState;

  // 1. Se currentLoad >= maxConcurrentOrders → recusar com STORE_AT_CAPACITY
  if (currentLoad >= maxConcurrentOrders) {
    return {
      accepted: false,
      estimatedReadyAt: '',
      queuePosition: queue.length + 1,
      waitMinutes: 0,
      reason: 'STORE_AT_CAPACITY'
    };
  }

  // 2. estimatedReadyAt = now + (queuePosition * avgPrepTimeMinutes)
  const now = new Date();
  const queuePosition = queue.length + 1;
  const waitMinutes = queuePosition * avgPrepTimeMinutes;
  const estimatedReadyAt = new Date(now.getTime() + waitMinutes * 60000).toISOString();

  // 3. Se pedido esperando > avgPrepTimeMinutes * 2 → priority = 'high'
  // Esta regra é aplicada ao processar a fila existente, não necessariamente ao enfileirar um novo.
  // Mas podemos retornar a prioridade se necessário.

  return {
    accepted: true,
    estimatedReadyAt,
    queuePosition,
    waitMinutes
  };
};
