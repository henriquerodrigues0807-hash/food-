import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "../../../lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = true,
  onBack,
  rightAction,
  className,
  sticky = true,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      className={cn(
        "bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900 px-6 py-6 z-40",
        sticky && "sticky top-0",
        className
      )}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex flex-col">
            <h1 className="text-lg font-black uppercase tracking-tight text-white leading-none">
              {title}
            </h1>
            {subtitle && (
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-1">
                {subtitle}
              </span>
            )}
          </div>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};
