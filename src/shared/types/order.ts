import { OrderStatus, DeliveryMode } from '../orderStateMachine';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  addons: OrderAddon[];
  observation?: string;
  imageUrl?: string;
}

export interface OrderAddon {
  id: string;
  name: string;
  price: number;
}

export interface OrderAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  lat?: number;
  lng?: number;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'pix' | 'cash';

export interface PaymentInfo {
  method: PaymentMethod;
  changeFor?: number;       // se pagamento em dinheiro
  installments?: number;    // se cartão de crédito
  pixCode?: string;         // simulado
  status: 'pending' | 'approved' | 'failed' | 'refunded';
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  timestamp: string;
  actor: 'customer' | 'seller' | 'driver' | 'system';
  message: string;
}

export interface Order {
  id: string;
  code: string;             // ex: "#1042" — exibido ao cliente
  storeId: string;
  storeName: string;
  storeSlug: string;
  customerId: string;
  customerName: string;
  driverId?: string;
  driverName?: string;

  mode: DeliveryMode;       // 'delivery' | 'pickup'
  status: OrderStatus;
  items: OrderItem[];

  address?: OrderAddress;   // obrigatório se mode === 'delivery'
  payment: PaymentInfo;

  subtotal: number;
  deliveryFee: number;      // 0 se pickup
  discount: number;
  total: number;

  estimatedMinutes?: number;
  acceptedAt?: string;
  preparedAt?: string;
  driverAssignedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  cancelReason?: string;

  confirmationCode?: string; // 4 dígitos para entrega/retirada

  timeline: OrderTimelineEntry[];
  createdAt: string;
  updatedAt: string;
}
