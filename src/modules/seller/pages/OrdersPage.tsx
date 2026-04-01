import React, { useState } from "react";
import { Search, Filter, Bell, Clock } from "lucide-react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { OrderKanban } from "../components/OrderKanban";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { Order, OrderStatus } from "../../../shared/types";
import { toast } from "sonner";

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [{ id: 1, nome: "Pizza Calabresa G", preco: 45, quantidade: 1, cartId: "1", precoFinal: 45, image: "", description: "", categoria: "Pizza", tipo: "pizza" }],
    total: 45,
    status: "novo",
    data: new Date().toISOString(),
    cliente: { nome: "Ana Souza", endereco: "Rua das Flores, 123", telefone: "11999999999" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "ORD-002",
    items: [{ id: 2, nome: "Pizza Margherita G", preco: 40, quantidade: 1, cartId: "2", precoFinal: 40, image: "", description: "", categoria: "Pizza", tipo: "pizza" }],
    total: 40,
    status: "aceito",
    data: new Date().toISOString(),
    cliente: { nome: "Carlos Lima", endereco: "Av. Paulista, 1000", telefone: "11888888888" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "ORD-003",
    items: [{ id: 3, nome: "Pizza Portuguesa G", preco: 48, quantidade: 1, cartId: "3", precoFinal: 48, image: "", description: "", categoria: "Pizza", tipo: "pizza" }],
    total: 48,
    status: "preparo",
    data: new Date().toISOString(),
    cliente: { nome: "Maria Silva", endereco: "Rua Augusta, 500", telefone: "11777777777" },
    createdAt: new Date().toISOString(),
  },
  {
    id: "ORD-004",
    items: [{ id: 4, nome: "Pizza Quatro Queijos G", preco: 50, quantidade: 1, cartId: "4", precoFinal: 50, image: "", description: "", categoria: "Pizza", tipo: "pizza" }],
    total: 50,
    status: "pronto",
    data: new Date().toISOString(),
    cliente: { nome: "João Santos", endereco: "Rua Oscar Freire, 200", telefone: "11666666666" },
    createdAt: new Date().toISOString(),
  },
];

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    );
    toast.success(`Pedido ${orderId.slice(-4)} atualizado para ${newStatus}`);
  };

  const filteredOrders = orders.filter((order) =>
    order.cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Gestão de Pedidos" 
        subtitle="Controle de fluxo e produção"
        rightAction={
          <div className="flex items-center gap-2">
            <div className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </div>
            <Badge variant="orange" size="md">12 Ativos</Badge>
          </div>
        }
      />

      <main className="max-w-full mx-auto p-6 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:max-w-md">
            <Input 
              placeholder="Buscar por cliente ou ID do pedido..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Clock className="w-4 h-4 mr-2" />
              Histórico
            </Button>
          </div>
        </div>

        <OrderKanban orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
      </main>
    </div>
  );
};

export default OrdersPage;
