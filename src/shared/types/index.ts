/**
 * Global Types for Food App
 */

export type UserRole = "cliente" | "vendedor" | "entregador" | "admin";

export interface User {
  id: string;
  tipo: UserRole;
  name: string;
  email?: string;
  avatarUrl?: string;
  phone?: string;
  createdAt?: string;
}

export type StoreStatus = "aberto" | "fechado" | "indisponivel";

export interface StoreSettings {
  nome: string;
  descricao: string;
  categoria: string;
  corPrincipal: string;
  logo: string;
  banner: string;
  horario: string;
  aberto: boolean;
  status: StoreStatus;
  taxaEntrega: number;
  raioEntrega: number;
  tipoTaxa: "fixa" | "dinamica";
  valorTaxa: number;
  tipoEntregador: "fixo" | "rotativo";
  tempoPreparo: string;
  aceitaRetirada: boolean;
  whatsapp: string;
  pedidoMinimo: number;
  lat: number;
  lng: number;
  rating?: number;
  totalRatings?: number;
}

export type ProductType = "normal" | "pizza" | "adicionais";

export interface Addon {
  id: number;
  nome: string;
  preco: number;
}

export interface Sabor {
  nome: string;
  preco: number;
}

export interface Product {
  id: number;
  nome: string;
  preco: number;
  image: string;
  description: string;
  categoria: string;
  tipo: ProductType;
  promocao?: {
    tipo: "percentual" | "fixo";
    valor: number;
  };
  sabores?: string[]; // Deprecated
  opcoesSabores?: Sabor[];
  opcoesAdicionais?: Addon[];
  ativa?: boolean;
  ordem?: number;
}

export interface CartItem extends Product {
  cartId: string;
  saboresSelecionados?: Sabor[];
  adicionaisSelecionados?: Addon[];
  observacao?: string;
  quantidade: number;
  precoFinal: number;
}

export type OrderStatus = 
  | "novo" 
  | "aceito" 
  | "preparo" 
  | "pronto" 
  | "entrega" 
  | "concluido" 
  | "cancelado";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  data: string;
  cliente: {
    nome: string;
    endereco?: string | Address;
    telefone?: string;
    pagamento?: string;
  };
  entregadorId?: string;
  distancia?: number; // km
  valorEntrega?: number;
  agendadoPara?: string; // ISO string
  lat?: number;
  lng?: number;
  lojaId?: string;
  lojaSlug?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  number: string;
  neighborhood: string;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;
  reference?: string;
}

export interface Promotion {
  id: string;
  nome: string;
  tipo: "percentual" | "fixo" | "combo";
  valor: number;
  ativa: boolean;
  horarioInicio?: string;
  horarioFim?: string;
  produtosIds?: number[];
}

export interface DeliveryDriver {
  id: string;
  nome: string;
  tipo: "rotativo" | "fixo";
  status: "online" | "offline" | "busy";
  pedidosAtuais: string[]; // IDs dos pedidos
  historicoPedidos: string[];
  horarioTrabalho: {
    inicio: string;
    fim: string;
    dias: number[];
  };
  limitePedidos: number;
  lat: number;
  lng: number;
  veiculo?: string;
  placa?: string;
  ganhosTotais?: number;
  rating?: number;
  totalRatings?: number;
  avatarUrl?: string;
  verifiedAt?: string;
}

export interface Store {
  id: string;
  slug: string;
  settings: StoreSettings;
  products: Product[];
  orders: Order[];
  promocoes: Promotion[];
  entregadores: DeliveryDriver[];
}

export interface Rating {
  id: string;
  orderId: string;
  fromRole: 'customer' | 'seller';
  targetType: 'store' | 'driver';
  targetId: string;
  score: 1 | 2 | 3 | 4 | 5;
  comment?: string;
  createdAt: string;
}

export type NotificationType =
  | 'new_order'
  | 'order_ready'
  | 'driver_assigned'
  | 'order_delivered'
  | 'order_cancelled'
  | 'rating_received'
  | 'document_approved';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
