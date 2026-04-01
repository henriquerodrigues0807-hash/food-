import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Star, 
  Clock, 
  Bike, 
  Info, 
  Search, 
  ChevronLeft, 
  ShoppingBag,
  ArrowRight,
  Heart,
  Share2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { useStore } from "../../../context/StoreContext";
import { ProductCard } from "../components/ProductCard";
import { ProductModal } from "../components/ProductModal";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Product, Store } from "../../../shared/types";
import { toast } from "sonner";

const StoreMenuPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { stores } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");

  const store = useMemo(() => {
    return (stores as unknown as Store[]).find((s) => s.slug === slug);
  }, [stores, slug]);

  if (!store) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl">
          🍕
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">Loja não encontrada</h2>
          <p className="text-sm text-zinc-500 font-medium">Não conseguimos localizar a loja que você procura.</p>
        </div>
        <Button variant="primary" onClick={() => navigate("/")}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Button>
      </div>
    );
  }

  const categories = useMemo(() => {
    const cats = new Set(store.products.map((p) => p.categoria));
    return ["all", ...Array.from(cats)];
  }, [store]);

  const filteredProducts = useMemo(() => {
    return store.products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categoria === activeCategory;
      const matchesSearch = p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [store, activeCategory, searchTerm]);

  const handleAddToCart = (item: any) => {
    toast.success(`${item.nome} adicionado ao carrinho!`, {
      description: `Quantidade: ${item.quantidade}`,
      icon: <ShoppingBag className="w-4 h-4 text-orange-500" />
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      {/* Hero Header */}
      <div className="relative h-[300px] md:h-[400px]">
        <img
          src={store.settings.banner}
          alt={store.settings.nome}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <button
            onClick={() => navigate("/")}
            className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-3 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Store Info Overlay */}
        <div className="absolute -bottom-10 left-6 right-6 max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8">
            <Avatar 
              src={store.settings.logo} 
              fallback={store.settings.nome} 
              size="xl" 
              className="w-24 h-24 md:w-32 md:h-32 border-4 border-zinc-800 -mt-16 md:mt-0"
            />
            <div className="flex flex-col items-center md:items-start gap-4 flex-1 text-center md:text-left">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <h1 className="text-2xl font-black uppercase tracking-tight text-white">
                    {store.settings.nome}
                  </h1>
                  <Badge variant={store.settings.status === "aberto" ? "success" : "secondary"} size="xs">
                    {store.settings.status === "aberto" ? "Aberto" : "Fechado"}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {store.settings.categoria} • {store.settings.raioEntrega}km • {store.settings.tempoPreparo}
                </p>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span className="text-sm font-black text-white">{store.settings.rating || "4.8"}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">(120+ avaliações)</span>
                </div>
                <div className="w-px h-4 bg-zinc-800" />
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-black text-white">
                    {store.settings.taxaEntrega === 0 ? "Grátis" : `R$ ${store.settings.taxaEntrega.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Info className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <main className="max-w-6xl mx-auto px-6 pt-24 pb-20 flex flex-col gap-10">
        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar no cardápio..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-14 pr-6 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                  activeCategory === cat 
                    ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                )}
              >
                {cat === "all" ? "Todos" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard 
                  product={product} 
                  onAdd={(p) => {
                    setSelectedProduct(p);
                    setIsModalOpen(true);
                  }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Cart Summary */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6"
      >
        <button
          onClick={() => navigate("/checkout")}
          className="w-full flex items-center justify-between bg-orange-500 text-white p-6 rounded-[32px] shadow-2xl shadow-orange-500/40 group hover:bg-orange-600 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-white/20 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-orange-500 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-orange-500">
                3
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Finalizar Pedido</span>
              <span className="text-lg font-black">R$ 124,50</span>
            </div>
          </div>
          <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
            Carrinho
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

export default StoreMenuPage;
