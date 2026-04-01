import React, { useState } from "react";
import { Users, UserPlus, MoreVertical, Mail, Phone, MapPin, Shield, Trash2 } from "lucide-react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Modal } from "../../../shared/components/ui/Modal";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "cliente" | "vendedor" | "entregador" | "admin";
  status: "active" | "inactive" | "blocked";
  lastLogin: string;
  avatar: string;
}

const mockUsers: UserData[] = [
  { id: "1", name: "Henri Rodrigues", email: "henri@example.com", role: "admin", status: "active", lastLogin: "Há 2 min", avatar: "https://picsum.photos/seed/henri/100/100" },
  { id: "2", name: "Carlos Silva", email: "carlos@example.com", role: "vendedor", status: "active", lastLogin: "Há 1h", avatar: "https://picsum.photos/seed/carlos/100/100" },
  { id: "3", name: "Ana Souza", email: "ana@example.com", role: "cliente", status: "active", lastLogin: "Há 5h", avatar: "https://picsum.photos/seed/ana/100/100" },
  { id: "4", name: "João Silva", email: "joao@example.com", role: "entregador", status: "inactive", lastLogin: "Há 2 dias", avatar: "https://picsum.photos/seed/joao/100/100" },
  { id: "5", name: "Maria Oliveira", email: "maria@example.com", role: "cliente", status: "blocked", lastLogin: "Há 1 semana", avatar: "https://picsum.photos/seed/maria/100/100" },
];

const UsersManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  const columns = [
    {
      key: "name",
      label: "Usuário",
      sortable: true,
      render: (value: string, item: UserData) => (
        <div className="flex items-center gap-3">
          <Avatar src={item.avatar} fallback={value} size="sm" />
          <div className="flex flex-col">
            <span className="font-black text-white uppercase tracking-tight">{value}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Perfil",
      sortable: true,
      render: (value: string) => {
        const variants: Record<string, any> = {
          admin: { variant: "danger", label: "Admin" },
          vendedor: { variant: "orange", label: "Vendedor" },
          entregador: { variant: "emerald", label: "Entregador" },
          cliente: { variant: "blue", label: "Cliente" },
        };
        return <Badge variant={variants[value].variant} size="xs">{variants[value].label}</Badge>;
      },
    },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (value: string) => {
        const variants: Record<string, any> = {
          active: { variant: "success", label: "Ativo" },
          inactive: { variant: "secondary", label: "Inativo" },
          blocked: { variant: "danger", label: "Bloqueado" },
        };
        return <Badge variant={variants[value].variant} size="xs">{variants[value].label}</Badge>;
      },
    },
    {
      key: "lastLogin",
      label: "Último Acesso",
      sortable: true,
    },
  ];

  const handleAction = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Gerenciar Usuários" 
        subtitle="Controle de acesso e permissões"
        rightAction={
          <Button variant="primary" size="sm">
            <UserPlus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        }
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <DataTable 
            columns={columns} 
            data={mockUsers} 
            searchPlaceholder="Buscar por nome, email ou perfil..."
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
        title="Ações do Usuário"
      >
        {selectedUser && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
              <Avatar src={selectedUser.avatar} fallback={selectedUser.name} size="lg" />
              <div className="flex flex-col">
                <h4 className="text-sm font-black uppercase tracking-tight text-white">{selectedUser.name}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{selectedUser.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              <Button variant="outline" className="justify-start">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
              <Button variant="outline" className="justify-start">
                <Shield className="w-4 h-4 mr-2" />
                Permissões
              </Button>
              <Button variant="outline" className="justify-start text-red-500 hover:text-red-400">
                <Trash2 className="w-4 h-4 mr-2" />
                Bloquear
              </Button>
            </div>

            <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center gap-2 text-zinc-500">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">São Paulo, SP</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                <Users className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Membro desde Jan 2024</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UsersManagement;
