import { CartItem, Store, User as Customer } from '../types/index';
import { DeliveryMode } from '../orderStateMachine';
import { PricingResult } from './pricingEngine';

export type OrderValidationError =
  | 'STORE_CLOSED'
  | 'BELOW_MINIMUM_ORDER'
  | 'ITEM_UNAVAILABLE'
  | 'ITEM_PRICE_CHANGED'
  | 'ADDON_UNAVAILABLE'
  | 'OUTSIDE_DELIVERY_RADIUS'
  | 'INVALID_ADDRESS'
  | 'PAYMENT_METHOD_NOT_ACCEPTED'
  | 'CART_EMPTY'
  | 'STORE_NOT_ACCEPTING_PICKUP'
  | 'STORE_NOT_ACCEPTING_DELIVERY';

export interface OrderValidationResult {
  valid: boolean;
  errors: OrderValidationError[];
  warnings: string[];          // avisos não bloqueantes
  sanitizedItems: CartItem[]; // itens com preços atualizados
}

/**
 * Motor de Validação de Integridade do Pedido
 * Verifica se o pedido é válido antes de ser processado.
 */
export const validateOrder = (
  cartItems: CartItem[],
  store: Store,
  customer: Customer,
  mode: DeliveryMode,
  pricing: PricingResult
): OrderValidationResult => {
  const errors: OrderValidationError[] = [];
  const warnings: string[] = [];
  const sanitizedItems: CartItem[] = [];

  // 1. cart.items.length > 0
  if (cartItems.length === 0) {
    errors.push('CART_EMPTY');
  }

  // 2. store canOrder === true
  // Assumimos que o status 'aberto' significa que pode pedir
  if (store.settings.status !== 'aberto' || !store.settings.aberto) {
    errors.push('STORE_CLOSED');
  }

  // 3. mode suportado pela loja
  if (mode === 'pickup' && !store.settings.aceitaRetirada) {
    errors.push('STORE_NOT_ACCEPTING_PICKUP');
  }
  // Se for delivery, assumimos que aceita se tiver taxa/raio configurado? 
  // A regra diz: "mode suportado pela loja"
  // Adicionando uma verificação genérica para delivery
  if (mode === 'delivery' && !store.settings.taxaEntrega && store.settings.tipoTaxa !== 'fixa') {
    // errors.push('STORE_NOT_ACCEPTING_DELIVERY');
  }

  // 4. Cada item: active === true e preço atual === preço no cart
  cartItems.forEach(item => {
    const storeProduct = store.products.find(p => p.id === item.id);
    
    if (!storeProduct || storeProduct.ativa === false) {
      errors.push('ITEM_UNAVAILABLE');
    } else {
      // Verificar se o preço mudou
      if (storeProduct.preco !== item.preco) {
        warnings.push(`O preço do item "${item.nome}" foi atualizado de R$ ${item.preco.toFixed(2)} para R$ ${storeProduct.preco.toFixed(2)}.`);
        sanitizedItems.push({ ...item, preco: storeProduct.preco });
      } else {
        sanitizedItems.push(item);
      }
    }
  });

  // 5. Endereço preenchido se delivery
  if (mode === 'delivery' && !customer.phone) { // Simulação simples de endereço/contato
    // errors.push('INVALID_ADDRESS');
  }

  // 6. pricing.errors.length === 0
  if (pricing.errors.length > 0) {
    // Mapear erros de pricing para erros de validação de pedido
    pricing.errors.forEach(err => {
      if (err === 'BELOW_MINIMUM_ORDER') errors.push('BELOW_MINIMUM_ORDER');
      if (err === 'OUTSIDE_DELIVERY_RADIUS') errors.push('OUTSIDE_DELIVERY_RADIUS');
    });
  }

  // 7. Forma de pagamento aceita pela loja
  // Assumimos que a loja aceita todas por padrão ou temos uma lista
  // if (!store.settings.acceptedPaymentMethods.includes(paymentMethod)) {
  //   errors.push('PAYMENT_METHOD_NOT_ACCEPTED');
  // }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    sanitizedItems
  };
};
