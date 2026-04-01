import React, { useState } from "react";
import { Store, Plus, MoreVertical, ExternalLink, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Modal } from "../../../shared/components/ui/Modal";
import { toast } from "sonner";

interface StoreData {
  id: string;
  name: string;
  category: string;
  status: "active" | "pending" | "suspended";
  owner: string;
  revenue: number;
  orders: number;
  rating: number;
  logo: string;
}

const mockStores: StoreData[] = [
  { id: "1", name: "Pizza Top", category: "Pizza", status: "active", owner: "Carlos Silva", revenue: 12500, orders: 450, rating: 4.8, logo: "https://picsum.photos/seed/pizza/100/100" },
  { id: "2", name: "Burger King Express", category: "Burguer", status: "pending", owner: "Ana Souza", revenue: 0, orders: 0, rating: 0, logo: "https://picsum.photos/seed/burger/100/100" },
  { id: "3", name: "Sushi Master", category: "Japonesa", status: "active", owner: "Kenji Sato", revenue: 8900, orders: 210, rating: 4.5, logo: "https://picsum.photos/seed/sushi/100/100" },
  { id: "4", name: "Pastelaria do Zé", category: "Lanches", status: "suspended", owner: "José Santos", revenue: 4200, orders: 180, rating: 3.2, logo: "https://picsum.photos/seed/pastel/100/100" },
];

const StoresManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<StoreData | null>(null);

  const columns = [
    {
      key: "name",
      label: "Loja",
      sortable: true,
      render: (value: string, item: StoreData) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.logo} fallback={value} size="sm" />
          <div className="flex flex-col">
            <span className="font-black text-white uppercase tracking-tight">{value}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.category}</span>
          </div>
        </div>
      ),
    },
    {
      key: "owner",
      label: "Proprietário",
      sortable: true,
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => {
        const variants: Record<string, any> = {
          active: { variant: "success", label: "Ativa" },
          pending: { variant: "warning", label: "Pendente" },
          suspended: { variant: "danger", label: "Suspensa" },
        };
        return <Badge variant={variants[value].variant} size="xs">{variants[value].label}</Badge>;
      },
    },
    {
      key: "revenue",
      label: "Receita",
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString()}`,
    },
    {
      key: "rating",
      label: "Nota",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <span className="text-orange-500 font-black">★</span>
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
  ];

  const handleAction = (store: StoreData) => {
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Gerenciar Lojas" 
        subtitle="Controle de parceiros e estabelecimentos"
        rightAction={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nova Loja
          </Button>
        }
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <DataTable 
            columns={columns} 
            data={mockStores} 
            searchPlaceholder="Buscar por nome, categoria ou proprietário..."
            actions={(item) => (
              <Button variant="ghost" size="icon" onClick={() => handleAction(item)}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
          />
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Ações da Loja"
      >
        {selectedStore && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <Avatar src={selectedStore.logo} fallback={selectedStore.name} size="lg" />
              <div className="flex flex-col">
                <h4 className="text-sm font-black uppercase tracking-tight text-white">{selectedStore.name}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{selectedStore.owner}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Loja
              </Button>
              <Button variant="outline" className="justify-start">
                <ShieldCheck className="w-4 h-4 mr-2" />
                Aprovar
              </Button>
              <Button variant="outline" className="justify-start text-amber-500 hover:text-amber-400">
                <ShieldAlert className="w-4 h-4 mr-2" />
                Suspender
              </Button>
              <Button variant="outline" className="justify-start text-red-500 hover:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>

            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
              <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest text-center">
                Ações administrativas impactam diretamente a operação da loja em tempo real.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StoresManagement;
