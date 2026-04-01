import React, { useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar lojas ou pratos...",
  className,
}) => {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(term);
    }, 300);

    return () => clearTimeout(timer);
  }, [term, onSearch]);

  return (
    <div className={cn("relative group w-full", className)}>
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-orange-500 transition-colors">
        <Search className="w-5 h-5" />
      </div>
      
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-14 pr-16 py-4 text-sm text-white placeholder:text-zinc-600 transition-all focus:outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 shadow-xl"
      />

      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <AnimatePresence>
          {term && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setTerm("")}
              className="p-2 bg-zinc-800 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
        
        <button className="p-2.5 bg-orange-500 text-white rounded-full shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
