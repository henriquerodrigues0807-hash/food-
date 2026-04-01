import React, { useState } from "react";
import { Bike, MoreVertical, MapPin, Star, Clock, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Modal } from "../../../shared/components/ui/Modal";

interface DriverData {
  id: string;
  name: string;
  vehicle: "moto" | "bicicleta" | "carro";
  status: "online" | "offline" | "busy";
  rating: number;
  totalDeliveries: number;
  earnings: number;
  avatar: string;
}

const mockDrivers: DriverData[] = [
  { id: "1", name: "João Silva", vehicle: "moto", status: "online", rating: 4.9, totalDeliveries: 1250, earnings: 4500, avatar: "https://picsum.photos/seed/joao/100/100" },
  { id: "2", name: "Ricardo Santos", vehicle: "bicicleta", status: "busy", rating: 4.7, totalDeliveries: 850, earnings: 2100, avatar: "https://picsum.photos/seed/ricardo/100/100" },
  { id: "3", name: "Marcos Oliveira", vehicle: "carro", status: "offline", rating: 4.5, totalDeliveries: 420, earnings: 1800, avatar: "https://picsum.photos/seed/marcos/100/100" },
  { id: "4", name: "Felipe Costa", vehicle: "moto", status: "online", rating: 4.8, totalDeliveries: 2100, earnings: 8200, avatar: "https://picsum.photos/seed/felipe/100/100" },
];

const DriversManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverData | null>(null);

  const columns = [
    {
      key: "name",
      label: "Entregador",
      sortable: true,
      render: (value: string, item: DriverData) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.avatar} fallback={value} size="sm" />
          <div className="flex flex-col">
            <span className="font-black text-white uppercase tracking-tight">{value}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.vehicle}</span>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => {
        const variants: Record<string, any> = {
          online: { variant: "success", label: "Online" },
          busy: { variant: "warning", label: "Ocupado" },
          offline: { variant: "secondary", label: "Offline" },
        };
        return <Badge variant={variants[value].variant} size="xs">{variants[value].label}</Badge>;
      },
    },
    {
      key: "rating",
      label: "Nota",
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
          <span className="font-bold">{value}</span>
        </div>
      ),
    },
    {
      key: "totalDeliveries",
      label: "Entregas",
      sortable: true,
    },
    {
      key: "earnings",
      label: "Ganhos",
      sortable: true,
      render: (value: number) => `R$ ${value.toLocaleString()}`,
    },
  ];

  const handleAction = (driver: DriverData) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Gerenciar Entregadores" 
        subtitle="Monitoramento de frota e performance"
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <DataTable 
            columns={columns} 
            data={mockDrivers} 
            searchPlaceholder="Buscar por nome, veículo ou status..."
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
        title="Ações do Entregador"
      >
        {selectedDriver && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <Avatar src={selectedDriver.avatar} fallback={selectedDriver.name} size="lg" />
              <div className="flex flex-col">
                <h4 className="text-sm font-black uppercase tracking-tight text-white">{selectedDriver.name}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{selectedDriver.vehicle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Rastrear
              </Button>
              <Button variant="outline" className="justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Histórico
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

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Documentação</span>
                <Badge variant="success" size="xs">Verificada</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Taxa de Aceite</span>
                <span className="text-xs font-black text-white">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tempo Médio</span>
                <span className="text-xs font-black text-white">28 min</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DriversManagement;
