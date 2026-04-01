import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar,
  Wallet,
  ShoppingBag
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
import { DataTable } from "../../../shared/components/ui/DataTable";

const data = [
  { name: "Seg", revenue: 1200, orders: 40 },
  { name: "Ter", revenue: 1500, orders: 50 },
  { name: "Qua", revenue: 1800, orders: 60 },
  { name: "Qui", revenue: 2100, orders: 70 },
  { name: "Sex", revenue: 2500, orders: 85 },
  { name: "Sáb", revenue: 3200, orders: 110 },
  { name: "Dom", revenue: 2800, orders: 95 },
];

const mockTransactions = [
  { id: "TX-001", amount: 125.50, fee: 12.55, net: 112.95, status: "completed", date: "Hoje, 14:20" },
  { id: "TX-002", amount: 89.90, fee: 8.99, net: 80.91, status: "pending", date: "Hoje, 13:45" },
  { id: "TX-003", amount: 45.00, fee: 4.50, net: 40.50, status: "completed", date: "Hoje, 12:10" },
  { id: "TX-004", amount: 32.00, fee: 3.20, net: 28.80, status: "failed", date: "Ontem, 22:30" },
];

const FinancialPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Financeiro da Loja" 
        subtitle="Gestão de faturamento e repasses"
        rightAction={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        }
      />

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Faturamento Bruto" 
            value="R$ 15.1k" 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={12} 
            trendLabel="vs semana anterior"
            color="orange"
          />
          <StatCard 
            title="Receita Líquida" 
            value="R$ 13.6k" 
            icon={<DollarSign className="w-5 h-5" />} 
            trend={10} 
            trendLabel="vs semana anterior"
            color="emerald"
          />
          <StatCard 
            title="Pedidos Concluídos" 
            value="510" 
            icon={<ShoppingBag className="w-5 h-5" />} 
            trend={5} 
            trendLabel="vs semana anterior"
            color="blue"
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Vendas Semanais</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Faturamento diário (7 dias)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Esta Semana</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
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
                  fill="url(#colorRev)" 
                  name="Faturamento"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Últimas Transações</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Detalhamento de vendas e taxas</p>
            </div>
            <Button variant="ghost" size="sm">Ver Todas</Button>
          </div>

          <DataTable 
            columns={[
              { key: "id", label: "ID Pedido", sortable: true },
              { key: "amount", label: "Bruto", sortable: true, render: (v) => `R$ ${v.toFixed(2)}` },
              { key: "fee", label: "Taxa (10%)", sortable: true, render: (v) => `R$ ${v.toFixed(2)}` },
              { key: "net", label: "Líquido", sortable: true, render: (v) => `R$ ${v.toFixed(2)}` },
              { 
                key: "status", 
                label: "Status", 
                sortable: true,
                render: (v) => {
                  const variants: any = {
                    completed: { variant: "success", label: "Concluído" },
                    pending: { variant: "warning", label: "Pendente" },
                    failed: { variant: "danger", label: "Falhou" },
                  };
                  return <Badge variant={variants[v].variant} size="xs">{variants[v].label}</Badge>;
                }
              },
              { key: "date", label: "Data", sortable: true },
            ]} 
            data={mockTransactions} 
          />
        </div>

        {/* Payouts Section */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Próximos Repasses</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Calendário de pagamentos</p>
            </div>
            <Wallet className="w-5 h-5 text-orange-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Ciclo Atual</span>
                <Badge variant="warning" size="xs">Em Processamento</Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white">R$ 4.250,00</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Disponível em 05/04</span>
              </div>
              <Button variant="outline" className="w-full">Ver Detalhes do Ciclo</Button>
            </div>
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Saldo Total</span>
                <Badge variant="success" size="xs">Liberado</Badge>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-emerald-500">R$ 1.250,00</span>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Pronto para saque</span>
              </div>
              <Button variant="primary" className="w-full">Solicitar Saque</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FinancialPage;
