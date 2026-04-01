export type OrderStatus =
  // Fluxo compartilhado
  | 'pending'           // pedido criado, aguardando confirmação do vendedor
  | 'confirmed'         // vendedor aceitou
  | 'rejected'          // vendedor recusou
  | 'preparing'         // em preparo na cozinha
  | 'ready'             // pronto

  // Fluxo COM entregador
  | 'waiting_driver'    // aguardando entregador aceitar
  | 'driver_assigned'   // entregador aceitou
  | 'collecting'        // entregador indo buscar
  | 'collected'         // entregador coletou
  | 'in_transit'        // a caminho do cliente
  | 'delivered'         // entregue com sucesso

  // Fluxo SEM entregador (retirada)
  | 'ready_for_pickup'  // pronto para retirada
  | 'picked_up'         // cliente retirou

  // Cancelamentos
  | 'cancelled_by_customer'
  | 'cancelled_by_seller'
  | 'cancelled_no_driver'   // timeout sem entregador disponível
  | 'failed'

export type DeliveryMode = 'delivery' | 'pickup'

export interface OrderEvent {
  from: OrderStatus
  to: OrderStatus
  actor: 'customer' | 'seller' | 'driver' | 'system'
  label: string
}

// Transições válidas — nenhuma transição fora desta lista é permitida
export const ORDER_TRANSITIONS: OrderEvent[] = [
  // Vendedor
  { from: 'pending',          to: 'confirmed',         actor: 'seller',   label: 'Confirmar pedido' },
  { from: 'pending',          to: 'rejected',          actor: 'seller',   label: 'Recusar pedido' },
  { from: 'confirmed',        to: 'preparing',         actor: 'seller',   label: 'Iniciar preparo' },
  { from: 'preparing',        to: 'ready',             actor: 'seller',   label: 'Marcar como pronto' },

  // Fluxo delivery
  { from: 'ready',            to: 'waiting_driver',    actor: 'system',   label: 'Buscar entregador' },
  { from: 'waiting_driver',   to: 'driver_assigned',   actor: 'driver',   label: 'Aceitar corrida' },
  { from: 'driver_assigned',  to: 'collecting',        actor: 'driver',   label: 'Indo buscar' },
  { from: 'collecting',       to: 'collected',         actor: 'driver',   label: 'Pedido coletado' },
  { from: 'collected',        to: 'in_transit',        actor: 'driver',   label: 'Em rota' },
  { from: 'in_transit',       to: 'delivered',         actor: 'driver',   label: 'Entrega confirmada' },

  // Fluxo pickup
  { from: 'ready',            to: 'ready_for_pickup',  actor: 'seller',   label: 'Disponível para retirada' },
  { from: 'ready_for_pickup', to: 'picked_up',         actor: 'customer', label: 'Retirado pelo cliente' },

  // Cancelamentos
  { from: 'pending',          to: 'cancelled_by_customer', actor: 'customer', label: 'Cancelar' },
  { from: 'confirmed',        to: 'cancelled_by_customer', actor: 'customer', label: 'Cancelar' },
  { from: 'waiting_driver',   to: 'cancelled_no_driver',   actor: 'system',   label: 'Timeout sem entregador' },
]

export const canTransition = (from: OrderStatus, to: OrderStatus, actor: 'customer' | 'seller' | 'driver' | 'system'): boolean =>
  ORDER_TRANSITIONS.some(t => t.from === from && t.to === to && t.actor === actor)

export const getNextTransitions = (from: OrderStatus, actor: 'customer' | 'seller' | 'driver' | 'system'): OrderEvent[] =>
  ORDER_TRANSITIONS.filter(t => t.from === from && t.actor === actor)
