import { Order } from '../types/index';

export type CouponType =
  | 'percentage'          // ex: 10% de desconto
  | 'fixed'               // ex: R$ 5,00 off
  | 'free_delivery'       // taxa = 0
  | 'first_order';         // apenas no primeiro pedido do cliente

export type CouponScope =
  | 'platform'            // qualquer loja
  | 'store'               // loja específica
  | 'product'             // produto específico
  | 'category';            // categoria específica

export interface CouponCode {
  id: string;
  code: string;
  type: CouponType;
  scope: CouponScope;
  scopeId?: string;         // storeId, productId ou categoryId
  value: number;            // % ou R$ dependendo do type
  minimumOrder: number;
  maxUses: number;
  usedCount: number;
  perUserLimit: number;
  usedByCustomer?: boolean;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export type PricingError =
  | 'BELOW_MINIMUM_ORDER'
  | 'OUTSIDE_DELIVERY_RADIUS'
  | 'COUPON_EXPIRED'
  | 'COUPON_INVALID'
  | 'COUPON_MIN_ORDER_NOT_MET'
  | 'COUPON_ALREADY_USED';

export interface CouponValidationResult {
  valid: boolean;
  coupon?: CouponCode;
  discountAmount: number;
  error?: PricingError;
  message?: string;
}

/**
 * Motor de Cupons
 * Valida cupons e calcula o desconto aplicável.
 */
export const validateCoupon = (
  code: string,
  customerId: string,
  subtotal: number,
  storeId: string,
  orderHistory: Order[],
  availableCoupons: CouponCode[] // Adicionado para simular busca no sistema
): CouponValidationResult => {
  const now = new Date();

  // 1. Existe no sistema?
  const coupon = availableCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) {
    return { valid: false, discountAmount: 0, error: 'COUPON_INVALID', message: 'Cupom não encontrado' };
  }

  // 2. Está ativo?
  if (!coupon.active) {
    return { valid: false, discountAmount: 0, error: 'COUPON_INVALID', message: 'Cupom inativo' };
  }

  // 3. Dentro da validade?
  const validFrom = new Date(coupon.validFrom);
  const validUntil = new Date(coupon.validUntil);
  if (now < validFrom || now > validUntil) {
    return { valid: false, discountAmount: 0, error: 'COUPON_EXPIRED', message: 'Cupom fora do prazo de validade' };
  }

  // 4. Não excedeu maxUses global?
  if (coupon.usedCount >= coupon.maxUses) {
    return { valid: false, discountAmount: 0, error: 'COUPON_ALREADY_USED', message: 'Limite global de usos atingido' };
  }

  // 5. Cliente não excedeu perUserLimit?
  // Aqui assumimos que orderHistory contém os pedidos do cliente
  const customerUses = orderHistory.filter(o => o.items.some(i => i.nome === coupon.code)).length; // Simulação simples
  if (customerUses >= coupon.perUserLimit) {
    return { valid: false, discountAmount: 0, error: 'COUPON_ALREADY_USED', message: 'Você já atingiu o limite de usos deste cupom' };
  }

  // 6. Escopo compatível com a loja atual?
  if (coupon.scope === 'store' && coupon.scopeId !== storeId) {
    return { valid: false, discountAmount: 0, error: 'COUPON_INVALID', message: 'Cupom não é válido para esta loja' };
  }

  // 7. Subtotal >= minimumOrder?
  if (subtotal < coupon.minimumOrder) {
    return { valid: false, discountAmount: 0, error: 'COUPON_MIN_ORDER_NOT_MET', message: `Pedido mínimo de R$ ${coupon.minimumOrder.toFixed(2)} não atingido` };
  }

  // 8. Se type 'first_order': cliente não tem pedido entregue anterior?
  if (coupon.type === 'first_order') {
    const hasPreviousOrders = orderHistory.some(o => o.status === 'concluido' || o.status === 'entrega');
    if (hasPreviousOrders) {
      return { valid: false, discountAmount: 0, error: 'COUPON_INVALID', message: 'Este cupom é válido apenas para o primeiro pedido' };
    }
  }

  // Cálculo do desconto
  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = subtotal * (coupon.value / 100);
  } else if (coupon.type === 'fixed') {
    discountAmount = coupon.value;
  } else if (coupon.type === 'free_delivery') {
    // O desconto de frete grátis é calculado no pricingEngine
    discountAmount = 0; 
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: 'Cupom aplicado com sucesso'
  };
};
