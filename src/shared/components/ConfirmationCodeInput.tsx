import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

interface ConfirmationCodeInputProps {
  onComplete: (code: string) => void;
  className?: string;
}

export const ConfirmationCodeInput: React.FC<ConfirmationCodeInputProps> = ({ onComplete, className }) => {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    if (newCode.every(v => v !== "")) {
      onComplete(newCode.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-4 justify-center", className)}>
      {code.map((digit, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="w-14 h-16 bg-zinc-900 border-2 border-zinc-800 rounded-2xl text-center text-2xl font-black text-white focus:outline-none focus:border-orange-500 focus:shadow-[0_0_15px_rgba(249,115,22,0.2)] transition-all"
        />
      ))}
    </div>
  );
};
