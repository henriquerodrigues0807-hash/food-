import React, { useState } from "react";
import { 
  Store, 
  Clock, 
  MapPin, 
  Phone, 
  CreditCard, 
  Settings, 
  Bell, 
  Shield, 
  Trash2,
  Camera,
  Save
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { Input } from "../../../shared/components/ui/Input";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Tabs } from "../../../shared/components/ui/Tabs";
import { toast } from "sonner";

const StoreSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("perfil");

  const tabs = [
    { id: "perfil", label: "Perfil", icon: <Store className="w-4 h-4" /> },
    { id: "operacao", label: "Operação", icon: <Clock className="w-4 h-4" /> },
    { id: "entrega", label: "Entrega", icon: <MapPin className="w-4 h-4" /> },
    { id: "pagamento", label: "Pagamento", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const handleSave = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Configurações da Loja" 
        subtitle="Personalização e regras de negócio"
        rightAction={
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Salvar
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto p-6 flex flex-col gap-8">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          variant="pills"
          className="bg-zinc-900/50 p-2 rounded-full border border-zinc-800"
        />

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl flex flex-col gap-8">
          {activeTab === "perfil" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <Avatar 
                    src="https://picsum.photos/seed/pizza/200/200" 
                    fallback="Pizza Top" 
                    size="xl" 
                    className="w-32 h-32 border-4 border-zinc-800"
                  />
                  <button className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Camera className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Logo da Loja</h3>
                  <p className="text-xs text-zinc-500 font-medium">Recomendado: 512x512px. Formato PNG ou JPG.</p>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">Alterar Foto</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Remover</Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Nome da Loja" placeholder="Ex: Pizza Top" defaultValue="Pizza Top" />
                <Input label="Categoria" placeholder="Ex: Pizzaria" defaultValue="Pizzaria" />
                <div className="md:col-span-2">
                  <Input label="Descrição Curta" placeholder="Ex: A melhor pizza da região" defaultValue="A melhor pizza artesanal da região com ingredientes selecionados." />
                </div>
                <Input label="WhatsApp" placeholder="(11) 99999-9999" defaultValue="(11) 98765-4321" />
                <Input label="Email de Contato" placeholder="contato@loja.com" defaultValue="contato@pizzatop.com" />
              </div>
            </div>
          )}

          {activeTab === "operacao" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Horário de Funcionamento</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"].map((dia) => (
                    <div key={dia} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{dia}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">18:00 - 23:00</span>
                        <Badge variant="success" size="xs">Aberto</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Tempo Médio de Preparo (min)" placeholder="Ex: 30" defaultValue="35" type="number" />
                <Input label="Pedido Mínimo (R$)" placeholder="Ex: 15.00" defaultValue="20.00" type="number" />
              </div>
            </div>
          )}

          {activeTab === "entrega" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Logística de Entrega</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Tipo de Entrega</label>
                    <select className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-orange-500/50">
                      <option>Própria (Fixa)</option>
                      <option>Marketplace (Rotativa)</option>
                      <option>Híbrida</option>
                    </select>
                  </div>
                  <Input label="Raio de Entrega (km)" placeholder="Ex: 5" defaultValue="7" type="number" />
                  <Input label="Taxa de Entrega Base (R$)" placeholder="Ex: 5.00" defaultValue="6.00" type="number" />
                  <Input label="Taxa por KM Adicional (R$)" placeholder="Ex: 1.50" defaultValue="1.00" type="number" />
                </div>
              </div>

              <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-black uppercase tracking-tight text-white">Endereço da Loja</span>
                  </div>
                  <Button variant="ghost" size="sm">Alterar no Mapa</Button>
                </div>
                <p className="text-xs text-zinc-500 font-medium">Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100</p>
              </div>
            </div>
          )}

          {activeTab === "pagamento" && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Métodos de Pagamento Aceitos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Cartão de Crédito (App)", active: true },
                    { name: "Pix (App)", active: true },
                    { name: "Cartão de Débito (Entrega)", active: true },
                    { name: "Dinheiro (Entrega)", active: false },
                    { name: "Vale Refeição (Entrega)", active: true },
                  ].map((method) => (
                    <div key={method.name} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{method.name}</span>
                      <button className={cn(
                        "w-10 h-6 rounded-full p-1 transition-colors",
                        method.active ? "bg-orange-500" : "bg-zinc-800"
                      )}>
                        <div className={cn(
                          "w-4 h-4 bg-white rounded-full transition-transform",
                          method.active ? "translate-x-4" : "translate-x-0"
                        )} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4">
                <Shield className="w-6 h-6 text-blue-500" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Segurança de Dados</span>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                    Suas informações financeiras são criptografadas e processadas por parceiros certificados PCI-DSS.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">Zona de Perigo</h3>
          </div>
          <p className="text-xs text-zinc-500 font-medium">Ao excluir sua loja, todos os dados de produtos, pedidos e histórico financeiro serão permanentemente removidos. Esta ação não pode ser desfeita.</p>
          <Button variant="danger" className="w-fit">Excluir Minha Loja</Button>
        </div>
      </main>
    </div>
  );
};

export default StoreSettingsPage;
