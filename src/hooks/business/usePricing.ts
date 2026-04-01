import { useState, useMemo } from 'react';
import { calculatePricing, PricingInput, PricingResult } from '../../shared/engines/pricingEngine';

/**
 * Hook para cálculo de precificação em tempo real.
 * Reage a mudanças no subtotal, modo de entrega e cupom.
 */
export const usePricing = (initialInput: PricingInput) => {
  const [input, setInput] = useState<PricingInput>(initialInput);

  const pricingResult = useMemo<PricingResult>(() => {
    return calculatePricing(input);
  }, [input]);

  const updateInput = (newInput: Partial<PricingInput>) => {
    setInput(prev => ({ ...prev, ...newInput }));
  };

  return {
    pricing: pricingResult,
    input,
    updateInput
  };
};
