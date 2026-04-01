import { OrderStatus, DeliveryMode } from './orderStateMachine';
import { Order } from './types/order';

// 1. Timeout do pedido pendente
// → Se vendedor não confirmar em 5 minutos → cancelar automaticamente
export const PENDING_TIMEOUT_MS = 5 * 60 * 1000;

// 2. Timeout de entregador
// → Se nenhum entregador aceitar em 10 minutos → cancelled_no_driver
export const DRIVER_TIMEOUT_MS = 10 * 60 * 1000;

// 3. Janela de cancelamento pelo cliente
export const canCustomerCancel = (status: OrderStatus): boolean => {
  const allowed = ['pending', 'confirmed'];
  return allowed.includes(status);
};

// 4. Taxa de entrega
export const calculateDeliveryFee = (mode: DeliveryMode, storeSettings: any): number => {
  if (mode === 'pickup') return 0;
  return storeSettings.taxaEntrega || 0;
};

// 5. Pedido mínimo
export const isMinimumOrderMet = (subtotal: number, minOrderValue: number): boolean => {
  return subtotal >= minOrderValue;
};

// 6. Código de confirmação de entrega
export const generateConfirmationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// 7. Expiração do código de confirmação
export const CONFIRMATION_CODE_EXPIRY_MS = 2 * 60 * 60 * 1000;
