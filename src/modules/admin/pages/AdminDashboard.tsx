import React from "react";
import { 
  Users, 
  Store, 
  Bike, 
  DollarSign, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle2,
  AlertCircle
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
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { StatCard } from "../../../shared/components/ui/StatCard";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";

const data = [
  { name: "Seg", revenue: 4000, orders: 240 },
  { name: "Ter", revenue: 3000, orders: 198 },
  { name: "Qua", revenue: 2000, orders: 150 },
  { name: "Qui", revenue: 2780, orders: 210 },
  { name: "Sex", revenue: 1890, orders: 120 },
  { name: "Sáb", revenue: 2390, orders: 180 },
  { name: "Dom", revenue: 3490, orders: 250 },
];

const categoryData = [
  { name: "Pizza", value: 400, color: "#f97316" },
  { name: "Burguer", value: 300, color: "#3b82f6" },
  { name: "Japonesa", value: 300, color: "#10b981" },
  { name: "Bebidas", value: 200, color: "#ef4444" },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Painel Administrativo" 
        subtitle="Visão Geral da Plataforma"
        showBack={false}
        rightAction={
          <div className="flex items-center gap-2">
            <Badge variant="success" size="md">Sistema Online</Badge>
          </div>
        }
      />

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Lojas Ativas" 
            value="124" 
            icon={<Store className="w-5 h-5" />} 
            trend={12} 
            trendLabel="vs mês anterior"
            color="orange"
          />
          <StatCard 
            title="Usuários" 
            value="12.4k" 
            icon={<Users className="w-5 h-5" />} 
            trend={8} 
            trendLabel="vs mês anterior"
            color="blue"
          />
          <StatCard 
            title="Entregadores" 
            value="456" 
            icon={<Bike className="w-5 h-5" />} 
            trend={-2} 
            trendLabel="vs mês anterior"
            color="emerald"
          />
          <StatCard 
            title="Receita Total" 
            value="R$ 84.2k" 
            icon={<DollarSign className="w-5 h-5" />} 
            trend={15} 
            trendLabel="vs mês anterior"
            color="red"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Receita vs Pedidos</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Últimos 7 dias de operação</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Semanal</Button>
                <Button variant="outline" size="sm">Mensal</Button>
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

          {/* Category Distribution */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Categorias</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Distribuição de vendas</p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    stroke="#52525b" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fontWeight: 'bold' }}
                  />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{cat.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-white">{cat.value} vendas</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Aprovações Pendentes</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lojas e Entregadores aguardando</p>
              </div>
              <Badge variant="warning" size="sm">4 Pendentes</Badge>
            </div>

            <div className="flex flex-col gap-4">
              {[
                { name: "Burger King Express", type: "Loja", date: "Há 2h", icon: <Store className="w-4 h-4" /> },
                { name: "João Silva", type: "Entregador", date: "Há 5h", icon: <Bike className="w-4 h-4" /> },
                { name: "Sushi Master", type: "Loja", date: "Há 1 dia", icon: <Store className="w-4 h-4" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl group hover:border-orange-500/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 group-hover:text-orange-500 transition-colors">
                      {item.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black uppercase tracking-tight text-white">{item.name}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.type} • {item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400">Recusar</Button>
                    <Button variant="primary" size="sm">Aprovar</Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full">Ver Todas as Solicitações</Button>
          </div>

          {/* System Health */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Status do Sistema</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Monitoramento em tempo real</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <ShoppingBag className="w-4 h-4 text-orange-500" />
                  <Badge variant="success" size="xs">Normal</Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Pedidos/min</span>
                  <span className="text-lg font-black text-white">42.5</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <Badge variant="success" size="xs">98%</Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">SLA Entrega</span>
                  <span className="text-lg font-black text-white">32 min</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <Badge variant="danger" size="xs">2 Alertas</Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Erros API</span>
                  <span className="text-lg font-black text-white">0.02%</span>
                </div>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <Badge variant="success" size="xs">Online</Badge>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Servidores</span>
                  <span className="text-lg font-black text-white">12/12</span>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full">Relatório Detalhado de Infra</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
