import React, { useState } from "react";
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, ToggleLeft, ToggleRight, GripVertical } from "lucide-react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { DataTable } from "../../../shared/components/ui/DataTable";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Modal } from "../../../shared/components/ui/Modal";
import { Input } from "../../../shared/components/ui/Input";
import { Product } from "../../../shared/types";
import { toast } from "sonner";

const mockProducts: Product[] = [
  { id: 1, nome: "Pizza Calabresa G", preco: 45, image: "https://picsum.photos/seed/pizza1/100/100", description: "Calabresa, cebola e mussarela", categoria: "Pizza", tipo: "pizza", ativa: true, ordem: 1 },
  { id: 2, nome: "Pizza Margherita G", preco: 40, image: "https://picsum.photos/seed/pizza2/100/100", description: "Mussarela, manjericão e tomate", categoria: "Pizza", tipo: "pizza", ativa: true, ordem: 2 },
  { id: 3, nome: "Pizza Portuguesa G", preco: 48, image: "https://picsum.photos/seed/pizza3/100/100", description: "Presunto, ovo, cebola e mussarela", categoria: "Pizza", tipo: "pizza", ativa: false, ordem: 3 },
  { id: 4, nome: "Coca-Cola 2L", preco: 12, image: "https://picsum.photos/seed/coke/100/100", description: "Refrigerante 2L", categoria: "Bebidas", tipo: "normal", ativa: true, ordem: 4 },
];

const MenuManagementPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleToggleStatus = (productId: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ativa: !p.ativa } : p))
    );
    const product = products.find((p) => p.id === productId);
    toast.success(`${product?.nome} ${!product?.ativa ? "ativado" : "desativado"}`);
  };

  const columns = [
    {
      key: "nome",
      label: "Produto",
      sortable: true,
      render: (value: string, item: Product) => (
        <div className="flex items-center gap-3">
          <GripVertical className="w-4 h-4 text-zinc-700 cursor-grab" />
          <Avatar src={item.image} fallback={value} size="sm" />
          <div className="flex flex-col">
            <span className="font-black text-white uppercase tracking-tight">{value}</span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.categoria}</span>
          </div>
        </div>
      ),
    },
    {
      key: "preco",
      label: "Preço",
      sortable: true,
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
    {
      key: "ativa",
      label: "Status",
      sortable: true,
      render: (value: boolean, item: Product) => (
        <button 
          onClick={() => handleToggleStatus(item.id)}
          className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full transition-colors",
            value ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-800 text-zinc-500"
          )}
        >
          {value ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          <span className="text-[10px] font-black uppercase tracking-widest">{value ? "Ativo" : "Inativo"}</span>
        </button>
      ),
    },
    {
      key: "ordem",
      label: "Ordem",
      sortable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      <PageHeader 
        title="Gestão de Cardápio" 
        subtitle="Controle de produtos e categorias"
        rightAction={
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        }
      />

      <main className="max-w-6xl mx-auto p-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <DataTable 
            columns={columns} 
            data={products} 
            searchPlaceholder="Buscar por nome ou categoria..."
            actions={(item) => (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          />
        </div>
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Editar Produto"
      >
        <div className="flex flex-col gap-6">
          <Input label="Nome do Produto" placeholder="Ex: Pizza Calabresa G" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preço" placeholder="0.00" type="number" />
            <Input label="Categoria" placeholder="Ex: Pizza" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Descrição</label>
            <textarea 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-orange-500/50 min-h-[100px]"
              placeholder="Descreva os ingredientes..."
            />
          </div>
          <Button variant="primary" className="w-full">Salvar Alterações</Button>
        </div>
      </Modal>
    </div>
  );
};

const cn = (...inputs: any[]) => inputs.filter(Boolean).join(" ");

export default MenuManagementPage;
