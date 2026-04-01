import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Bike, 
  ShoppingBag,
  Bell
} from "lucide-react";
import { cn } from "../../../lib/utils";
import { Badge } from "../../../shared/components/ui/Badge";
import { Button } from "../../../shared/components/ui/Button";
import { Order, OrderStatus } from "../../../shared/types";

interface KanbanColumn {
  id: OrderStatus;
  label: string;
  color: string;
}

const columns: KanbanColumn[] = [
  { id: "novo", label: "Novos", color: "bg-blue-500" },
  { id: "aceito", label: "Aceitos", color: "bg-orange-500" },
  { id: "preparo", label: "Em Preparo", color: "bg-amber-500" },
  { id: "pronto", label: "Prontos", color: "bg-emerald-500" },
  { id: "entrega", label: "Em Rota", color: "bg-purple-500" },
];

interface OrderKanbanProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderKanban: React.FC<OrderKanbanProps> = ({ orders, onUpdateStatus }) => {
  const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null);

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <div className="flex gap-6 overflow-x-auto pb-8 no-scrollbar min-h-[70vh]">
      {columns.map((column) => (
        <div 
          key={column.id} 
          className="flex flex-col gap-4 min-w-[320px] max-w-[320px] shrink-0"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", column.color)} />
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400">
                {column.label}
              </h3>
            </div>
            <Badge variant="secondary" size="xs">{getOrdersByStatus(column.id).length}</Badge>
          </div>

          <div 
            className={cn(
              "flex-1 flex flex-col gap-4 p-4 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-3xl transition-colors",
              draggedOrderId && "bg-zinc-900/50 border-zinc-700"
            )}
          >
            <AnimatePresence mode="popLayout">
              {getOrdersByStatus(column.id).map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  draggable
                  onDragStart={() => setDraggedOrderId(order.id)}
                  onDragEnd={() => setDraggedOrderId(null)}
                  className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-xl group hover:border-orange-500/50 transition-colors cursor-grab active:cursor-grabbing"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                        #{order.id.slice(-4)}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span className="text-[10px] font-black text-zinc-300">12 min</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <h4 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-orange-500 transition-colors">
                        {order.cliente.nome}
                      </h4>
                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <MapPin className="w-3 h-3" />
                        <span className="text-[10px] font-bold uppercase tracking-widest truncate">
                          {typeof order.cliente.endereco === 'string' ? order.cliente.endereco : order.cliente.endereco?.neighborhood}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 py-3 border-y border-zinc-800/50">
                      {order.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            {item.quantidade}x {item.nome}
                          </span>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">
                          + {order.items.length - 2} itens
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-white">
                        R$ {order.total.toFixed(2)}
                      </span>
                      <div className="flex items-center gap-2">
                        {column.id === "novo" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-8 text-[9px]"
                            onClick={() => onUpdateStatus(order.id, "aceito")}
                          >
                            Aceitar
                          </Button>
                        )}
                        {column.id === "aceito" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-8 text-[9px]"
                            onClick={() => onUpdateStatus(order.id, "preparo")}
                          >
                            Preparar
                          </Button>
                        )}
                        {column.id === "preparo" && (
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="h-8 text-[9px]"
                            onClick={() => onUpdateStatus(order.id, "pronto")}
                          >
                            Pronto
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {getOrdersByStatus(column.id).length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 opacity-20">
                <ShoppingBag className="w-8 h-8 mb-2" />
                <span className="text-[10px] font-black uppercase tracking-widest text-center">Vazio</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
