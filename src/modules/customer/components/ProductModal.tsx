import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus, ShoppingBag, Star, X, Info } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Product, Addon, Sabor } from "../../../shared/types";
import { Modal } from "../../../shared/components/ui/Modal";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: any) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSabores, setSelectedSabores] = useState<Sabor[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [observation, setObservation] = useState("");

  const finalPrice = useMemo(() => {
    if (!product) return 0;
    let basePrice = product.preco;
    if (product.promocao) {
      basePrice = product.promocao.tipo === "percentual" 
        ? product.preco * (1 - product.promocao.valor / 100)
        : product.preco - product.promocao.valor;
    }

    const addonsTotal = selectedAddons.reduce((acc, addon) => acc + addon.preco, 0);
    const saboresTotal = selectedSabores.reduce((acc, sabor) => acc + sabor.preco, 0);
    
    return (basePrice + addonsTotal + saboresTotal) * quantity;
  }, [product, quantity, selectedAddons, selectedSabores]);

  if (!product) return null;

  const handleToggleAddon = (addon: Addon) => {
    setSelectedAddons((prev) =>
      prev.find((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const handleToggleSabor = (sabor: Sabor) => {
    setSelectedSabores((prev) =>
      prev.find((s) => s.nome === sabor.nome)
        ? prev.filter((s) => s.nome !== sabor.nome)
        : [...prev, sabor]
    );
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      cartId: Math.random().toString(36).substr(2, 9),
      quantidade: quantity,
      saboresSelecionados: selectedSabores,
      adicionaisSelecionados: selectedAddons,
      observacao: observation,
      precoFinal: finalPrice / quantity,
    });
    onClose();
    // Reset state
    setQuantity(1);
    setSelectedSabores([]);
    setSelectedAddons([]);
    setObservation("");
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      className="max-w-2xl p-0 overflow-hidden"
      showClose={false}
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header Image */}
        <div className="relative h-64 shrink-0">
          <img
            src={product.image || "https://picsum.photos/seed/food/800/600"}
            alt={product.nome}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 flex flex-col gap-2">
            <Badge variant="orange" size="xs">{product.categoria}</Badge>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              {product.nome}
            </h2>
          </div>
        </div>

        {/* Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 no-scrollbar">
          <div className="flex flex-col gap-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Descrição</h3>
            <p className="text-sm text-zinc-300 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>

          {/* Sabores (if Pizza) */}
          {product.tipo === "pizza" && product.opcoesSabores && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Escolha os Sabores</h3>
                <Badge variant="secondary" size="xs">Opcional</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.opcoesSabores.map((sabor) => {
                  const isSelected = selectedSabores.find((s) => s.nome === sabor.nome);
                  return (
                    <button
                      key={sabor.nome}
                      onClick={() => handleToggleSabor(sabor)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        isSelected 
                          ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <span className="text-xs font-black uppercase tracking-widest">{sabor.nome}</span>
                      {sabor.preco > 0 && (
                        <span className="text-[10px] font-bold">+ R$ {sabor.preco.toFixed(2)}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Addons */}
          {product.opcoesAdicionais && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Adicionais</h3>
                <Badge variant="secondary" size="xs">Opcional</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.opcoesAdicionais.map((addon) => {
                  const isSelected = selectedAddons.find((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon)}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-2xl border transition-all",
                        isSelected 
                          ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                          : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      )}
                    >
                      <span className="text-xs font-black uppercase tracking-widest">{addon.nome}</span>
                      <span className="text-[10px] font-bold">+ R$ {addon.preco.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Observações</h3>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              placeholder="Ex: Tirar cebola, maionese à parte..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 min-h-[100px] transition-all"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 p-8 bg-zinc-950 border-t border-zinc-900 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4 bg-zinc-900 p-2 rounded-2xl border border-zinc-800">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-black text-white">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button 
            variant="primary" 
            className="flex-1 w-full h-14"
            onClick={handleAddToCart}
          >
            <div className="flex items-center justify-between w-full px-4">
              <span className="text-sm font-black uppercase tracking-widest">Adicionar</span>
              <span className="text-lg font-black">R$ {finalPrice.toFixed(2)}</span>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};
