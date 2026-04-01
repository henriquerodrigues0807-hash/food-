import { useState, useMemo } from 'react';
import { validateOrder, OrderValidationResult } from '../../shared/engines/orderValidationEngine';
import { CartItem, Store, User as Customer } from '../../shared/types/index';
import { DeliveryMode } from '../../shared/orderStateMachine';
import { PricingResult } from '../../shared/engines/pricingEngine';

/**
 * Hook para validação de integridade do pedido.
 * Reage a mudanças no carrinho, loja e modo de entrega.
 */
export const useOrderValidation = (
  cartItems: CartItem[],
  store: Store,
  customer: Customer,
  mode: DeliveryMode,
  pricing: PricingResult
) => {
  const validationResult = useMemo<OrderValidationResult>(() => {
    return validateOrder(cartItems, store, customer, mode, pricing);
  }, [cartItems, store, customer, mode, pricing]);

  return {
    validation: validationResult,
    isValid: validationResult.valid,
    errors: validationResult.errors,
    warnings: validationResult.warnings,
    sanitizedItems: validationResult.sanitizedItems
  };
};
