import React, { useState, useEffect, useRef } from "react";
import { useStore, calcularDistancia, Order, DeliveryDriver } from "../context/StoreContext";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, XCircle, Play, RefreshCw, Beaker, 
  ShieldCheck, Zap, AlertTriangle, Bug, Terminal,
  ShieldAlert, Activity, Database
} from "lucide-react";
import { toast } from "sonner";

interface TestResult {
  id: string;
  name: string;
  category: "positive" | "negative" | "stress";
  status: "pending" | "running" | "passed" | "failed";
  message?: string;
  expected?: string;
  actual?: string;
}

export default function LogicTests() {
  const { 
    stores, 
    addOrderToStore, 
    updateOrderStatus, 
    autoAssignOrder, 
    completeDelivery, 
    assignOrderToDriver,
    updateDriverStatus
  } = useStore();
  
  // Senior Dev Tip: Use a ref to always have the latest state in async test loops
  const storesRef = useRef(stores);
  useEffect(() => { storesRef.current = stores; }, [stores]);

  const [results, setResults] = useState<TestResult[]>([
    // Positive Tests
    { id: "dist", category: "positive", name: "Cálculo de Distância (Haversine)", status: "pending" },
    { id: "order_ok", category: "positive", name: "Criação de Pedido Válido", status: "pending" },
    { id: "flow_ok", category: "positive", name: "Fluxo de Status Linear", status: "pending" },
    
    // Negative Tests (Aggressive)
    { id: "order_empty", category: "negative", name: "Bloqueio: Carrinho Vazio", status: "pending" },
    { id: "order_zero", category: "negative", name: "Bloqueio: Valor Zero", status: "pending" },
    { id: "order_radius", category: "negative", name: "Bloqueio: Fora do Raio", status: "pending" },
    { id: "status_jump", category: "negative", name: "Bloqueio: Pulo de Status (Novo -> Concluído)", status: "pending" },
    { id: "driver_offline", category: "negative", name: "Bloqueio: Atribuição p/ Entregador Offline", status: "pending" },
    { id: "driver_limit", category: "negative", name: "Bloqueio: Limite de Pedidos do Entregador", status: "pending" },
    
    // Stress Tests
    { id: "stress_bulk", category: "stress", name: "Stress: Criação em Lote (10 Pedidos)", status: "pending" },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setCurrentLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));
  const updateTest = (id: string, update: Partial<TestResult>) => {
    setResults(prev => prev.map(t => t.id === id ? { ...t, ...update } : t));
  };

  const getLatestStore = (slug: string) => storesRef.current.find(s => s.slug === slug);

  const runTests = async () => {
    setIsRunning(true);
    setCurrentLogs([]);
    addLog("🚀 Iniciando Bateria de Testes Agressivos...");
    
    const slug = "pizza-top";
    const driverId = "d-joao";

    // --- POSITIVE TESTS ---
    
    // 1. Distance
    updateTest("dist", { status: "running" });
    const d = calcularDistancia(-7.2300, -35.8810, -7.2570, -35.8810);
    if (Math.abs(d - 3) < 0.1) {
      updateTest("dist", { status: "passed", message: `OK: ${d.toFixed(3)}km` });
      addLog("✅ Teste de Distância: PASSOU");
    } else {
      updateTest("dist", { status: "failed", actual: `${d.toFixed(3)}km`, expected: "~3km" });
      addLog("❌ Teste de Distância: FALHOU");
    }

    // 2. Valid Order
    updateTest("order_ok", { status: "running" });
    const initialCount = getLatestStore(slug)?.orders.length || 0;
    addOrderToStore(slug, {
      items: [{ id: 1, nome: "Pizza", preco: 50, quantidade: 1 }] as any,
      total: 50,
      lat: -7.2400, lng: -35.8810,
      cliente: { nome: "Tester" }
    });
    await new Promise(r => setTimeout(r, 300));
    const storeAfter = getLatestStore(slug);
    const validOrder = storeAfter?.orders[0];
    if (storeAfter?.orders.length === initialCount + 1 && validOrder) {
      updateTest("order_ok", { status: "passed", message: "Pedido válido aceito pelo sistema." });
      addLog("✅ Criação de Pedido: PASSOU");
    } else {
      updateTest("order_ok", { status: "failed", message: "Sistema rejeitou pedido válido." });
      addLog("❌ Criação de Pedido: FALHOU");
    }

    // 3. Linear Flow (Positive)
    updateTest("flow_ok", { status: "running" });
    if (validOrder) {
      updateOrderStatus(slug, validOrder.id, "aceito");
      await new Promise(r => setTimeout(r, 100));
      updateOrderStatus(slug, validOrder.id, "preparo");
      await new Promise(r => setTimeout(r, 100));
      updateOrderStatus(slug, validOrder.id, "pronto");
      await new Promise(r => setTimeout(r, 300));
      
      const orderAfterFlow = getLatestStore(slug)?.orders.find(o => o.id === validOrder.id);
      if (orderAfterFlow?.status === "pronto") {
        updateTest("flow_ok", { status: "passed", message: "Fluxo Novo -> Aceito -> Preparo -> Pronto validado." });
        addLog("✅ Fluxo Linear: PASSOU");
      } else {
        updateTest("flow_ok", { status: "failed", message: `Status incorreto: ${orderAfterFlow?.status}` });
        addLog("❌ Fluxo Linear: FALHOU");
      }
    }

    // --- NEGATIVE TESTS (AGGRESSIVE) ---
    
    // 4. Empty Cart
    updateTest("order_empty", { status: "running" });
    const countBeforeEmpty = getLatestStore(slug)?.orders.length || 0;
    addOrderToStore(slug, {
      items: [], // EMPTY
      total: 50,
      cliente: { nome: "Hacker" }
    }, { silent: true });
    await new Promise(r => setTimeout(r, 300));
    if (getLatestStore(slug)?.orders.length === countBeforeEmpty) {
      updateTest("order_empty", { status: "passed", message: "Bloqueio de carrinho vazio funcionando." });
      addLog("✅ Bloqueio Carrinho Vazio: PASSOU");
    } else {
      updateTest("order_empty", { status: "failed", message: "Sistema permitiu pedido sem itens!" });
      addLog("❌ Bloqueio Carrinho Vazio: FALHOU (VULNERABILIDADE)");
    }

    // 5. Zero Value
    updateTest("order_zero", { status: "running" });
    const countBeforeZero = getLatestStore(slug)?.orders.length || 0;
    addOrderToStore(slug, {
      items: [{ id: 1, nome: "Freebie", preco: 0, quantidade: 1 }] as any,
      total: 0, // ZERO
      cliente: { nome: "Hacker" }
    }, { silent: true });
    await new Promise(r => setTimeout(r, 300));
    if (getLatestStore(slug)?.orders.length === countBeforeZero) {
      updateTest("order_zero", { status: "passed", message: "Bloqueio de valor zero funcionando." });
      addLog("✅ Bloqueio Valor Zero: PASSOU");
    } else {
      updateTest("order_zero", { status: "failed", message: "Sistema permitiu pedido de R$ 0!" });
      addLog("❌ Bloqueio Valor Zero: FALHOU (VULNERABILIDADE)");
    }

    // 6. Radius Violation
    updateTest("order_radius", { status: "running" });
    const countBeforeRadius = getLatestStore(slug)?.orders.length || 0;
    addOrderToStore(slug, {
      items: [{ id: 1, nome: "Longe", preco: 50, quantidade: 1 }] as any,
      total: 50,
      lat: -8.0000, lng: -35.0000, // Very far (~100km)
      cliente: { nome: "Far Away" }
    }, { silent: true });
    await new Promise(r => setTimeout(r, 300));
    if (getLatestStore(slug)?.orders.length === countBeforeRadius) {
      updateTest("order_radius", { status: "passed", message: "Bloqueio fora do raio (100km) funcionando." });
      addLog("✅ Bloqueio Raio: PASSOU");
    } else {
      updateTest("order_radius", { status: "failed", message: "Sistema aceitou entrega a 100km!" });
      addLog("❌ Bloqueio Raio: FALHOU");
    }

    // 7. Status Jump
    updateTest("status_jump", { status: "running" });
    const testOrder = getLatestStore(slug)?.orders[0];
    if (testOrder) {
      updateOrderStatus(slug, testOrder.id, "concluido", { silent: true }); // JUMP from 'novo' to 'concluido'
      await new Promise(r => setTimeout(r, 300));
      const orderAfterJump = getLatestStore(slug)?.orders.find(o => o.id === testOrder.id);
      if (orderAfterJump?.status === "novo") {
        updateTest("status_jump", { status: "passed", message: "Bloqueio de pulo de status validado." });
        addLog("✅ Bloqueio Pulo Status: PASSOU");
      } else {
        updateTest("status_jump", { status: "failed", message: "Sistema permitiu pular etapas do fluxo!" });
        addLog("❌ Bloqueio Pulo Status: FALHOU");
      }
    }

    // 8. Offline Driver
    updateTest("driver_offline", { status: "running" });
    updateDriverStatus(slug, driverId, "offline");
    await new Promise(r => setTimeout(r, 200));
    
    // Create a ready order for assignment
    addOrderToStore(slug, {
      items: [{ id: 1, nome: "Ready", preco: 50, quantidade: 1 }] as any,
      total: 50,
      lat: -7.2300, lng: -35.8810,
      cliente: { nome: "Ready" }
    });
    await new Promise(r => setTimeout(r, 300));
    const readyOrder = getLatestStore(slug)?.orders[0];
    if (readyOrder) {
      updateOrderStatus(slug, readyOrder.id, "aceito");
      await new Promise(r => setTimeout(r, 100));
      updateOrderStatus(slug, readyOrder.id, "preparo");
      await new Promise(r => setTimeout(r, 100));
      updateOrderStatus(slug, readyOrder.id, "pronto");
      await new Promise(r => setTimeout(r, 300));
      
      assignOrderToDriver(slug, readyOrder.id, driverId, { silent: true });
      await new Promise(r => setTimeout(r, 300));
      
      const orderAfterAssign = getLatestStore(slug)?.orders.find(o => o.id === readyOrder.id);
      if (orderAfterAssign?.status === "pronto") {
        updateTest("driver_offline", { status: "passed", message: "Bloqueio de atribuição para offline validado." });
        addLog("✅ Bloqueio Entregador Offline: PASSOU");
      } else {
        updateTest("driver_offline", { status: "failed", message: "Sistema atribuiu pedido a entregador offline!" });
        addLog("❌ Bloqueio Entregador Offline: FALHOU");
      }
    }
    
    // Restore driver
    updateDriverStatus(slug, driverId, "online");
    await new Promise(r => setTimeout(r, 200));

    // 9. Driver Limit
    updateTest("driver_limit", { status: "running" });
    const driver = getLatestStore(slug)?.entregadores.find(d => d.id === driverId);
    if (driver) {
      // Fill driver's current orders to limit
      const currentLoad = driver.pedidosAtuais.length;
      const limit = driver.limitePedidos;
      const needed = limit - currentLoad;
      
      addLog(`Preenchendo carga do entregador (${currentLoad}/${limit})...`);
      
      for (let i = 0; i < needed; i++) {
        addOrderToStore(slug, {
          items: [{ id: 999 + i, nome: "Filler", preco: 10, quantidade: 1 }] as any,
          total: 10,
          cliente: { nome: "Filler" }
        });
        await new Promise(r => setTimeout(r, 100));
        const fillerOrder = getLatestStore(slug)?.orders[0];
        if (fillerOrder) {
          updateOrderStatus(slug, fillerOrder.id, "aceito");
          await new Promise(r => setTimeout(r, 50));
          updateOrderStatus(slug, fillerOrder.id, "preparo");
          await new Promise(r => setTimeout(r, 50));
          updateOrderStatus(slug, fillerOrder.id, "pronto");
          await new Promise(r => setTimeout(r, 50));
          assignOrderToDriver(slug, fillerOrder.id, driverId);
          await new Promise(r => setTimeout(r, 100));
        }
      }
      
      // Now try to assign one more
      addOrderToStore(slug, {
        items: [{ id: 888, nome: "Overlimit", preco: 10, quantidade: 1 }] as any,
        total: 10,
        cliente: { nome: "Overlimit" }
      });
      await new Promise(r => setTimeout(r, 200));
      const overlimitOrder = getLatestStore(slug)?.orders[0];
      if (overlimitOrder) {
        updateOrderStatus(slug, overlimitOrder.id, "aceito");
        await new Promise(r => setTimeout(r, 50));
        updateOrderStatus(slug, overlimitOrder.id, "preparo");
        await new Promise(r => setTimeout(r, 50));
        updateOrderStatus(slug, overlimitOrder.id, "pronto");
        await new Promise(r => setTimeout(r, 100));
        
        assignOrderToDriver(slug, overlimitOrder.id, driverId, { silent: true });
        await new Promise(r => setTimeout(r, 300));
        
        const orderAfterOverlimit = getLatestStore(slug)?.orders.find(o => o.id === overlimitOrder.id);
        if (orderAfterOverlimit?.status === "pronto") {
          updateTest("driver_limit", { status: "passed", message: `Bloqueio de limite (${limit}) validado.` });
          addLog("✅ Bloqueio Limite Entregador: PASSOU");
        } else {
          updateTest("driver_limit", { status: "failed", message: "Sistema ignorou limite de pedidos do entregador!" });
          addLog("❌ Bloqueio Limite Entregador: FALHOU");
        }
      }
    }

    // --- STRESS TESTS ---
    
    // 10. Bulk Creation
    updateTest("stress_bulk", { status: "running" });
    const countBeforeBulk = getLatestStore(slug)?.orders.length || 0;
    addLog("🔥 Iniciando Stress Test: 10 pedidos simultâneos...");
    for (let i = 0; i < 10; i++) {
      addOrderToStore(slug, {
        items: [{ id: i, nome: `Stress ${i}`, preco: 10, quantidade: 1 }] as any,
        total: 10,
        cliente: { nome: `User ${i}` }
      });
    }
    await new Promise(r => setTimeout(r, 1000));
    const countAfterBulk = getLatestStore(slug)?.orders.length || 0;
    if (countAfterBulk === countBeforeBulk + 10) {
      updateTest("stress_bulk", { status: "passed", message: "10 pedidos criados com sucesso em lote." });
      addLog("✅ Stress Test: PASSOU (10/10)");
    } else {
      updateTest("stress_bulk", { status: "failed", actual: `${countAfterBulk - countBeforeBulk}/10` });
      addLog("❌ Stress Test: FALHOU (Perda de dados detectada)");
    }

    setIsRunning(false);
    addLog("🏁 Bateria de Testes Finalizada.");
    toast.success("Testes concluídos!");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-orange-500/30">
      {/* Header Section */}
      <div className="border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <ShieldAlert className="w-6 h-6 text-orange-500" />
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase">
                Aggressive <span className="text-orange-500">Validator</span>
              </h1>
            </div>
            <p className="text-zinc-500 text-xs font-mono uppercase tracking-[0.2em]">
              Senior Dev Security & Logic Suite v2.0
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={runTests}
              disabled={isRunning}
              className="group relative px-8 py-3 bg-white text-black rounded-full font-bold text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-2 group-hover:text-white transition-colors">
                <Play className={`w-4 h-4 ${isRunning ? 'animate-pulse' : ''}`} />
                {isRunning ? "RUNNING..." : "EXECUTE SUITE"}
              </span>
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-all"
            >
              <RefreshCw className={`w-5 h-5 text-zinc-500 ${isRunning ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Test Categories */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Positive Tests */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-500">
              <Activity className="w-4 h-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Positive Scenarios</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {results.filter(r => r.category === "positive").map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </section>

          {/* Negative Tests */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-orange-500/50">
              <Bug className="w-4 h-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Negative & Security</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {results.filter(r => r.category === "negative").map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </section>

          {/* Stress Tests */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-500/50">
              <Zap className="w-4 h-4" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.3em]">Stress & Concurrency</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {results.filter(r => r.category === "stress").map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Console & Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* Real-time Console */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl sticky top-32">
            <div className="p-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Output</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
            </div>
            <div className="p-6 h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed space-y-3 scrollbar-hide">
              <AnimatePresence mode="popLayout">
                {currentLogs.length === 0 ? (
                  <p className="text-zinc-700 italic">Aguardando execução da suite...</p>
                ) : (
                  currentLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={log.includes("✅") ? "text-green-500/80" : log.includes("❌") ? "text-red-500/80" : "text-zinc-500"}
                    >
                      <span className="text-zinc-700 mr-2">[{i}]</span>
                      {log}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-orange-500/5 border border-orange-500/10 rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-orange-500" />
              <h3 className="font-bold text-orange-500">Database Integrity</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase text-zinc-500 font-bold">Total Stores</span>
                <span className="text-xl font-black">{stores.length}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] uppercase text-zinc-500 font-bold">Active Orders</span>
                <span className="text-xl font-black">{stores.reduce((acc, s) => acc + s.orders.length, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const TestCard: React.FC<{ test: TestResult }> = ({ test }) => {
  return (
    <div className={`p-5 rounded-2xl border transition-all duration-500 ${
      test.status === "passed" ? "bg-green-500/5 border-green-500/20" :
      test.status === "failed" ? "bg-red-500/5 border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.05)]" :
      test.status === "running" ? "bg-orange-500/5 border-orange-500/20 animate-pulse" :
      "bg-zinc-900/40 border-zinc-800/50"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={`mt-1 shrink-0 ${
            test.status === "passed" ? "text-green-500" :
            test.status === "failed" ? "text-red-500" :
            test.status === "running" ? "text-orange-500" :
            "text-zinc-700"
          }`}>
            {test.status === "passed" && <CheckCircle2 className="w-5 h-5" />}
            {test.status === "failed" && <AlertTriangle className="w-5 h-5" />}
            {test.status === "running" && <RefreshCw className="w-5 h-5 animate-spin" />}
            {test.status === "pending" && <ShieldCheck className="w-5 h-5" />}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm">{test.name}</h3>
              {test.category === "negative" && (
                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-zinc-800 text-zinc-500 rounded-full border border-zinc-700">Security</span>
              )}
            </div>
            <p className={`text-xs ${
              test.status === "passed" ? "text-green-500/60" :
              test.status === "failed" ? "text-red-500/60" :
              "text-zinc-500"
            }`}>
              {test.message || (test.status === "pending" ? "Aguardando suite..." : "Processando...")}
            </p>
            
            {test.status === "failed" && (test.expected || test.actual) && (
              <div className="mt-3 p-3 bg-red-500/10 rounded-xl font-mono text-[9px] uppercase tracking-widest space-y-1 border border-red-500/10">
                <p className="text-red-400/70">Expected: {test.expected}</p>
                <p className="text-red-300">Actual: {test.actual}</p>
              </div>
            )}
          </div>
        </div>

        <div className="shrink-0">
          {test.status === "passed" && (
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          )}
          {test.status === "failed" && (
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
          )}
        </div>
      </div>
    </div>
  );
};
