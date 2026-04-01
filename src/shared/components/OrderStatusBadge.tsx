import React from "react";
import { OrderStatus } from "../../shared/orderStateMachine";
import { Badge } from "./ui/Badge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: any }> = {
  pending: { label: 'Pendente', variant: 'warning' },
  confirmed: { label: 'Confirmado', variant: 'info' },
  rejected: { label: 'Recusado', variant: 'danger' },
  preparing: { label: 'Em Preparo', variant: 'primary' },
  ready: { label: 'Pronto', variant: 'success' },
  waiting_driver: { label: 'Buscando Entregador', variant: 'warning' },
  driver_assigned: { label: 'Entregador Atribuído', variant: 'info' },
  collecting: { label: 'Coletando', variant: 'info' },
  collected: { label: 'Coletado', variant: 'primary' },
  in_transit: { label: 'Em Rota', variant: 'primary' },
  delivered: { label: 'Entregue', variant: 'success' },
  ready_for_pickup: { label: 'Pronto para Retirada', variant: 'success' },
  picked_up: { label: 'Retirado', variant: 'success' },
  cancelled_by_customer: { label: 'Cancelado pelo Cliente', variant: 'danger' },
  cancelled_by_seller: { label: 'Cancelado pelo Vendedor', variant: 'danger' },
  cancelled_no_driver: { label: 'Sem Entregadores', variant: 'danger' },
  failed: { label: 'Falhou', variant: 'danger' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, className }) => {
  const config = STATUS_CONFIG[status];
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};
