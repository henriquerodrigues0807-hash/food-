import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Bike, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  ChevronLeft, 
  CheckCircle2, 
  Package, 
  Store,
  Navigation,
  Star,
  AlertCircle,
  QrCode,
  Info,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { OrderTimeline } from "../../../shared/components/OrderTimeline";
import { OrderStatus, DeliveryMode } from "../../../shared/orderStateMachine";
import { toast } from "sonner";
import { CancelOrderModal } from "../../../shared/components/CancelOrderModal";
import { RatingModal } from "../../../shared/components/RatingModal";

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  
  // Mock order state
  const [status, setStatus] = useState<OrderStatus>("confirmed");
  const [mode, setMode] = useState<DeliveryMode>("delivery");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  // Simulation of order progress
  useEffect(() => {
    const deliveryFlow: OrderStatus[] = [
      'confirmed', 'preparing', 'ready', 'waiting_driver', 
      'driver_assigned', 'collecting', 'collected', 'in_transit', 'delivered'
    ];
    const pickupFlow: OrderStatus[] = [
      'confirmed', 'preparing', 'ready_for_pickup', 'picked_up'
    ];

    const flow = mode === "delivery" ? deliveryFlow : pickupFlow;
    let currentIndex = flow.indexOf(status);

    const timer = setInterval(() => {
      if (currentIndex < flow.length - 1) {
        currentIndex++;
        setStatus(flow[currentIndex]);
        
        if (flow[currentIndex] === 'delivered' || flow[currentIndex] === 'picked_up') {
          setIsRatingModalOpen(true);
          clearInterval(timer);
        }
      }
    }, 8000);

    return () => clearInterval(timer);
  }, [mode]);

  const handleCancelOrder = (reason: string) => {
    setStatus("cancelled_by_customer");
    toast.error("Pedido cancelado", {
      description: `Motivo: ${reason}`
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      <PageHeader 
        title={`Pedido #${orderId?.split("-")[1] || "1042"}`} 
        subtitle={mode === "delivery" ? "Entrega em tempo real" : "Aguardando retirada"}
        onBack={() => navigate("/")}
      />

      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map & Status */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          {/* Tracking Map Placeholder (Only for delivery) */}
          {mode === "delivery" && status !== 'delivered' && (
            <div className="relative h-[300px] md:h-[400px] bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 blur-3xl animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full border-4 border-orange-500 flex items-center justify-center bg-zinc-950 shadow-2xl">
                    <Bike className="w-10 h-10 text-orange-500 animate-bounce" />
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                <div className="p-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Chegada em</span>
                    <span className="text-sm font-black text-white">12 - 18 min</span>
                  </div>
                </div>
                
                <div className="p-4 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
                    <Navigation className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Distância</span>
                    <span className="text-sm font-black text-white">2.4 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pickup Info (Only for pickup) */}
          {mode === "pickup" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 flex flex-col gap-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-orange-500/10 rounded-2xl">
                    <Store className="w-8 h-8 text-orange-500" />
                  </div>
                  <div className="flex flex-col">
                    <h2 className="text-xl font-black uppercase tracking-tight text-white">Pizza Top</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Rua das Flores, 123 - Bela Vista</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Ver no Mapa</Button>
              </div>

              {status === 'ready_for_pickup' && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-8 bg-zinc-950 border-2 border-orange-500/30 rounded-[32px] flex flex-col items-center gap-6 text-center"
                >
                  <div className="w-48 h-48 bg-white p-4 rounded-3xl">
                    <QrCode className="w-full h-full text-zinc-900" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white">Seu Pedido está Pronto!</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Apresente o QR Code acima para retirar seu pedido na loja.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full">
                    <span className="text-xs font-black text-orange-500 tracking-widest">CÓDIGO: 1042</span>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Status Timeline */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 shadow-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white mb-10">Status do Pedido</h2>
            <OrderTimeline mode={mode} currentStatus={status} />
          </div>
        </div>

        {/* Right Column: Info & Actions */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          {/* Driver Info (Only for delivery) */}
          {mode === "delivery" && ['driver_assigned', 'collecting', 'collected', 'in_transit', 'delivered'].includes(status) && (
            <section className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Entregador</h2>
                <Badge variant="orange" size="xs">Em Rota</Badge>
              </div>
              
              <div className="flex items-center gap-4">
                <Avatar 
                  src="https://picsum.photos/seed/driver/100/100" 
                  fallback="Carlos" 
                  size="lg" 
                  className="rounded-2xl border border-zinc-800"
                />
                <div className="flex flex-col flex-1 gap-1">
                  <h3 className="text-sm font-black uppercase tracking-tight text-white">Carlos Silva</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-orange-500 fill-orange-500" />
                    <span className="text-[10px] font-black text-white">4.9</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Honda CG 160 • ABC-1234</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Phone className="w-4 h-4 mr-2" />
                  Ligar
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat
                </Button>
              </div>
            </section>
          )}

          {/* Delivery Confirmation Code (Only for delivery) */}
          {mode === "delivery" && status === 'in_transit' && (
            <div className="bg-orange-500 border border-orange-400 rounded-[32px] p-8 flex flex-col gap-4 shadow-2xl shadow-orange-500/20">
              <div className="flex items-center gap-3 text-white">
                <Info className="w-5 h-5" />
                <h3 className="text-sm font-black uppercase tracking-widest">Código de Entrega</h3>
              </div>
              <p className="text-xs font-bold text-orange-100 uppercase tracking-widest">Informe este código ao entregador para confirmar o recebimento:</p>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex items-center justify-center">
                <span className="text-4xl font-black text-white tracking-[0.5em]">1042</span>
              </div>
            </div>
          )}

          {/* Order Summary */}
          <section className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8 flex flex-col gap-6 shadow-2xl">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Resumo do Pedido</h2>
            <div className="flex flex-col gap-4">
              {[
                { name: "Pizza Calabresa G", quantity: 1, price: 54.90 },
                { name: "Coca-Cola 2L", quantity: 2, price: 24.00 },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-orange-500">{item.quantity}x</span>
                    <span className="text-xs font-black uppercase tracking-tight text-white">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-zinc-400">R$ {item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-sm font-black uppercase tracking-widest text-white">Total Pago</span>
              <span className="text-xl font-black text-orange-500">R$ 78,90</span>
            </div>
          </section>

          {/* Actions */}
          {['pending', 'confirmed'].includes(status) && (
            <Button 
              variant="danger" 
              className="w-full h-16 text-sm font-black uppercase tracking-[0.2em]"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancelar Pedido
            </Button>
          )}

          <Button 
            variant="ghost" 
            className="w-full"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para a Home
          </Button>
        </div>
      </main>

      <CancelOrderModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={handleCancelOrder} 
      />

      <RatingModal 
        isOpen={isRatingModalOpen} 
        onClose={() => setIsRatingModalOpen(false)} 
        onSubmit={(rating, comment) => {
          toast.success("Obrigado pela sua avaliação!");
          console.log({ rating, comment });
        }} 
      />
    </div>
  );
};

export default OrderTrackingPage;
