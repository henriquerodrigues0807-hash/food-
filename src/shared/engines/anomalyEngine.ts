import { Order } from '../types/index';

export type AnomalyType =
  | 'rapid_cancellation'     // > 3 cancelamentos em 1 hora
  | 'suspicious_order'       // valor > R$ 1000,00 ou > 10 itens
  | 'driver_idling'          // > 30 min parado com pedido coletado
  | 'slow_seller'            // > 15 min sem confirmar pedido
  | 'coupon_abuse'           // > 5 usos de cupons diferentes em 24h
  | 'fake_delivery';          // entregue em < 2 min após coleta

export type AnomalySeverity = 'low' | 'medium' | 'high';

export interface AnomalyDetectionResult {
  detected: boolean;
  type?: AnomalyType;
  severity?: AnomalySeverity;
  action: 'block' | 'alert' | 'log' | 'none';
  reason?: string;
}

/**
 * Motor de Detecção de Anomalias e Fraudes
 * Identifica comportamentos suspeitos em tempo real.
 */
export const detectAnomaly = (
  order: Order,
  history: Order[],
  actor: 'customer' | 'seller' | 'driver'
): AnomalyDetectionResult => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60000);
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60000);

  // 1. rapid_cancellation
  if (actor === 'customer') {
    const recentCancellations = history.filter(o => 
      o.status === 'cancelado' && 
      new Date(o.createdAt) > oneHourAgo
    ).length;
    
    if (recentCancellations >= 3) {
      return {
        detected: true,
        type: 'rapid_cancellation',
        severity: 'high',
        action: 'block',
        reason: 'Múltiplos cancelamentos em curto período'
      };
    }
  }

  // 2. suspicious_order
  if (order.total > 1000 || order.items.length > 10) {
    return {
      detected: true,
      type: 'suspicious_order',
      severity: 'medium',
      action: 'alert',
      reason: 'Pedido com valor ou quantidade de itens atípica'
    };
  }

  // 3. slow_seller
  if (actor === 'seller' && order.status === 'novo') {
    const createdAt = new Date(order.createdAt);
    const diffMin = (now.getTime() - createdAt.getTime()) / 60000;
    
    if (diffMin > 15) {
      return {
        detected: true,
        type: 'slow_seller',
        severity: 'medium',
        action: 'alert',
        reason: 'Loja demorando para confirmar pedido'
      };
    }
  }

  // 4. coupon_abuse
  if (actor === 'customer') {
    // Simulação: assumimos que o histórico contém cupons usados
    // const recentCoupons = history.filter(o => o.couponCode && new Date(o.createdAt) > twentyFourHoursAgo).length;
    // if (recentCoupons >= 5) { ... }
  }

  return { detected: false, action: 'none' };
};
