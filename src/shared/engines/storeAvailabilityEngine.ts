export interface StoreSchedule {
  timezone: string;          // ex: 'America/Sao_Paulo'
  slots: WeekSlot[];
  holidays: HolidayEntry[];
  pausedUntil?: string;      // pausa manual com timestamp
  acceptingOrders: boolean;  // toggle manual override
}

export interface WeekSlot {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;   // 0 = domingo
  openTime: string;          // ex: '11:00'
  closeTime: string;         // ex: '23:00'
  acceptOrdersUntil?: string; // ex: '22:30' — aceita pedidos antes de fechar
}

export interface HolidayEntry {
  date: string;              // 'YYYY-MM-DD'
  closed: boolean;
  customSlot?: { openTime: string; closeTime: string };
}

export type StoreAvailabilityStatus =
  | 'open'
  | 'closed_schedule'
  | 'closed_holiday'
  | 'closed_manual'
  | 'paused'
  | 'pre_closing';           // aberta mas não aceita mais pedidos

export interface StoreAvailabilityResult {
  status: StoreAvailabilityStatus;
  opensAt?: string;          // próximo horário de abertura
  closesAt?: string;         // horário de fechamento hoje
  message: string;           // ex: "Abre amanhã às 11:00"
  canOrder: boolean;
}

/**
 * Motor de Disponibilidade da Loja
 * Verifica se a loja está aberta e aceitando pedidos no momento.
 */
export const getStoreAvailability = (
  schedule: StoreSchedule,
  nowOverride?: Date
): StoreAvailabilityResult => {
  const now = nowOverride || new Date();
  const dayOfWeek = now.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', hour12: false });
  const currentDateStr = now.toISOString().split('T')[0];

  // 1. acceptingOrders === false → status 'closed_manual'
  if (!schedule.acceptingOrders) {
    return { status: 'closed_manual', message: 'Loja fechada manualmente pelo vendedor', canOrder: false };
  }

  // 2. pausedUntil > now → status 'paused'
  if (schedule.pausedUntil && new Date(schedule.pausedUntil) > now) {
    return { status: 'paused', message: `Loja em pausa até ${new Date(schedule.pausedUntil).toLocaleTimeString()}`, canOrder: false };
  }

  // 3. Verificar feriados antes de horário semanal
  const holiday = schedule.holidays.find(h => h.date === currentDateStr);
  if (holiday) {
    if (holiday.closed) {
      return { status: 'closed_holiday', message: 'Loja fechada devido ao feriado', canOrder: false };
    }
    if (holiday.customSlot) {
      const { openTime, closeTime } = holiday.customSlot;
      if (currentTimeStr < openTime || currentTimeStr > closeTime) {
        return { status: 'closed_holiday', message: `Horário especial de feriado: ${openTime} às ${closeTime}`, canOrder: false };
      }
      // Se estiver no horário do feriado, continua para verificar pre_closing se houver
    }
  }

  // 4. Horário Semanal
  const todaySlots = schedule.slots.filter(s => s.dayOfWeek === dayOfWeek);
  if (todaySlots.length === 0) {
    return { status: 'closed_schedule', message: 'Loja fechada hoje', canOrder: false };
  }

  // Encontrar slot atual ou próximo
  const currentSlot = todaySlots.find(s => currentTimeStr >= s.openTime && currentTimeStr <= s.closeTime);
  
  if (!currentSlot) {
    return { status: 'closed_schedule', message: 'Loja fora do horário de funcionamento', canOrder: false };
  }

  // 5. Se now > acceptOrdersUntil mas < closeTime → 'pre_closing'
  if (currentSlot.acceptOrdersUntil && currentTimeStr > currentSlot.acceptOrdersUntil) {
    return { 
      status: 'pre_closing', 
      message: 'Loja aberta, mas não aceita novos pedidos no momento', 
      canOrder: false,
      closesAt: currentSlot.closeTime
    };
  }

  return { 
    status: 'open', 
    message: 'Loja aberta e aceitando pedidos', 
    canOrder: true,
    closesAt: currentSlot.closeTime
  };
};
