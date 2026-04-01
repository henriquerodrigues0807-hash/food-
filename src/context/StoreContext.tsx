import { createContext, useContext, useState, ReactNode } from "react";
import { Product, CartItem } from "./CartContext";
import { toast } from "sonner";

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "novo" | "aceito" | "preparo" | "pronto" | "entrega" | "concluido" | "cancelado";
  data: string;
  cliente: {
    nome: string;
    endereco?: string | {
      street: string;
      number: string;
      neighborhood: string;
      complement?: string;
      reference?: string;
    };
    telefone?: string;
    pagamento?: string;
  };
  entregadorId?: string;
  distancia?: number; // km
  valorEntrega?: number;
  agendadoPara?: string; // ISO string
  lat?: number;
  lng?: number;
}

export interface DeliveryDriver {
  id: string;
  nome: string;
  tipo: "rotativo" | "fixo";
  status: "online" | "offline";
  pedidosAtuais: string[]; // IDs dos pedidos
  historicoPedidos: string[];
  horarioTrabalho: {
    inicio: string; // "08:00"
    fim: string; // "22:00"
    dias: number[]; // [0, 1, 2, 3, 4, 5, 6] (dom-sab)
  };
  limitePedidos: number;
  lat: number;
  lng: number;
  veiculo?: string;
  placa?: string;
  ganhosTotais?: number;
}

