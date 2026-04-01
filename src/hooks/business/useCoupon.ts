import { useState, useCallback } from 'react';
import { validateCoupon, CouponCode, CouponValidationResult } from '../../shared/engines/couponEngine';
import { Order } from '../../shared/types/index';

/**
 * Hook para validação de cupons em tempo real.
 * Gerencia o estado do cupom aplicado e erros de validação.
 */
export const useCoupon = (
  customerId: string,
  storeId: string,
  orderHistory: Order[],
  availableCoupons: CouponCode[]
) => {
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [validationResult, setValidationResult] = useState<CouponValidationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const applyCoupon = useCallback(async (code: string, subtotal: number) => {
    setLoading(true);
    try {
      // Simulação de delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = validateCoupon(
        code,
        customerId,
        subtotal,
        storeId,
        orderHistory,
        availableCoupons
      );

      setValidationResult(result);
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
      } else {
        setAppliedCoupon(null);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, [customerId, storeId, orderHistory, availableCoupons]);

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setValidationResult(null);
  };

  return {
    appliedCoupon,
    validationResult,
    applyCoupon,
    removeCoupon,
    loading
  };
};
