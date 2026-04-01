import React from "react";
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  Calendar,
  Wallet
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
  { name: "Jan", revenue: 45000, profit: 12000 },
  { name: "Fev", revenue: 52000, profit: 15000 },
  { name: "Mar", revenue: 48000, profit: 13500 },
  { name: "Abr", revenue: 61000, profit: 18000 },
  { name: "Mai", revenue: 55000, profit: 16000 },
  { name: "Jun", revenue: 67000, profit: 21000 },
];

const mockTransactions = [
  { id: "TX-1234", store: "Pizza Top", amount: 125.50, fee: 12.55, status: "completed", date: "Hoje, 14:20" },
  { id: "TX-1235", store: "Sushi Master", amount: 89.90, fee: 8.99, status: "pending", date: "Hoje, 13:45" },
  { id: "TX-1236", store: "Burger King", amount: 45.00, fee: 4.50, status: "completed", date: "Hoje, 12:10" },
  { id: "TX-1237", store: "Pastelaria Zé", amount: 32.00, fee: 3.20, status: "failed", date: "Ontem, 22:30" },
];

const PlatformFinancial: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Financeiro da Plataforma" 
        subtitle="Gestão de receitas, taxas e pagamentos"
        rightAction={
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Relatório PDF
          </Button>
        }
      />

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
        {/* Financial Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Volume Transacionado (GMV)" 
            value="R$ 328.4k" 
            icon={<TrendingUp className="w-5 h-5" />} 
            trend={18} 
            trendLabel="vs mês anterior"
            color="orange"
          />
          <StatCard 
            title="Receita Líquida (Fees)" 
            value="R$ 32.8k" 
            icon={<DollarSign className="w-5 h-5" />} 
            trend={15} 
            trendLabel="vs mês anterior"
            color="emerald"
          />
          <StatCard 
            title="Ticket Médio" 
            value="R$ 54.20" 
            icon={<CreditCard className="w-5 h-5" />} 
            trend={5} 
            trendLabel="vs mês anterior"
            color="blue"
          />
        </div>

        {/* Revenue Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Crescimento Financeiro</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Receita bruta vs Lucro líquido (10% fee)</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl">
                <Calendar className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Últimos 6 Meses</span>
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
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                  name="Receita Bruta"
                />
                <Area 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorProfit)" 
                  name="Lucro Líquido"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Transações Recentes</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Fluxo de caixa em tempo real</p>
            </div>
            <Button variant="ghost" size="sm">Ver Todas</Button>
          </div>

          <DataTable 
            columns={[
              { key: "id", label: "ID TX", sortable: true },
              { key: "store", label: "Loja", sortable: true },
              { key: "amount", label: "Valor", sortable: true, render: (v) => `R$ ${v.toFixed(2)}` },
              { key: "fee", label: "Comissão", sortable: true, render: (v) => `R$ ${v.toFixed(2)}` },
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Repasses Pendentes</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Pagamentos a lojistas</p>
              </div>
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>

            <div className="flex flex-col gap-4">
              {[
                { name: "Pizza Top", amount: 1250.00, date: "Próximo Ciclo: 05/04" },
                { name: "Sushi Master", amount: 890.40, date: "Próximo Ciclo: 05/04" },
                { name: "Burger King", amount: 450.20, date: "Próximo Ciclo: 05/04" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight text-white">{item.name}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{item.date}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-emerald-500">R$ {item.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] uppercase tracking-widest">Detalhes</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Configurações de Taxas</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ajuste de comissionamento global</p>
              </div>
              <Button variant="outline" size="sm">Editar</Button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Comissão de Venda</span>
                <span className="text-lg font-black text-orange-500">10%</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Taxa de Saque</span>
                <span className="text-lg font-black text-orange-500">R$ 2,50</span>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Taxa de Entrega (Base)</span>
                <span className="text-lg font-black text-orange-500">R$ 5,00</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformFinancial;
