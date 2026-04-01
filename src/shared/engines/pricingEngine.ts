import { CouponCode } from './couponEngine';

export type PaymentMethod = 'credit_card' | 'pix' | 'cash' | 'wallet';

export interface PricingInput {
  subtotal: number;
  deliveryMode: 'delivery' | 'pickup';
  distanceKm?: number;
  storeDeliveryConfig: StoreDeliveryConfig;
  coupon?: CouponCode;
  paymentMethod: PaymentMethod;
}

export interface StoreDeliveryConfig {
  feeType: 'fixed' | 'per_km' | 'free';
  fixedFee?: number;
  pricePerKm?: number;
  freeAbove?: number;        // frete grátis acima de R$ X
  maxRadiusKm: number;
  minimumOrder: number;
}

export interface PricingResult {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  couponDiscount: number;
  total: number;
  breakdown: PricingBreakdownEntry[];
  errors: PricingError[];
}

export interface PricingBreakdownEntry {
  label: string;
  value: number;
  type: 'add' | 'subtract' | 'neutral';
}

export type PricingError =
  | 'BELOW_MINIMUM_ORDER'
  | 'OUTSIDE_DELIVERY_RADIUS'
  | 'COUPON_EXPIRED'
  | 'COUPON_INVALID'
  | 'COUPON_MIN_ORDER_NOT_MET'
  | 'COUPON_ALREADY_USED';

/**
 * Motor de Precificação
 * Calcula o total do pedido considerando taxas, descontos e cupons.
 */
export const calculatePricing = (input: PricingInput): PricingResult => {
  const {
    subtotal,
    deliveryMode,
    distanceKm,
    storeDeliveryConfig,
    coupon,
  } = input;

  const errors: PricingError[] = [];
  const breakdown: PricingBreakdownEntry[] = [
    { label: 'Subtotal', value: subtotal, type: 'neutral' }
  ];

  // 1. Validação de pedido mínimo
  if (subtotal < storeDeliveryConfig.minimumOrder) {
    errors.push('BELOW_MINIMUM_ORDER');
  }

  // 2. Cálculo da taxa de entrega
  let deliveryFee = 0;
  if (deliveryMode === 'delivery') {
    // Validação de raio máximo
    if (distanceKm !== undefined && distanceKm > storeDeliveryConfig.maxRadiusKm) {
      errors.push('OUTSIDE_DELIVERY_RADIUS');
    }

    if (storeDeliveryConfig.feeType === 'fixed') {
      deliveryFee = storeDeliveryConfig.fixedFee || 0;
    } else if (storeDeliveryConfig.feeType === 'per_km') {
      if (distanceKm === undefined) {
        // Se for per_km e não tiver distância, assumimos erro ou 0? 
        // A regra diz distanceKm obrigatório
        deliveryFee = 0;
      } else {
        deliveryFee = distanceKm * (storeDeliveryConfig.pricePerKm || 0);
      }
    }

    // Regra freeAbove
    if (storeDeliveryConfig.freeAbove !== undefined && subtotal >= storeDeliveryConfig.freeAbove) {
      deliveryFee = 0;
    }

    if (deliveryFee > 0) {
      breakdown.push({ label: 'Taxa de Entrega', value: deliveryFee, type: 'add' });
    } else if (storeDeliveryConfig.feeType !== 'free' || (storeDeliveryConfig.freeAbove !== undefined && subtotal >= storeDeliveryConfig.freeAbove)) {
      breakdown.push({ label: 'Entrega Grátis', value: 0, type: 'neutral' });
    }
  }

  // 3. Cálculo de descontos de cupom
  let couponDiscount = 0;
  if (coupon) {
    // Validações básicas do cupom (mais detalhadas no couponEngine)
    if (!coupon.active) {
      errors.push('COUPON_INVALID');
    } else if (new Date() > new Date(coupon.validUntil)) {
      errors.push('COUPON_EXPIRED');
    } else if (subtotal < coupon.minimumOrder) {
      errors.push('COUPON_MIN_ORDER_NOT_MET');
    } else if (coupon.usedCount >= coupon.maxUses) {
      errors.push('COUPON_ALREADY_USED');
    } else {
      // Aplicação do desconto
      if (coupon.type === 'percentage') {
        couponDiscount = subtotal * (coupon.value / 100);
      } else if (coupon.type === 'fixed') {
        couponDiscount = coupon.value;
      } else if (coupon.type === 'free_delivery') {
        couponDiscount = deliveryFee;
        deliveryFee = 0; // Zera a taxa se for cupom de frete grátis
      }
      
      if (couponDiscount > 0) {
        breakdown.push({ label: `Cupom: ${coupon.code}`, value: couponDiscount, type: 'subtract' });
      }
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - couponDiscount);

  return {
    subtotal,
    deliveryFee,
    discount: couponDiscount, // Simplificado, pode haver outros descontos no futuro
    couponDiscount,
    total,
    breakdown,
    errors
  };
};
