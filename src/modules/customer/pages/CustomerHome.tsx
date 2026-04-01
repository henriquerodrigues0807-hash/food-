import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MapPin, 
  Bell, 
  Search, 
  Filter, 
  ShoppingBag, 
  User, 
  Clock,
  Star,
  Bike
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../../../lib/utils";
import { useStore } from "../../../context/StoreContext";
import { StoreBanner } from "../components/StoreBanner";
import { CategoryFilter } from "../components/CategoryFilter";
import { SearchBar } from "../components/SearchBar";
import { StoreGrid } from "../components/StoreGrid";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { Store } from "../../../shared/types";

const categories = [
  { id: "all", label: "Tudo", icon: "🍔" },
  { id: "pizza", label: "Pizza", icon: "🍕" },
  { id: "burger", label: "Burger", icon: "🍔" },
  { id: "japonesa", label: "Japa", icon: "🍣" },
  { id: "doces", label: "Doces", icon: "🍰" },
  { id: "bebidas", label: "Bebidas", icon: "🥤" },
  { id: "saudavel", label: "Saudável", icon: "🥗" },
];

const CustomerHome: React.FC = () => {
  const { stores } = useStore();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStores = useMemo(() => {
    return (stores as unknown as Store[]).filter((store) => {
      const matchesCategory = activeCategory === "all" || store.settings.categoria.toLowerCase().includes(activeCategory.toLowerCase());
      const matchesSearch = store.settings.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           store.settings.categoria.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [stores, activeCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-2xl border-b border-zinc-900 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-500/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                Entregar em
              </span>
              <div className="flex items-center gap-1 group cursor-pointer">
                <h1 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
                  Rua das Flores, 123
                </h1>
                <motion.div
                  animate={{ y: [0, 2, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Search className="w-3 h-3 text-orange-500" />
                </motion.div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative p-2.5 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-zinc-950" />
            </div>
            <Avatar 
              fallback="Henri Rodrigues" 
              src="https://picsum.photos/seed/henri/100/100" 
              size="md" 
              className="cursor-pointer hover:border-orange-500 transition-colors"
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 flex flex-col gap-10">
        {/* Hero Banner */}
        <StoreBanner 
          title="Pizza em Dobro" 
          subtitle="Peça uma G e ganhe uma M de chocolate"
          image="https://picsum.photos/seed/promo/1920/1080"
          onCtaClick={() => navigate("/store/pizza-top")}
        />

        {/* Search & Filter Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-white">
              O que você quer comer hoje?
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Explore as melhores opções da sua região
            </p>
          </div>
          
          <SearchBar onSearch={setSearchTerm} />
          
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory} 
            onChange={setActiveCategory} 
          />
        </div>

        {/* Stores Section */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                Lojas Disponíveis
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="xs">12 Abertas</Badge>
                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {filteredStores.length} resultados
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm">Ver Mapa</Button>
          </div>

          <StoreGrid 
            stores={filteredStores} 
            onStoreClick={(store) => navigate(`/store/${store.slug}`)} 
          />
        </div>
      </main>

      {/* Floating Cart Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/checkout")}
        className="fixed bottom-8 right-8 z-50 flex items-center gap-4 bg-orange-500 text-white px-8 py-4 rounded-full shadow-2xl shadow-orange-500/40 group"
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-orange-500 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-orange-500">
            3
          </span>
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Ver Carrinho</span>
          <span className="text-sm font-black">R$ 124,50</span>
        </div>
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
          <Search className="w-4 h-4 rotate-90" />
        </div>
      </motion.button>
    </div>
  );
};

export default CustomerHome;
