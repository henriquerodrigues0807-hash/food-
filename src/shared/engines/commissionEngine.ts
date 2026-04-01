import { Order } from '../types/index';

export interface CommissionConfig {
  platformRate: number;      // ex: 0.12 = 12%
  deliveryFeeOwnership: 'platform' | 'driver' | 'split';
  splitRatio?: {
    platform: number;        // ex: 0.3 = 30% da taxa p/ plataforma
    driver: number;          // ex: 0.7 = 70% da taxa p/ entregador
  };
}

export interface CommissionResult {
  orderTotal: number;
  platformCommission: number;
  sellerNet: number;
  driverEarning: number;
  breakdown: {
    subtotal: number;
    platformFeeOnSubtotal: number;
    deliveryFee: number;
    platformFeeOnDelivery: number;
    driverFeeFromDelivery: number;
  };
}

/**
 * Motor de Comissões e Split de Pagamento
 * Calcula a divisão do valor do pedido entre plataforma, vendedor e entregador.
 */
export const calculateCommission = (
  order: Order,
  config: CommissionConfig
): CommissionResult => {
  const { total, valorEntrega = 0 } = order;
  const subtotal = total - valorEntrega;

  // 1. platformCommission = R$ subtotal * platformRate
  const platformFeeOnSubtotal = subtotal * config.platformRate;

  // 2. Cálculo da taxa de entrega
  let platformFeeOnDelivery = 0;
  let driverFeeFromDelivery = 0;

  if (config.deliveryFeeOwnership === 'platform') {
    platformFeeOnDelivery = valorEntrega;
    driverFeeFromDelivery = 0;
  } else if (config.deliveryFeeOwnership === 'driver') {
    platformFeeOnDelivery = 0;
    driverFeeFromDelivery = valorEntrega;
  } else if (config.deliveryFeeOwnership === 'split' && config.splitRatio) {
    platformFeeOnDelivery = valorEntrega * config.splitRatio.platform;
    driverFeeFromDelivery = valorEntrega * config.splitRatio.driver;
  }

  const platformCommission = platformFeeOnSubtotal + platformFeeOnDelivery;
  const sellerNet = subtotal - platformFeeOnSubtotal;
  const driverEarning = driverFeeFromDelivery;

  return {
    orderTotal: total,
    platformCommission,
    sellerNet,
    driverEarning,
    breakdown: {
      subtotal,
      platformFeeOnSubtotal,
      deliveryFee: valorEntrega,
      platformFeeOnDelivery,
      driverFeeFromDelivery,
    }
  };
};
