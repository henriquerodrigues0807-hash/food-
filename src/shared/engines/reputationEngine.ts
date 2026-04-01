export type ReputationBadge =
  | 'new'                 // < 10 pedidos
  | 'rising'              // score > 4.0 e > 20 pedidos
  | 'trusted'             // score > 4.5 e > 50 pedidos
  | 'top_rated'           // score > 4.8 e > 100 pedidos
  | 'at_risk';             // score < 3.5 ou cancelamento > 15%

export interface ReputationMetrics {
  avgRating: number;         // 1.0 a 5.0
  totalOrders: number;
  cancellationRate: number;  // 0.0 a 1.0
  avgPrepTimeMinutes: number;
  avgDeliveryTimeMinutes: number;
  responseTimeSeconds: number;
}

export interface ReputationResult {
  score: number;             // 0 a 100 (calculado)
  badge: ReputationBadge;
  level: number;             // 1 a 10
  nextLevelProgress: number; // 0.0 a 1.0
  recommendation: string;
}

/**
 * Motor de Reputação e Gamificação
 * Calcula o score e o selo de reputação de uma loja ou entregador.
 */
export const calculateReputation = (
  metrics: ReputationMetrics,
  target: 'store' | 'driver'
): ReputationResult => {
  const { avgRating, totalOrders, cancellationRate, avgPrepTimeMinutes, avgDeliveryTimeMinutes } = metrics;

  // 1. Cálculo do score (0 a 100)
  // score = (avgRating * 15) + (1 / cancellationRate * 10) + (totalOrders * 0.1)
  // Simplificando para evitar divisão por zero e manter limites
  const ratingScore = avgRating * 15; // max 75
  const cancellationPenalty = cancellationRate * 50; // max 50
  const volumeBonus = Math.min(25, totalOrders * 0.1); // max 25
  
  const score = Math.max(0, Math.min(100, ratingScore - cancellationPenalty + volumeBonus));

  // 2. Atribuição de Badge
  let badge: ReputationBadge = 'new';
  if (totalOrders < 10) {
    badge = 'new';
  } else if (score < 35 || cancellationRate > 0.15) {
    badge = 'at_risk';
  } else if (avgRating > 4.8 && totalOrders > 100) {
    badge = 'top_rated';
  } else if (avgRating > 4.5 && totalOrders > 50) {
    badge = 'trusted';
  } else if (avgRating > 4.0 && totalOrders > 20) {
    badge = 'rising';
  }

  // 3. Level e Progresso
  const level = Math.floor(score / 10) + 1;
  const nextLevelProgress = (score % 10) / 10;

  // 4. Recomendações
  let recommendation = 'Continue prestando um bom serviço!';
  if (badge === 'at_risk') {
    recommendation = 'Atenção: sua taxa de cancelamento está alta. Melhore a disponibilidade para evitar suspensão.';
  } else if (badge === 'new') {
    recommendation = 'Complete mais pedidos para ganhar seu primeiro selo de confiança.';
  } else if (avgPrepTimeMinutes > 40 && target === 'store') {
    recommendation = 'Dica: seu tempo de preparo está acima da média. Tente otimizar a cozinha.';
  }

  return {
    score,
    badge,
    level,
    nextLevelProgress,
    recommendation
  };
};
