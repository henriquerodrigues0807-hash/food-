import React, { useState } from "react";
import { Star, X, MessageSquare, CheckCircle2 } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { cn } from "../../lib/utils";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title = "Como foi sua experiência?", 
  subtitle = "Sua avaliação ajuda a melhorar o serviço",
  className 
}) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onSubmit(rating, comment);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("max-w-md", className)}>
      <div className="flex flex-col gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-white">{title}</h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{subtitle}</p>
        </div>

        <div className="flex items-center justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              className="p-2 transition-all hover:scale-125"
            >
              <Star 
                className={cn(
                  "w-10 h-10 transition-all",
                  (hover || rating) >= star ? "text-orange-500 fill-orange-500" : "text-zinc-800"
                )} 
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Comentário (Opcional)</h3>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte-nos mais sobre o que achou..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-4 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-orange-500/50 min-h-[100px] transition-all"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="ghost" className="flex-1" onClick={onClose}>Pular</Button>
          <Button 
            variant="primary" 
            className="flex-1" 
            disabled={rating === 0}
            onClick={handleSubmit}
          >
            Enviar Avaliação
          </Button>
        </div>
      </div>
    </Modal>
  );
};
