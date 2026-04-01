import React from "react";
import { motion } from "motion/react";
import { Plus, Minus, ShoppingBag, Star } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../shared/components/ui/Badge";
import { Product } from "../../../shared/types";

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  onAdd?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onAdd }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-xl hover:border-orange-500/50 transition-all cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.image || "https://picsum.photos/seed/food/400/300"}
          alt={product.nome}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent" />
        
        {product.promocao && (
          <div className="absolute top-3 right-3">
            <Badge variant="orange" size="xs">
              {product.promocao.tipo === "percentual" ? `-${product.promocao.valor}%` : `R$ ${product.promocao.valor} OFF`}
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
            {product.nome}
          </h3>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-zinc-800/50">
          <div className="flex flex-col">
            {product.promocao && (
              <span className="text-[10px] font-bold text-zinc-600 line-through uppercase tracking-widest">
                R$ {product.preco.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-black text-white">
              R$ {(product.promocao 
                ? product.promocao.tipo === "percentual" 
                  ? product.preco * (1 - product.promocao.valor / 100)
                  : product.preco - product.promocao.valor
                : product.preco
              ).toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAdd && onAdd(product);
            }}
            className="p-2.5 bg-zinc-800 border border-zinc-700 rounded-2xl text-zinc-400 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-lg shadow-black/20"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