interface StoreSettings {
  nome: string;
  descricao: string;
  categoria: string;
  corPrincipal: string;
  logo: string;
  banner: string;
  horario: string;
  aberto: boolean;
  status: "aberto" | "fechado";
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

export interface Store {
  id: string;
  slug: string;
  settings: StoreSettings;
  products: Product[];
  orders: Order[];
  promocoes: Promotion[];
  entregadores: DeliveryDriver[];
}

interface StoreActionOptions {
  silent?: boolean;
}

interface StoreContextType {
  stores: Store[];
  getStoreBySlug: (slug: string) => Store | undefined;
  updateStoreSettings: (slug: string, newSettings: Partial<StoreSettings>) => void;
  addOrderToStore: (slug: string, order: Omit<Order, "id" | "data" | "status">, options?: StoreActionOptions) => string | undefined;
  updateOrderStatus: (slug: string, orderId: string, status: Order["status"], options?: StoreActionOptions) => boolean;
  addProductToStore: (slug: string, product: Omit<Product, "id">) => void;
  updateProductInStore: (slug: string, productId: number, product: Partial<Product>) => void;
  deleteProductFromStore: (slug: string, productId: number) => void;
  toggleStoreStatus: (slug: string) => void;
  addPromotionToStore: (slug: string, promotion: Omit<Promotion, "id">) => void;
  updatePromotionInStore: (slug: string, promoId: string, updatedPromo: Partial<Promotion>) => void;
  deletePromotionFromStore: (slug: string, promoId: string) => void;
  // Delivery Driver functions
  addDriverToStore: (slug: string, driver: Omit<DeliveryDriver, "id" | "pedidosAtuais" | "historicoPedidos">) => void;
  updateDriverStatus: (slug: string, driverId: string, status: DeliveryDriver["status"]) => void;
  assignOrderToDriver: (slug: string, orderId: string, driverId: string, options?: StoreActionOptions) => boolean;
  autoAssignOrder: (slug: string, orderId: string) => void;
  completeDelivery: (slug: string, orderId: string, driverId: string) => void;
  updateDriverLocation: (slug: string, driverId: string, lat: number, lng: number) => void;
}

const initialProducts: Product[] = [
  { 
    id: 1, 
    nome: "Classic Cheeseburger", 
    preco: 25, 
    image: "https://picsum.photos/seed/burger1/400/300",
    description: "Hambúrguer artesanal de 180g, queijo cheddar derretido, alface, tomate e molho especial no pão brioche.",
    categoria: "Burgers",
    tipo: "adicionais",
    promocao: { tipo: "percentual", valor: 10 },
    opcoesAdicionais: [
      { id: 101, nome: "Bacon Crocante", preco: 5 },
      { id: 102, nome: "Ovo Frito", preco: 3 },
      { id: 103, nome: "Queijo Extra", preco: 4 }
    ]
  },
  { 
    id: 2, 
    nome: "Pizza Artesanal", 
    preco: 45, 
    image: "https://picsum.photos/seed/pizza1/400/300",
    description: "Nossa famosa pizza de fermentação natural. Escolha até 2 sabores.",
    categoria: "Pizza",
    tipo: "pizza",
    sabores: ["Calabresa", "Margherita", "Portuguesa", "Quatro Queijos", "Frango com Catupiry", "Pepperoni"]
  },
  { 
    id: 3, 
    nome: "Combo Família", 
    preco: 85, 
    image: "https://picsum.photos/seed/combo1/400/300",
    description: "2 Burgers + Batata Grande + Coca 1.5L. O melhor custo benefício.",
    categoria: "Combos",
    tipo: "normal",
    promocao: { tipo: "fixo", valor: 15 }
  },
  { 
    id: 4, 
    nome: "Coca-Cola 350ml", 
    preco: 6, 
    image: "https://picsum.photos/seed/coke/400/300",
    description: "Lata gelada.",
    categoria: "Bebidas",
    tipo: "normal"
  }
];

const initialStores: Store[] = [
  {
    id: "1",
    slug: "foodi-gourmet",
    settings: {
      nome: "Foodi Gourmet",
      descricao: "O melhor da culinária artesanal na sua porta.",
      categoria: "Hambúrgueres & Pizzas",
      corPrincipal: "#F97316",
      logo: "https://picsum.photos/seed/foodilogo/200/200",
      banner: "https://picsum.photos/seed/foodibanner/1200/400",
      horario: "18:00 - 23:00",
      aberto: true,
      status: "aberto",
      taxaEntrega: 7.00,
      raioEntrega: 10,
      tipoTaxa: "fixa",
      valorTaxa: 7.00,
      tipoEntregador: "rotativo",
      tempoPreparo: "30-45 min",
      aceitaRetirada: true,
      whatsapp: "5511999999999",
      pedidoMinimo: 20.00,
      lat: -23.5505,
      lng: -46.6333,
    },
    products: initialProducts,
    orders: [],
    promocoes: [
      {
        id: "p1",
        nome: "Desconto de Inauguração",
        tipo: "percentual",
        valor: 10,
        ativa: true,
        horarioInicio: "18:00",
        horarioFim: "23:59"
      }
    ],
    entregadores: [],
  },
  {
    id: "2",
    slug: "sushi-master",
    settings: {
      nome: "Sushi Master",
      descricao: "O autêntico sabor do Japão.",
      categoria: "Japonesa",
      corPrincipal: "#EF4444",
      logo: "https://picsum.photos/seed/sushilogo/200/200",
      banner: "https://picsum.photos/seed/sushibanner/1200/400",
      horario: "11:00 - 22:00",
      aberto: true,
      status: "aberto",
      taxaEntrega: 8.00,
      raioEntrega: 8,
      tipoTaxa: "dinamica",
      valorTaxa: 2.50,
      tipoEntregador: "rotativo",
      tempoPreparo: "40-60 min",
      aceitaRetirada: false,
      whatsapp: "5511999999999",
      pedidoMinimo: 30.00,
      lat: -23.5596,
      lng: -46.6581,
    },
    products: [
      {
        id: 5,
        nome: "Combo Sushi 20 Peças",
        preco: 65,
        image: "https://picsum.photos/seed/sushi1/400/300",
        description: "Mix de sushis variados: salmão, atum e califórnia.",
        categoria: "Combos",
        tipo: "normal"
      }
    ],
    orders: [],
    promocoes: [],
    entregadores: [],
  },
  {
    id: "3",
    slug: "pasta-casa",
    settings: {
      nome: "Pasta Casa",
      descricao: "Massas frescas feitas com amor.",
      categoria: "Italiana",
      corPrincipal: "#10B981",
      logo: "https://picsum.photos/seed/pastalogo/200/200",
      banner: "https://picsum.photos/seed/pastabanner/1200/400",
      horario: "12:00 - 21:00",
      aberto: true,
      status: "aberto",
      taxaEntrega: 6.00,
      raioEntrega: 12,
      tipoTaxa: "fixa",
      valorTaxa: 6.00,
      tipoEntregador: "fixo",
      tempoPreparo: "35-50 min",
      aceitaRetirada: true,
      whatsapp: "5511999999999",
      pedidoMinimo: 25.00,
      lat: -23.5617,
      lng: -46.6623,
    },
    products: [
      {
        id: 6,
        nome: "Lasanha Bolonhesa",
        preco: 38,
        image: "https://picsum.photos/seed/pasta1/400/300",
        description: "Lasanha clássica com molho artesanal e muito queijo.",
        categoria: "Massas",
        tipo: "normal"
      }
    ],
    orders: [],
    promocoes: [],
    entregadores: [],
  },
  {
    id: "4",
    slug: "burger-house",
    settings: {
      nome: "Burger House",
      descricao: "Hambúrgueres suculentos e pizzas artesanais.",
      categoria: "Hambúrgueres & Pizzas",
      corPrincipal: "#F59E0B",
      logo: "https://picsum.photos/seed/burgerhouse/200/200",
      banner: "https://picsum.photos/seed/burgerbanner/1200/400",
      horario: "18:00 - 23:30",
      aberto: true,
      status: "aberto",
      taxaEntrega: 5.00,
      raioEntrega: 5,
      tipoTaxa: "dinamica",
      valorTaxa: 2.00,
      tipoEntregador: "fixo",
      tempoPreparo: "25-40 min",
      aceitaRetirada: true,
      whatsapp: "5511999999999",
      pedidoMinimo: 15.00,
      lat: -23.5432,
      lng: -46.6411,
    },
    products: [
      {
        id: 10,
        nome: "Hambúrguer Clássico",
        preco: 20,
        image: "https://picsum.photos/seed/classic/400/300",
        description: "Hambúrguer de 150g, alface, tomate e molho especial.",
        categoria: "Burgers",
        tipo: "adicionais",
        promocao: { tipo: "percentual", valor: 10 },
        opcoesAdicionais: [
          { id: 201, nome: "Queijo Extra", preco: 5 },
          { id: 202, nome: "Bacon", preco: 7 }
        ]
      },
      {
        id: 11,
        nome: "Pizza Grande",
        preco: 0,
        image: "https://picsum.photos/seed/pizza-house/400/300",
        description: "Escolha dois sabores para sua pizza meio a meio.",
        categoria: "Pizzas",
        tipo: "pizza",
        opcoesSabores: [
          { nome: "Calabresa", preco: 50 },
          { nome: "Frango", preco: 60 },
          { nome: "Margherita", preco: 45 },
          { nome: "Portuguesa", preco: 55 }
        ]
      }
    ],
    orders: [
      {
        id: "ORDER-1",
        items: [],
        total: 50,
        status: "novo",
        data: new Date().toISOString(),
        cliente: { nome: "Maria", endereco: "Rua das Flores, 123", telefone: "11999999999" },
        distancia: 5,
        valorEntrega: 10,
        lat: -23.5450,
        lng: -46.6430
      },
      {
        id: "ORDER-2",
        items: [],
        total: 75,
        status: "novo",
        data: new Date().toISOString(),
        cliente: { nome: "José", endereco: "Av. Principal, 456", telefone: "11888888888" },
        distancia: 2.5,
        valorEntrega: 5,
        agendadoPara: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
        lat: -23.5410,
        lng: -46.6390
      }
    ],
    promocoes: [],
    entregadores: [
      {
        id: "DRIVER-1",
        nome: "João",
        tipo: "rotativo",
        status: "online",
        pedidosAtuais: [],
        historicoPedidos: [],
        horarioTrabalho: { inicio: "08:00", fim: "22:00", dias: [0, 1, 2, 3, 4, 5, 6] },
        limitePedidos: 3,
        lat: -23.5450,
        lng: -46.6400,
      },
      {
        id: "DRIVER-2",
        nome: "Carlos",
        tipo: "fixo",
        status: "online",
        pedidosAtuais: [],
        historicoPedidos: [],
        horarioTrabalho: { inicio: "10:00", fim: "20:00", dias: [1, 2, 3, 4, 5] },
        limitePedidos: 1,
        lat: -23.5480,
        lng: -46.6450,
      }
    ]
  },
  {
    id: "5",
    slug: "pizza-top",
    settings: {
      nome: "Pizza Top",
      descricao: "A melhor pizza da cidade.",
      categoria: "Pizzaria",
      corPrincipal: "#DC2626",
      logo: "https://picsum.photos/seed/pizzatoplogo/200/200",
      banner: "https://picsum.photos/seed/pizzatopbanner/1200/400",
      horario: "18:00 - 23:00",
      aberto: true,
      status: "aberto",
      taxaEntrega: 6.00,
      raioEntrega: 5,
      tipoTaxa: "dinamica",
      valorTaxa: 2.00,
      tipoEntregador: "rotativo",
      tempoPreparo: "20-30 min",
      aceitaRetirada: true,
      whatsapp: "5511999999999",
      pedidoMinimo: 15.00,
      lat: -7.2300,
      lng: -35.8810,
    },
    products: [
      {
        id: 101,
        nome: "Pizza Calabresa",
        preco: 50,
        image: "https://picsum.photos/seed/calabresa/400/300",
        description: "Molho de tomate, mussarela, calabresa e cebola.",
        categoria: "Pizzas",
        tipo: "pizza",
        sabores: ["Calabresa"]
      },
      {
        id: 102,
        nome: "Pizza Frango",
        preco: 60,
        image: "https://picsum.photos/seed/frango/400/300",
        description: "Molho de tomate, mussarela, frango desfiado e catupiry.",
        categoria: "Pizzas",
        tipo: "pizza",
        sabores: ["Frango com Catupiry"]
      },
      {
        id: 103,
        nome: "Refrigerante",
        preco: 8,
        image: "https://picsum.photos/seed/soda/400/300",
        description: "Lata 350ml.",
        categoria: "Bebidas",
        tipo: "normal"
      }
    ],
    orders: [],
    promocoes: [],
    entregadores: [
      {
        id: "d-joao",
        nome: "João",
        tipo: "rotativo",
        status: "online",
        veiculo: "Moto",
        placa: "ABC-1234",
        lat: -7.2210,
        lng: -35.8810,
        pedidosAtuais: [],
        historicoPedidos: [],
        horarioTrabalho: { inicio: "08:00", fim: "23:00", dias: [0, 1, 2, 3, 4, 5, 6] },
        limitePedidos: 3,
        ganhosTotais: 0
      }
    ],
  }
];

export function calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distância em km
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [stores, setStores] = useState<Store[]>(initialStores);

