import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  ShoppingCart, 
  Truck, 
  Store as StoreIcon, 
  User as UserIcon,
  Clock,
  CreditCard,
  Tag,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';

// Engines
import { calculatePricing, PricingInput, PricingResult, StoreDeliveryConfig } from '../../shared/engines/pricingEngine';
import { validateCoupon, CouponCode, CouponValidationResult } from '../../shared/engines/couponEngine';
import { getStoreAvailability, StoreSchedule, StoreAvailabilityResult } from '../../shared/engines/storeAvailabilityEngine';
import { validateOrder, OrderValidationResult } from '../../shared/engines/orderValidationEngine';
import { detectAnomaly, AnomalyDetectionResult } from '../../shared/engines/anomalyEngine';

// Types
import { CartItem, Store, User as Customer, Order } from '../../shared/types/index';
import { DeliveryMode } from '../../shared/orderStateMachine';

/**
 * Página de Simulação de Cenários de Negócio
 * Permite testar as lógicas de Sprint 5 de forma visual e interativa.
 */
const SimulationPage: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Dados Mock para Simulação
  const mockStore: Store = {
    id: 'store_1',
    slug: 'pizza-place',
    settings: {
      nome: 'Pizza Place',
      descricao: 'As melhores pizzas da cidade',
      categoria: 'Pizza',
      corPrincipal: '#FF0000',
      logo: '',
      banner: '',
      horario: '11:00 às 23:00',
      aberto: true,
      status: 'aberto',
      taxaEntrega: 5,
      raioEntrega: 10,
      tipoTaxa: 'fixa',
      valorTaxa: 5,
      tipoEntregador: 'rotativo',
      tempoPreparo: '30 min',
      aceitaRetirada: true,
      whatsapp: '',
      pedidoMinimo: 30,
      lat: -23.5505,
      lng: -46.6333
    },
    products: [
      { id: 1, nome: 'Pizza Margherita', preco: 45, image: '', description: '', categoria: 'Pizza', tipo: 'normal', ativa: true },
      { id: 2, nome: 'Pizza Pepperoni', preco: 55, image: '', description: '', categoria: 'Pizza', tipo: 'normal', ativa: true },
      { id: 3, nome: 'Coca-Cola', preco: 8, image: '', description: '', categoria: 'Bebidas', tipo: 'normal', ativa: true }
    ],
    orders: [],
    promocoes: [],
    entregadores: []
  };

  const mockCustomer: Customer = {
    id: 'cust_1',
    tipo: 'cliente',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '11999999999'
  };

  const mockCoupons: CouponCode[] = [
    {
      id: 'coupon_1',
      code: 'PRIMEIRACOMPRA',
      type: 'first_order',
      scope: 'platform',
      value: 15,
      minimumOrder: 50,
      maxUses: 100,
      usedCount: 10,
      perUserLimit: 1,
      validFrom: '2024-01-01',
      validUntil: '2026-12-31',
      active: true
    },
    {
      id: 'coupon_2',
      code: 'FRETEGRATIS',
      type: 'free_delivery',
      scope: 'store',
      scopeId: 'store_1',
      value: 0,
      minimumOrder: 40,
      maxUses: 500,
      usedCount: 50,
      perUserLimit: 2,
      validFrom: '2024-01-01',
      validUntil: '2026-12-31',
      active: true
    }
  ];

  const mockSchedule: StoreSchedule = {
    timezone: 'America/Sao_Paulo',
    acceptingOrders: true,
    slots: [
      { dayOfWeek: 1, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 2, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 3, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 4, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 5, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 6, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' },
      { dayOfWeek: 0, openTime: '11:00', closeTime: '23:00', acceptOrdersUntil: '22:30' }
    ],
    holidays: []
  };

  // Cenários de Simulação
  const scenarios = [
    {
      id: 'happy_path',
      name: 'Fluxo Feliz (Pedido Válido)',
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      description: 'Cliente faz pedido de R$ 60,00 com cupom de primeira compra e entrega dentro do raio.',
      run: async () => {
        const cartItems: CartItem[] = [
          { ...mockStore.products[1], cartId: '1', quantidade: 1, precoFinal: 55 } as CartItem,
          { ...mockStore.products[2], cartId: '2', quantidade: 1, precoFinal: 8 } as CartItem
        ];
        const subtotal = 63;
        const mode: DeliveryMode = 'delivery';
        const distance = 3.5;

        // 1. Disponibilidade
        const availability = getStoreAvailability(mockSchedule);

        // 2. Cupom
        const couponResult = validateCoupon('PRIMEIRACOMPRA', mockCustomer.id, subtotal, mockStore.id, [], mockCoupons);

        // 3. Precificação
        const pricingInput: PricingInput = {
          subtotal,
          deliveryMode: mode,
          distanceKm: distance,
          storeDeliveryConfig: {
            feeType: 'fixed',
            fixedFee: 5,
            maxRadiusKm: 10,
            minimumOrder: 30,
            freeAbove: 100
          },
          coupon: couponResult.coupon,
          paymentMethod: 'credit_card'
        };
        const pricing = calculatePricing(pricingInput);

        // 4. Validação Final
        const validation = validateOrder(cartItems, mockStore, mockCustomer, mode, pricing);

        return { availability, couponResult, pricing, validation };
      }
    },
    {
      id: 'outside_radius',
      name: 'Fora do Raio de Entrega',
      icon: <Truck className="w-5 h-5 text-orange-500" />,
      description: 'Cliente tenta pedir de uma distância de 15km, excedendo o limite de 10km da loja.',
      run: async () => {
        const subtotal = 50;
        const distance = 15;
        const pricing = calculatePricing({
          subtotal,
          deliveryMode: 'delivery',
          distanceKm: distance,
          storeDeliveryConfig: { feeType: 'fixed', fixedFee: 5, maxRadiusKm: 10, minimumOrder: 30 },
          paymentMethod: 'credit_card'
        });
        return { pricing };
      }
    },
    {
      id: 'below_minimum',
      name: 'Abaixo do Pedido Mínimo',
      icon: <ShoppingCart className="w-5 h-5 text-red-500" />,
      description: 'Cliente tenta pedir apenas uma bebida de R$ 8,00, mas o mínimo é R$ 30,00.',
      run: async () => {
        const subtotal = 8;
        const pricing = calculatePricing({
          subtotal,
          deliveryMode: 'pickup',
          storeDeliveryConfig: { feeType: 'fixed', fixedFee: 5, maxRadiusKm: 10, minimumOrder: 30 },
          paymentMethod: 'cash'
        });
        return { pricing };
      }
    },
    {
      id: 'store_closed',
      name: 'Loja Fechada (Horário)',
      icon: <Clock className="w-5 h-5 text-gray-500" />,
      description: 'Simulação de acesso às 03:00 da manhã quando a loja abre às 11:00.',
      run: async () => {
        const nightTime = new Date();
        nightTime.setHours(3, 0, 0);
        const availability = getStoreAvailability(mockSchedule, nightTime);
        return { availability };
      }
    },
    {
      id: 'anomaly_detection',
      name: 'Detecção de Anomalia (Fraude)',
      icon: <ShieldAlert className="w-5 h-5 text-red-600" />,
      description: 'Cliente com histórico de 5 cancelamentos na última hora tenta fazer novo pedido.',
      run: async () => {
        const order: Order = { id: 'o_new', total: 50, status: 'novo', createdAt: new Date().toISOString(), items: [], data: '', cliente: { nome: 'Suspeito' } };
        const history: Order[] = Array(5).fill(null).map((_, i) => ({
          id: `o_${i}`,
          status: 'cancelado',
          createdAt: new Date(Date.now() - 10 * 60000).toISOString(),
          total: 50,
          items: [],
          data: '',
          cliente: { nome: 'Suspeito' }
        } as Order));

        const anomaly = detectAnomaly(order, history, 'customer');
        return { anomaly };
      }
    }
  ];

  const handleRunScenario = async (scenario: any) => {
    setLoading(true);
    setActiveScenario(scenario.id);
    try {
      // Simulação de processamento
      await new Promise(resolve => setTimeout(resolve, 800));
      const res = await scenario.run();
      setResults(res);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            <Play className="w-3 h-3" />
            Sprint 5 — Business Logic Simulation
          </div>
          <h1 className="text-5xl font-serif italic text-gray-900 mb-4">Engine Lab</h1>
          <p className="text-gray-600 max-w-2xl">
            Ambiente de testes para os motores de precificação, cupons, disponibilidade e segurança. 
            Selecione um cenário abaixo para ver as regras de negócio em ação.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lista de Cenários */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Cenários Disponíveis</h2>
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleRunScenario(scenario)}
                disabled={loading}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
                  activeScenario === scenario.id 
                    ? 'bg-white border-gray-900 shadow-xl scale-[1.02]' 
                    : 'bg-white/50 border-gray-200 hover:border-gray-400 hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-xl ${activeScenario === scenario.id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {scenario.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      {scenario.name}
                      {activeScenario === scenario.id && <ChevronRight className="w-4 h-4" />}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{scenario.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Resultados da Simulação */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeScenario ? (
                <motion.div
                  key={activeScenario}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden min-h-[500px]"
                >
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                      <RefreshCw className="w-12 h-12 text-gray-300 animate-spin mb-4" />
                      <p className="text-gray-400 font-medium italic">Processando motores de negócio...</p>
                    </div>
                  ) : (
                    <div className="p-8">
                      <div className="flex items-center justify-between mb-8 border-bottom pb-6 border-gray-100">
                        <div>
                          <h2 className="text-2xl font-serif italic text-gray-900">Resultado da Simulação</h2>
                          <p className="text-sm text-gray-500">Cenário: {scenarios.find(s => s.id === activeScenario)?.name}</p>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                          <CheckCircle2 className="w-4 h-4" />
                          Simulação Concluída
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Exibição Condicional de Resultados */}
                        {results.pricing && (
                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                              <CreditCard className="w-4 h-4" /> Motor de Precificação
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] uppercase text-gray-400 block mb-1">Subtotal</span>
                                <span className="text-xl font-bold">R$ {results.pricing.subtotal.toFixed(2)}</span>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-2xl">
                                <span className="text-[10px] uppercase text-gray-400 block mb-1">Entrega</span>
                                <span className="text-xl font-bold">R$ {results.pricing.deliveryFee.toFixed(2)}</span>
                              </div>
                              <div className="p-4 bg-gray-50 rounded-2xl text-red-600">
                                <span className="text-[10px] uppercase text-gray-400 block mb-1">Desconto</span>
                                <span className="text-xl font-bold">- R$ {results.pricing.discount.toFixed(2)}</span>
                              </div>
                              <div className="p-4 bg-gray-900 text-white rounded-2xl">
                                <span className="text-[10px] uppercase text-gray-400 block mb-1">Total Final</span>
                                <span className="text-xl font-bold">R$ {results.pricing.total.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            {results.pricing.errors.length > 0 && (
                              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
                                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                                <div>
                                  <p className="text-sm font-bold text-red-900">Erros de Precificação</p>
                                  <ul className="text-xs text-red-700 mt-1 list-disc list-inside">
                                    {results.pricing.errors.map((err: string) => <li key={err}>{err}</li>)}
                                  </ul>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {results.availability && (
                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                              <StoreIcon className="w-4 h-4" /> Disponibilidade da Loja
                            </h3>
                            <div className={`p-6 rounded-3xl flex items-center justify-between ${results.availability.canOrder ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}>
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${results.availability.canOrder ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                  {results.availability.canOrder ? <CheckCircle2 /> : <XCircle />}
                                </div>
                                <div>
                                  <p className={`text-lg font-bold ${results.availability.canOrder ? 'text-green-900' : 'text-red-900'}`}>
                                    {results.availability.status.toUpperCase()}
                                  </p>
                                  <p className="text-sm opacity-70">{results.availability.message}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {results.anomaly && (
                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                              <ShieldAlert className="w-4 h-4" /> Detecção de Anomalias
                            </h3>
                            <div className={`p-6 rounded-3xl border-2 border-dashed ${results.anomaly.detected ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50/30'}`}>
                              {results.anomaly.detected ? (
                                <div className="flex items-start gap-4">
                                  <div className="p-3 bg-red-600 text-white rounded-2xl">
                                    <ShieldAlert />
                                  </div>
                                  <div>
                                    <p className="text-xl font-bold text-red-900">Anomalia Detectada: {results.anomaly.type}</p>
                                    <p className="text-gray-600 mt-1">{results.anomaly.reason}</p>
                                    <div className="flex gap-2 mt-4">
                                      <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase">Severidade: {results.anomaly.severity}</span>
                                      <span className="px-3 py-1 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase">Ação: {results.anomaly.action}</span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-center text-gray-400 italic py-4">Nenhuma anomalia detectada no comportamento atual.</p>
                              )}
                            </div>
                          </div>
                        )}

                        {results.couponResult && (
                          <div className="space-y-4">
                            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                              <Tag className="w-4 h-4" /> Validação de Cupom
                            </h3>
                            <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-mono font-bold text-gray-400">
                                  %
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-gray-900">{results.couponResult.message}</p>
                                  {results.couponResult.valid && (
                                    <p className="text-xs text-green-600 font-medium">Desconto Calculado: R$ {results.couponResult.discountAmount.toFixed(2)}</p>
                                  )}
                                </div>
                              </div>
                              {results.couponResult.valid ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-white/50 border-2 border-dashed border-gray-200 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Info className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-serif italic text-gray-400 mb-2">Nenhum cenário ativo</h3>
                  <p className="text-gray-400 max-w-sm">Selecione um cenário de simulação na lista à esquerda para analisar o comportamento dos motores de negócio.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulationPage;
