import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  ChevronLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight,
  Clock,
  ShieldCheck,
  Ticket,
  CheckCircle2,
  QrCode,
  Wallet,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../../lib/utils";
import { PageHeader } from "../../../shared/components/layout/PageHeader";
import { Button } from "../../../shared/components/ui/Button";
import { Badge } from "../../../shared/components/ui/Badge";
import { Input } from "../../../shared/components/ui/Input";
import { Avatar } from "../../../shared/components/ui/Avatar";
import { toast } from "sonner";
import { DeliveryModeSelector } from "../../../shared/components/DeliveryModeSelector";
import { DeliveryMode } from "../../../shared/orderStateMachine";
import { SuccessScreen } from "../../../shared/components/SuccessScreen";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("delivery");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [coupon, setCoupon] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Mock store settings
  const storeSettings = {
    taxaEntrega: 6.00,
    tempoEntrega: "30-45 min",
    tempoPreparo: "15-20 min",
    aceitaEntrega: true,
    aceitaRetirada: true,
    minOrderValue: 15.00
  };

  const cartItems = [
    { id: 1, name: "Pizza Calabresa G", price: 54.90, quantity: 1, image: "https://picsum.photos/seed/pizza1/100/100" },
    { id: 2, name: "Coca-Cola 2L", price: 12.00, quantity: 2, image: "https://picsum.photos/seed/coke/100/100" },
    { id: 3, name: "Batata Frita M", price: 24.90, quantity: 1, image: "https://picsum.photos/seed/fries/100/100" },
  ];

  const subtotal = useMemo(() => cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0), [cartItems]);
  const deliveryFee = deliveryMode === "delivery" ? storeSettings.taxaEntrega : 0;
  const discount = coupon.toUpperCase() === "BEMVINDO10" ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryFee - discount;

  const handleNextStep = () => {
    if (step === 1) {
      if (deliveryMode === "delivery") setStep(2);
      else setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 3 && deliveryMode === "pickup") setStep(1);
    else setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <SuccessScreen 
          title="Pedido Realizado!" 
          subtitle="Seu pedido foi enviado para a loja e já está sendo processado."
          onAction={() => navigate("/tracking/order-123")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-32">
      <PageHeader 
        title="Finalizar Pedido" 
        subtitle={`Etapa ${step} de 4`}
        onBack={step > 1 ? handlePrevStep : () => navigate(-1)}
      />

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Steps */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.section
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <ShoppingBag className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Resumo e Modo</h2>
                    </div>
                    
                    <DeliveryModeSelector 
                      selected={deliveryMode} 
                      onChange={setDeliveryMode} 
                      storeSettings={storeSettings} 
                    />

                    <div className="flex flex-col gap-4 mt-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                          <Avatar src={item.image} fallback={item.name} size="lg" className="rounded-xl" />
                          <div className="flex flex-col flex-1">
                            <span className="text-xs font-black uppercase tracking-tight text-white">{item.name}</span>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Qtd: {item.quantity} • R$ {item.price.toFixed(2)}</span>
                          </div>
                          <span className="text-xs font-black text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <Button variant="primary" className="w-full h-16" onClick={handleNextStep}>
                      Continuar
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.section>
              )}

              {step === 2 && (
                <motion.section
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <MapPin className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Endereço de Entrega</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input label="CEP" placeholder="00000-000" className="md:col-span-1" />
                      <Input label="Cidade" placeholder="São Paulo" className="md:col-span-1" />
                      <Input label="Rua" placeholder="Rua das Flores" className="md:col-span-2" />
                      <Input label="Número" placeholder="123" className="md:col-span-1" />
                      <Input label="Bairro" placeholder="Bela Vista" className="md:col-span-1" />
                      <Input label="Complemento" placeholder="Apt 45" className="md:col-span-2" />
                    </div>

                    <div className="h-48 bg-zinc-950 border border-zinc-800 rounded-2xl relative overflow-hidden flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-orange-500 animate-bounce" />
                      <span className="absolute bottom-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Mapa Simulado</span>
                    </div>

                    <Button variant="primary" className="w-full h-16" onClick={handleNextStep}>
                      Confirmar Endereço
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.section>
              )}

              {step === 3 && (
                <motion.section
                  key="step3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <CreditCard className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Pagamento</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { id: "credit_card", label: "Cartão de Crédito", icon: CreditCard, desc: "Pague pelo app" },
                        { id: "pix", label: "Pix", icon: QrCode, desc: "Aprovação instantânea" },
                        { id: "cash", label: "Dinheiro", icon: Coins, desc: "Pague na entrega" },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setPaymentMethod(method.id)}
                          className={cn(
                            "flex items-center justify-between p-6 rounded-2xl border transition-all",
                            paymentMethod === method.id 
                              ? "bg-orange-500/10 border-orange-500 text-orange-500" 
                              : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "p-3 rounded-xl",
                              paymentMethod === method.id ? "bg-orange-500 text-white" : "bg-zinc-800 text-zinc-600"
                            )}>
                              <method.icon className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-black uppercase tracking-widest">{method.label}</span>
                              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{method.desc}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            paymentMethod === method.id ? "border-orange-500" : "border-zinc-800"
                          )}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                          </div>
                        </button>
                      ))}
                    </div>

                    {paymentMethod === "pix" && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col items-center gap-4 text-center"
                      >
                        <div className="w-32 h-32 bg-white p-2 rounded-xl">
                          <div className="w-full h-full bg-zinc-100 flex items-center justify-center text-zinc-900">
                            <QrCode className="w-16 h-16" />
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Escaneie o QR Code ou copie o código abaixo</p>
                        <Button variant="outline" size="sm" className="w-full">Copiar Código Pix</Button>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-4 pt-6 border-t border-zinc-800">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-orange-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Cupom de Desconto</h3>
                      </div>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                          placeholder="Insira seu cupom"
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 transition-all"
                        />
                        <Button variant="outline">Aplicar</Button>
                      </div>
                    </div>

                    <Button variant="primary" className="w-full h-16" onClick={handleNextStep}>
                      Continuar para Revisão
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.section>
              )}

              {step === 4 && (
                <motion.section
                  key="step4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col gap-8"
                >
                  <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-500/10 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                      </div>
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Revisão Final</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-orange-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Entrega em</span>
                        </div>
                        <p className="text-xs text-white font-bold">Rua das Flores, 123 - Apt 45. Bela Vista, São Paulo - SP</p>
                      </div>

                      <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl flex flex-col gap-3">
                        <div className="flex items-center gap-2 text-orange-500">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Pagamento via</span>
                        </div>
                        <p className="text-xs text-white font-bold">
                          {paymentMethod === "credit_card" ? "Cartão de Crédito (App)" : 
                           paymentMethod === "pix" ? "Pix (App)" : "Dinheiro na Entrega"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 pt-8 border-t border-zinc-800">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500">
                        <span>Taxa de Entrega</span>
                        <span className={deliveryMode === "pickup" ? "text-green-500" : ""}>
                          {deliveryMode === "pickup" ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}
                        </span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-green-500">
                          <span>Desconto (10%)</span>
                          <span>- R$ {discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                        <span className="text-sm font-black uppercase tracking-widest text-white">Total</span>
                        <span className="text-2xl font-black text-orange-500">R$ {total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Button 
                      variant="primary" 
                      className="w-full h-16 text-sm font-black uppercase tracking-[0.2em]"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processando..." : "Fazer Pedido"}
                      {!isProcessing && <ArrowRight className="w-5 h-5" />}
                    </Button>
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Summary (Visible on desktop) */}
          <div className="hidden lg:col-span-5 lg:flex flex-col gap-8">
            <section className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 flex flex-col gap-8 sticky top-32 shadow-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Seu Carrinho</h2>
                <Badge variant="secondary" size="xs">{cartItems.length} itens</Badge>
              </div>

              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <Avatar src={item.image} fallback={item.name} size="md" className="rounded-xl border border-zinc-800" />
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] font-black uppercase tracking-tight text-white">{item.name}</span>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Qtd: {item.quantity}</span>
                    </div>
                    <span className="text-[10px] font-black text-white">R$ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 pt-6 border-t border-zinc-800">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
                  <span>Taxa</span>
                  <span>{deliveryMode === "pickup" ? "Grátis" : `R$ ${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <span className="text-xs font-black uppercase tracking-widest text-white">Total</span>
                  <span className="text-lg font-black text-orange-500">R$ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-zinc-600" />
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">Checkout Seguro</span>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
