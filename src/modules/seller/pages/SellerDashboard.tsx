import React from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight, 
  AlertCircle,
  CheckCircle2,
  Bell
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { StatCard } from "../../../shared/components/ui/StatCard";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";

const data = [
  { name: "18:00", revenue: 400, orders: 12 },
  { name: "19:00", revenue: 800, orders: 24 },
  { name: "20:00", revenue: 1200, orders: 36 },
  { name: "21:00", revenue: 900, orders: 28 },
  { name: "22:00", revenue: 600, orders: 18 },
  { name: "23:00", revenue: 300, orders: 8 },
];

const SellerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Painel do Vendedor" 
        subtitle="Pizza Top • Gestão em Tempo Real"
        showBack={false}
        rightAction={
          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-zinc-950" />
            </div>
            <Badge variant="success" size="md">Loja Aberta</Badge>
          </div>
        }
      />

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        {/* Real-time Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Vendas Hoje" 
            value="R$ 4.250" 
            icon={<DollarSign className="w-5 h-5" />} 
            trend={15} 
            trendLabel="vs ontem"
            color="orange"
          />
          <StatCard 
            title="Pedidos" 
            value="124" 
            icon={<ShoppingBag className="w-5 h-5" />} 
            trend={8} 
            trendLabel="vs ontem"
            color="blue"
          />
          <StatCard 
            title="Ticket Médio" 
            value="R$ 34,20" 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={-2} 
            trendLabel="vs ontem"
            color="emerald"
          />
          <StatCard 
            title="Avaliação" 
            value="4.8" 
            icon={<Star className="w-5 h-5" />} 
            trend={0.2} 
            trendLabel="vs ontem"
            color="red"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Vendas por Horário</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pico de demanda em tempo real</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Ao Vivo</span>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontWeight: 'bold' }}
                  />
                  <YAxis 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false} 
                    tick={{ fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Active Orders Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Pedidos Ativos</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status da cozinha</p>
              </div>
              <Button variant="ghost" size="sm">Ver Kanban</Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Novos</span>
                </div>
                <span className="text-sm font-black text-white">12</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Em Preparo</span>
                </div>
                <span className="text-sm font-black text-white">8</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Prontos</span>
                </div>
                <span className="text-sm font-black text-white">4</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Em Rota</span>
                </div>
                <span className="text-sm font-black text-white">6</span>
              </div>
            </div>

            <div className="mt-auto p-4 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">Tempo Médio</span>
                <span className="text-sm font-black text-white">24 min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Produtos Mais Vendidos</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Performance por item</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { name: "Pizza Calabresa G", sales: 450, revenue: 18000, image: "https://picsum.photos/seed/pizza1/100/100" },
                { name: "Pizza Margherita G", sales: 320, revenue: 12800, image: "https://picsum.photos/seed/pizza2/100/100" },
                { name: "Pizza Portuguesa G", sales: 280, revenue: 11200, image: "https://picsum.photos/seed/pizza3/100/100" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar src={item.image} fallback={item.name} size="md" />
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-white">{item.name}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.sales} vendas</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-white">R$ {item.revenue.toLocaleString()}</span>
                    <Badge variant="success" size="xs">Alta</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Últimas Avaliações</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">O que os clientes estão dizendo</p>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { user: "Ana Souza", rating: 5, comment: "Pizza maravilhosa, chegou quentinha!", date: "Há 12 min" },
                { user: "Carlos Lima", rating: 4, comment: "Muito bom, mas demorou um pouco.", date: "Há 45 min" },
                { user: "Maria Silva", rating: 5, comment: "Melhor pizza da região, recomendo!", date: "Há 2h" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-3 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar fallback={item.user} size="sm" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.user}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star 
                          key={j} 
                          className={cn(
                            "w-3 h-3", 
                            j < item.rating ? "text-orange-500 fill-orange-500" : "text-zinc-800"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 italic">"{item.comment}"</p>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest text-right">{item.date}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Ver Todas as Avaliações</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;
