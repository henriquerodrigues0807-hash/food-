import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Store, User, Truck, CheckCircle2, ArrowRight, Info, AlertCircle, RefreshCw, Zap, Beaker } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function SimulationPage() {
  const { getStoreBySlug, addOrderToStore, updateOrderStatus, assignOrderToDriver, completeDelivery, updateDriverStatus } = useStore();
  const { login, user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [simulationOrderId, setSimulationOrderId] = useState<string | null>(null);
  const orderIdRef = React.useRef<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const slug = "pizza-top";
  const driverId = "d-joao";
  const store = getStoreBySlug(slug);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runStep1 = () => {
    if (!store) return;
    
    const orderData = {
      items: [
        { id: 101, nome: "Pizza Calabresa", preco: 50, quantidade: 1 },
        { id: 103, nome: "Refrigerante", preco: 8, quantidade: 1 }
      ] as any,
      total: 64,
      subtotal: 58,
      valorEntrega: 6,
      distancia: 3,
      cliente: {
        nome: "Maria",
        endereco: "Rua A, 123, Centro",
        telefone: "11988887777"
      },
      lat: -7.2570, // 3km from store approx
      lng: -35.8810
    };

    const newId = addOrderToStore(slug, orderData);
    if (newId) {
      // Ensure driver is online for simulation
      updateDriverStatus(slug, driverId, "online");
      
      setSimulationOrderId(newId);
      orderIdRef.current = newId;
      addLog("Etapa 1: Maria fez um pedido de Pizza Calabresa + Refri (Total: R$ 64)");
      addLog(`Pedido criado com ID: ${newId}`);
      setStep(1);
    } else {
      addLog("Erro ao criar pedido. Verifique se a loja está aberta e o endereço está no raio.");
    }
  };

  const runStep2 = async () => {
    const id = orderIdRef.current;
    if (!id) return;
    
    updateOrderStatus(slug, id, "aceito");
    addLog("Etapa 2: Vendedor aceitou o pedido.");
    
    await new Promise(r => setTimeout(r, 1000));
    updateOrderStatus(slug, id, "preparo");
    addLog("Vendedor iniciou o preparo.");

    await new Promise(r => setTimeout(r, 1000));
    updateOrderStatus(slug, id, "pronto");
    addLog("Pedido marcado como PRONTO.");
    setStep(2);
  };

  const runStep3 = () => {
    if (!orderIdRef.current) return;
    addLog("Etapa 3: Notificando entregadores online (João recebeu a notificação).");
    setStep(3);
  };

  const runStep4 = () => {
    const id = orderIdRef.current;
    if (!id) return;
    assignOrderToDriver(slug, id, driverId);
    addLog("Etapa 4: João aceitou a entrega. Status: EM ROTA.");
    setStep(4);
  };

  const runStep5 = () => {
    const id = orderIdRef.current;
    if (!id) return;
    completeDelivery(slug, id, driverId);
    addLog("Etapa 5: João finalizou a entrega. Status: ENTREGUE.");
    setStep(5);
  };

  const autoRun = async () => {
    setIsAutoRunning(true);
    resetSimulation();
    
    addLog("Iniciando simulação automática...");
    
    // Step 1
    runStep1();
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 2
    await runStep2();
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 3
    runStep3();
    await new Promise(r => setTimeout(r, 1000));
    
    // Step 4
    runStep4();
    await new Promise(r => setTimeout(r, 1500));
    
    // Step 5
    runStep5();
    
    setIsAutoRunning(false);
    toast.success("Simulação concluída com sucesso!");
  };

  const resetSimulation = () => {
    setStep(0);
    setSimulationOrderId(null);
    orderIdRef.current = null;
    setLogs([]);
  };

  const handleRoleSwitch = (role: "cliente" | "vendedor" | "entregador", targetUrl: string) => {
    const id = role === "entregador" ? driverId : "USER-1";
    login(role, id);
    toast.info(`Logado como ${role.toUpperCase()}`);
    navigate(targetUrl);
  };

  return (
    <div className="min-h-screen bg-zinc-50 pb-20">
      <header className="bg-white border-b border-zinc-200 p-6 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
              <Play className="w-6 h-6 text-orange-600 fill-orange-600" />
              Simulação Operacional
            </h1>
            <p className="text-zinc-500 text-sm font-medium">PRD 08 — Fluxo Completo (Loja → Cliente → Entregador)</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={autoRun}
              disabled={isAutoRunning}
              className="bg-zinc-900 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              <Zap className={`w-3 h-3 ${isAutoRunning ? 'animate-pulse' : ''}`} />
              Auto-Run
            </button>
            <button 
              onClick={resetSimulation}
              className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
              title="Resetar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Simulation Steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-orange-600" />
                Guia de Execução
              </h2>
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Status Atual: {step === 5 ? "Concluído" : `Passo ${step + 1}`}
              </div>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Step 1 */}
              <div className={`flex gap-4 transition-opacity ${step >= 1 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-sm transition-colors ${step >= 1 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900">Cliente faz Pedido</h3>
                  <p className="text-sm text-zinc-500">Maria pede Pizza Calabresa + Refri. Distância: 3km. Taxa: R$ 6.</p>
                  {step === 0 && !isAutoRunning && (
                    <button 
                      onClick={runStep1}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                      Executar Pedido <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2 */}
              <div className={`flex gap-4 transition-opacity ${step >= 2 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-sm transition-colors ${step >= 2 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900">Vendedor Processa</h3>
                  <p className="text-sm text-zinc-500">Aceitar → Preparar → Pronto. O pedido muda de status em tempo real.</p>
                  {step === 1 && !isAutoRunning && (
                    <button 
                      onClick={runStep2}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                      Processar na Loja <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 3 */}
              <div className={`flex gap-4 transition-opacity ${step >= 3 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-sm transition-colors ${step >= 3 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {step > 3 ? <CheckCircle2 className="w-5 h-5" /> : "3"}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900">Notificação Entregador</h3>
                  <p className="text-sm text-zinc-500">O sistema detecta o tipo "Rotativo" e envia para João (Online).</p>
                  {step === 2 && !isAutoRunning && (
                    <button 
                      onClick={runStep3}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                      Notificar João <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 4 */}
              <div className={`flex gap-4 transition-opacity ${step >= 4 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-sm transition-colors ${step >= 4 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {step > 4 ? <CheckCircle2 className="w-5 h-5" /> : "4"}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900">Entregador Aceita</h3>
                  <p className="text-sm text-zinc-500">João aceita o pedido pronto. Status muda para EM ROTA.</p>
                  {step === 3 && !isAutoRunning && (
                    <button 
                      onClick={runStep4}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                      João Aceita <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Step 5 */}
              <div className={`flex gap-4 transition-opacity ${step >= 5 ? 'opacity-100' : 'opacity-50'}`}>
                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black text-sm transition-colors ${step >= 5 ? 'bg-green-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                  {step === 5 ? <CheckCircle2 className="w-5 h-5" /> : "5"}
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-zinc-900">Finalização</h3>
                  <p className="text-sm text-zinc-500">João entrega para Maria. Status: ENTREGUE. Ganhos creditados.</p>
                  {step === 4 && !isAutoRunning && (
                    <button 
                      onClick={runStep5}
                      className="bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-orange-700 transition-colors"
                    >
                      Finalizar Entrega <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Links with Auto-Login */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleRoleSwitch("cliente", `/${slug}`)}
              className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center gap-2 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
            >
              <User className="w-6 h-6 text-zinc-400 group-hover:text-orange-600" />
              <span className="text-xs font-bold text-zinc-600">Ver como Cliente</span>
            </button>
            <button 
              onClick={() => handleRoleSwitch("vendedor", `/${slug}/vendedor`)}
              className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center gap-2 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
            >
              <Store className="w-6 h-6 text-zinc-400 group-hover:text-orange-600" />
              <span className="text-xs font-bold text-zinc-600">Ver como Lojista</span>
            </button>
            <button 
              onClick={() => handleRoleSwitch("entregador", `/delivery/${slug}`)}
              className="bg-white p-4 rounded-2xl border border-zinc-200 flex flex-col items-center gap-2 hover:border-orange-200 hover:bg-orange-50/30 transition-all group"
            >
              <Truck className="w-6 h-6 text-zinc-400 group-hover:text-orange-600" />
              <span className="text-xs font-bold text-zinc-600">Ver como João</span>
            </button>
          </div>
        </div>

        {/* Logs & Status */}
        <div className="space-y-6">
          <div className="bg-zinc-900 rounded-3xl p-6 text-zinc-400 font-mono text-xs space-y-4 shadow-xl min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
              <span className="text-zinc-500 font-bold uppercase tracking-widest">System Logs</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[400px] scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {logs.length === 0 ? (
                  <p className="text-zinc-600 italic">Aguardando início da simulação...</p>
                ) : (
                  logs.map((log, i) => (
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="leading-relaxed"
                    >
                      <span className="text-orange-500/50 mr-2">❯</span>
                      {log}
                    </motion.p>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-orange-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Dica de Teste
            </h3>
            <p className="text-sm text-orange-800/70 leading-relaxed">
              O botão <strong>Auto-Run</strong> executa todo o fluxo automaticamente em segundos. Use os botões de acesso rápido para trocar de papel instantaneamente e ver o resultado em cada painel!
            </p>
            <Link 
              to="/testes"
              className="mt-4 flex items-center justify-center gap-2 p-4 bg-white border border-orange-200 rounded-2xl text-orange-600 font-bold text-sm hover:bg-orange-50 transition-all"
            >
              <Beaker className="w-4 h-4" />
              Ver Validador de Lógica (Unit Tests)
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