  const getStoreBySlug = (slug: string) => stores.find(s => s.slug === slug);

  const updateStoreSettings = (slug: string, newSettings: Partial<StoreSettings>) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, settings: { ...s.settings, ...newSettings } } : s
    ));
  };

  const addOrderToStore = (slug: string, orderData: Omit<Order, "id" | "data" | "status">, options?: StoreActionOptions) => {
    // 1. Find the store first to validate
    const s = stores.find(store => store.slug === slug);
    
    if (!s) {
      const error = `Erro: Loja com slug "${slug}" não encontrada.`;
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    // 2. Validation: Block empty cart or invalid price
    if (!orderData.items || orderData.items.length === 0) {
      const error = "Erro: Tentativa de criar pedido com carrinho vazio.";
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    if (orderData.total <= 0) {
      const error = "Erro: Tentativa de criar pedido com valor inválido.";
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    // 3. If store is closed, block order (extra safety)
    if (!s.settings.aberto) {
      const error = "Erro: A loja está fechada no momento.";
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    // 4. Minimum order check
    if (orderData.total < s.settings.pedidoMinimo) {
      const error = `Erro: O pedido mínimo é de R$ ${s.settings.pedidoMinimo.toFixed(2)}.`;
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    // 5. Real distance calculation
    let realDist = orderData.distancia || 0;
    if (orderData.lat && orderData.lng) {
      realDist = calcularDistancia(s.settings.lat, s.settings.lng, orderData.lat, orderData.lng);
    }

    // 6. Radius check
    if (realDist > s.settings.raioEntrega) {
      const error = `Erro: Endereço fora do raio de entrega (${realDist.toFixed(2)}km > ${s.settings.raioEntrega}km).`;
      if (!options?.silent) {
        console.error(error);
        toast.error(error);
      }
      return;
    }

    // 7. Create the order
    const newOrderId = Math.random().toString(36).substring(2, 11).toUpperCase();
    const newOrder: Order = {
      ...orderData,
      distancia: realDist,
      id: newOrderId,
      data: new Date().toISOString(),
      status: "novo",
    };

    // 8. Update state
    setStores(prev => prev.map(store => 
      store.slug === slug ? { ...store, orders: [newOrder, ...store.orders] } : store
    ));

    console.log(`Pedido ${newOrderId} criado com sucesso para a loja ${slug}`);
    return newOrderId;
  };

  const updateOrderStatus = (slug: string, orderId: string, newStatus: Order["status"], options?: StoreActionOptions) => {
    let success = false;
    setStores(prev => prev.map(s => {
      if (s.slug !== slug) return s;

      const order = s.orders.find(o => o.id === orderId);
      if (!order) return s;

      // Strict status transition logic
      const currentStatus = order.status;
      const validTransitions: Record<Order["status"], Order["status"][]> = {
        "novo": ["aceito", "cancelado"],
        "aceito": ["preparo", "cancelado"],
        "preparo": ["pronto", "cancelado"],
        "pronto": ["entrega", "concluido", "cancelado"],
        "entrega": ["concluido", "cancelado"],
        "concluido": [],
        "cancelado": []
      };

      if (!validTransitions[currentStatus].includes(newStatus)) {
        const error = `Erro: Transição de status inválida: ${currentStatus} -> ${newStatus}`;
        if (!options?.silent) {
          console.error(error);
          toast.error(error);
        }
        return s;
      }

      success = true;
      return { 
        ...s, 
        orders: s.orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o) 
      };
    }));
    return success;
  };

  const addProductToStore = (slug: string, product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Math.floor(Math.random() * 1000000),
    };
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, products: [...s.products, newProduct] } : s
    ));
  };

  const updateProductInStore = (slug: string, productId: number, updatedProduct: Partial<Product>) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, products: s.products.map(p => p.id === productId ? { ...p, ...updatedProduct } : p) } : s
    ));
  };

  const deleteProductFromStore = (slug: string, productId: number) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, products: s.products.filter(p => p.id !== productId) } : s
    ));
  };

  const toggleStoreStatus = (slug: string) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, settings: { ...s.settings, aberto: !s.settings.aberto } } : s
    ));
  };

  const addPromotionToStore = (slug: string, promotion: Omit<Promotion, "id">) => {
    const newPromo: Promotion = {
      ...promotion,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
    };
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, promocoes: [...s.promocoes, newPromo] } : s
    ));
  };

  const updatePromotionInStore = (slug: string, promoId: string, updatedPromo: Partial<Promotion>) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, promocoes: s.promocoes.map(p => p.id === promoId ? { ...p, ...updatedPromo } : p) } : s
    ));
  };

  const deletePromotionFromStore = (slug: string, promoId: string) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, promocoes: s.promocoes.filter(p => p.id !== promoId) } : s
    ));
  };

  const addDriverToStore = (slug: string, driver: Omit<DeliveryDriver, "id" | "pedidosAtuais" | "historicoPedidos">) => {
    const newDriver: DeliveryDriver = {
      ...driver,
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      pedidosAtuais: [],
      historicoPedidos: [],
    };
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, entregadores: [...s.entregadores, newDriver] } : s
    ));
  };

  const updateDriverStatus = (slug: string, driverId: string, status: DeliveryDriver["status"]) => {
    setStores(prev => prev.map(s => 
      s.slug === slug ? { ...s, entregadores: s.entregadores.map(d => d.id === driverId ? { ...d, status } : d) } : s
    ));
  };

  const assignOrderToDriver = (slug: string, orderId: string, driverId: string, options?: StoreActionOptions) => {
    let success = false;
    setStores(prev => prev.map(s => {
      if (s.slug !== slug) return s;
      
      const order = s.orders.find(o => o.id === orderId);
      const driver = s.entregadores.find(d => d.id === driverId);

      try {
        if (!order) throw new Error("Pedido não encontrado.");
        if (order.entregadorId) throw new Error("Este pedido já possui um entregador.");
        
        const validStatuses: Order["status"][] = ["aceito", "preparo", "pronto"];
        if (!validStatuses.includes(order.status)) {
          throw new Error(`Pedido não pode ser aceito no status: ${order.status}`);
        }

        if (!driver) throw new Error("Entregador não encontrado.");
        if (driver.status === "offline") throw new Error("Entregador está offline.");
        if (driver.pedidosAtuais.length >= driver.limitePedidos) {
          throw new Error("Limite de pedidos simultâneos atingido.");
        }

        // If order is 'pronto', it moves to 'entrega' (in transit).
        // Otherwise, it stays in its current status but is assigned to the driver.
        const newStatus = order.status === "pronto" ? "entrega" : order.status;

        success = true;
        return {
          ...s,
          orders: s.orders.map(o => o.id === orderId ? { ...o, status: newStatus, entregadorId: driverId } : o),
          entregadores: s.entregadores.map(d => d.id === driverId ? { ...d, pedidosAtuais: [...d.pedidosAtuais, orderId] } : d)
        };
      } catch (error: any) {
        if (!options?.silent) {
          console.error(error.message);
          toast.error(error.message);
        }
        return s;
      }
    }));
    return success;
  };

  const autoAssignOrder = (slug: string, orderId: string) => {
    setStores(prev => prev.map(s => {
      if (s.slug !== slug) return s;

      const order = s.orders.find(o => o.id === orderId);
      if (!order || order.entregadorId) return s;

      // Intelligent Distribution: Priority = menor(dist_entregador_loja) + menor(carga)
      const availableDrivers = s.entregadores
        .filter(d => d.status === "online" && d.pedidosAtuais.length < d.limitePedidos)
        .map(d => {
          const distToStore = calcularDistancia(d.lat, d.lng, s.settings.lat, s.settings.lng);
          const load = d.pedidosAtuais.length;
          return { ...d, priority: distToStore + load };
        })
        .sort((a, b) => a.priority - b.priority);

      if (availableDrivers.length === 0) {
        const warning = "Aviso: Nenhum entregador disponível para atribuição automática.";
        console.warn(warning);
        toast.warning(warning);
        return s;
      }

      const bestDriver = availableDrivers[0];

      return {
        ...s,
        orders: s.orders.map(o => o.id === orderId ? { ...o, status: "entrega", entregadorId: bestDriver.id } : o),
        entregadores: s.entregadores.map(d => d.id === bestDriver.id ? { ...d, pedidosAtuais: [...d.pedidosAtuais, orderId] } : d)
      };
    }));
  };

  const completeDelivery = (slug: string, orderId: string, driverId: string) => {
    setStores(prev => prev.map(s => {
      if (s.slug !== slug) return s;
      
      const order = s.orders.find(o => o.id === orderId);

      if (!order) {
        console.error("Pedido não encontrado.");
        toast.error("Pedido não encontrado.");
        return s;
      }

      if (order.status !== "entrega") {
        const error = "O pedido precisa estar em rota de entrega para ser finalizado.";
        console.error(error);
        toast.error(error);
        return s;
      }

      return {
        ...s,
        orders: s.orders.map(o => o.id === orderId ? { ...o, status: "concluido" } : o),
        entregadores: s.entregadores.map(d => d.id === driverId ? { 
          ...d, 
          pedidosAtuais: d.pedidosAtuais.filter(id => id !== orderId),
          historicoPedidos: [...d.historicoPedidos, orderId]
        } : d)
      };
    }));
  };

  const updateDriverLocation = (slug: string, driverId: string, lat: number, lng: number) => {
    setStores(prev => prev.map(s => {
      if (s.slug !== slug) return s;
      return {
        ...s,
        entregadores: s.entregadores.map(d => d.id === driverId ? { ...d, lat, lng } : d)
      };
    }));
  };

  return (
    <StoreContext.Provider value={{ 
      stores,
      getStoreBySlug,
      updateStoreSettings,
      addOrderToStore,
      updateOrderStatus,
      addProductToStore,
      updateProductInStore,
      deleteProductFromStore,
      toggleStoreStatus,
      addPromotionToStore,
      updatePromotionInStore,
      deletePromotionFromStore,
      addDriverToStore,
      updateDriverStatus,
      assignOrderToDriver,
      autoAssignOrder,
      completeDelivery,
      updateDriverLocation
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
