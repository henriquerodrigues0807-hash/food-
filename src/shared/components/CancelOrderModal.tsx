import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { cn } from "../../lib/utils";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  className?: string;
}

const CANCEL_REASONS = [
  "Mudei de ideia",
  "Endereço incorreto",
  "Tempo de entrega muito alto",
  "Esqueci de adicionar itens",
  "Outro motivo"
];

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({ isOpen, onClose, onConfirm, className }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const handleConfirm = () => {
    const reason = selectedReason === "Outro motivo" ? otherReason : selectedReason;
    onConfirm(reason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("max-w-md", className)}>
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-red-500/10 rounded-2xl">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tight text-white">Cancelar Pedido?</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Diga-nos o motivo do cancelamento</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {CANCEL_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                selectedReason === reason 
                  ? "bg-red-500/10 border-red-500 text-red-500" 
                  : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
              )}
            >
              <span className="text-xs font-black uppercase tracking-widest">{reason}</span>
              <div className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                selectedReason === reason ? "border-red-500" : "border-zinc-800"
              )}>
                {selectedReason === reason && <div className="w-2 h-2 bg-red-500 rounded-full" />}
              </div>
            </button>
          ))}
        </div>

        {selectedReason === "Outro motivo" && (
          <textarea
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Escreva o motivo..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-red-500/50 min-h-[100px] transition-all"
          />
        )}

        <div className="flex gap-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Voltar</Button>
          <Button 
            variant="danger" 
            className="flex-1" 
            disabled={!selectedReason || (selectedReason === "Outro motivo" && !otherReason)}
            onClick={handleConfirm}
          >
            Confirmar Cancelamento
          </Button>
        </div>
      </div>
    </Modal>
  );
};
