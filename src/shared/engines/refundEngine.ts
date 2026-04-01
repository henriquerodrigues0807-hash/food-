import { OrderStatus } from '../orderStateMachine';

export type CancellationActor = 'customer' | 'seller' | 'system';

export type RefundPolicy =
  | 'full_refund'         // 100% de volta
  | 'partial_refund'      // ex: 50% de volta
  | 'no_refund'           // 0% de volta
  | 'store_credit';        // crédito p/ próxima compra

export interface CancellationRule {
  status: OrderStatus;
  actor: CancellationActor;
  policy: RefundPolicy;
  penaltySeller?: number;    // taxa p/ o vendedor se cancelar
  penaltyCustomer?: number;  // taxa p/ o cliente se cancelar
}

export interface RefundResult {
  eligible: boolean;
  refundAmount: number;
  penaltyAmount: number;
  policy: RefundPolicy;
  reason: string;
}

/**
 * Motor de Reembolsos e Cancelamentos
 * Avalia a elegibilidade e o valor do reembolso com base no estado do pedido.
 */
export const evaluateRefund = (
  orderTotal: number,
  status: OrderStatus,
  actor: CancellationActor,
  rules: CancellationRule[]
): RefundResult => {
  // 1. Encontrar regra correspondente ao status e ator
  const rule = rules.find(r => r.status === status && r.actor === actor);

  if (!rule) {
    return {
      eligible: false,
      refundAmount: 0,
      penaltyAmount: 0,
      policy: 'no_refund',
      reason: 'Nenhuma regra de cancelamento encontrada para este estado'
    };
  }

  // 2. Calcular valor do reembolso
  let refundAmount = 0;
  if (rule.policy === 'full_refund') {
    refundAmount = orderTotal;
  } else if (rule.policy === 'partial_refund') {
    refundAmount = orderTotal * 0.5; // Exemplo: 50%
  } else if (rule.policy === 'store_credit') {
    refundAmount = orderTotal; // Crédito total
  }

  // 3. Aplicar penalidades
  const penaltyAmount = actor === 'seller' ? (rule.penaltySeller || 0) : (rule.penaltyCustomer || 0);
  
  // O valor final do reembolso pode ser reduzido pela penalidade do cliente?
  // A regra diz: "penaltySeller: taxa p/ o vendedor se cancelar"
  // Geralmente penalidade do cliente reduz o reembolso
  if (actor === 'customer') {
    refundAmount = Math.max(0, refundAmount - penaltyAmount);
  }

  return {
    eligible: true,
    refundAmount,
    penaltyAmount,
    policy: rule.policy,
    reason: `Cancelamento por ${actor} no estado ${status} resulta em ${rule.policy}`
  };
};

/**
 * Regras padrão de cancelamento
 */
export const DEFAULT_CANCELLATION_RULES: CancellationRule[] = [
  // Cliente cancela antes do vendedor aceitar
  { status: 'pending', actor: 'customer', policy: 'full_refund' },
  // Cliente cancela após vendedor aceitar mas antes de preparar
  { status: 'confirmed', actor: 'customer', policy: 'full_refund', penaltyCustomer: 2.00 },
  // Cliente cancela durante preparo (perda de insumos)
  { status: 'preparing', actor: 'customer', policy: 'partial_refund', penaltyCustomer: 5.00 },
  // Cliente cancela com pedido pronto ou em rota (perda total)
  { status: 'ready', actor: 'customer', policy: 'no_refund' },
  { status: 'in_transit', actor: 'customer', policy: 'no_refund' },

  // Vendedor cancela pedido pendente (sem penalidade)
  { status: 'pending', actor: 'seller', policy: 'full_refund' },
  // Vendedor cancela após aceitar (penalidade por quebra de expectativa)
  { status: 'confirmed', actor: 'seller', policy: 'full_refund', penaltySeller: 5.00 },
  // Vendedor cancela durante preparo
  { status: 'preparing', actor: 'seller', policy: 'full_refund', penaltySeller: 10.00 },

  // Sistema cancela por falta de entregador
  { status: 'waiting_driver', actor: 'system', policy: 'full_refund' },
];
