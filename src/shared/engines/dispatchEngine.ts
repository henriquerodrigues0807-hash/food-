import { Order } from '../types/index';

export interface DispatchInput {
  order: Order;
  availableDrivers: DriverDispatchProfile[];
  storeLocation: GeoPoint;
}

export interface DriverDispatchProfile {
  driverId: string;
  name: string;
  vehicle: 'moto' | 'bicicleta' | 'carro' | 'a_pe';
  location: GeoPoint;
  distanceToStoreKm: number;
  rating: number;
  acceptanceRate: number;
  totalDeliveriesToday: number;
  status: 'online' | 'busy' | 'offline';
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface DispatchResult {
  eligible: DriverDispatchProfile[];
  recommended: DriverDispatchProfile | null;
  reason: string;
  estimatedPickupMinutes: number;
}

/**
 * Motor de Despacho de Entregadores
 * Filtra e recomenda o melhor entregador para um pedido.
 */
export const dispatch = (input: DispatchInput): DispatchResult => {
  const { availableDrivers } = input;

  // 1. Filtros de elegibilidade
  const eligible = availableDrivers.filter(driver => {
    // status === 'online' (não busy, não offline)
    if (driver.status !== 'online') return false;

    // acceptanceRate >= 0.60 (não penalizar abaixo disso, apenas priorizar)
    // A regra diz: "não penalizar abaixo disso, apenas priorizar", mas o critério de elegibilidade diz 0.60. 
    // Vou seguir o critério de elegibilidade.
    if (driver.acceptanceRate < 0.60) return false;

    // distanceToStoreKm <= store.maxRadiusKm (assumindo que já vem filtrado ou que temos o raio)
    // Se não tivermos o raio, ignoramos ou assumimos um padrão de 10km
    if (driver.distanceToStoreKm > 10) return false;

    return true;
  });

  if (eligible.length === 0) {
    return {
      eligible: [],
      recommended: null,
      reason: 'Nenhum entregador disponível no momento',
      estimatedPickupMinutes: 0
    };
  }

  // 2. Score de prioridade (maior = melhor)
  // score = (1 / distanceToStoreKm) * 0.5 + (rating / 5) * 0.3 + (acceptanceRate) * 0.2
  const scoredDrivers = eligible.map(driver => {
    const score = (1 / Math.max(0.1, driver.distanceToStoreKm)) * 0.5
                + (driver.rating / 5) * 0.3
                + (driver.acceptanceRate) * 0.2;
    return { ...driver, score };
  });

  // Ordenar por score descendente
  scoredDrivers.sort((a, b) => b.score - a.score);

  const recommended = scoredDrivers[0];

  // 3. Estimativa de pickup
  // estimatedPickupMinutes = (distanceToStoreKm / avgSpeedKm) * 60
  // avgSpeed: moto=30, bicicleta=15, carro=25, a_pe=5
  const avgSpeeds = {
    moto: 30,
    bicicleta: 15,
    carro: 25,
    a_pe: 5
  };

  const avgSpeed = avgSpeeds[recommended.vehicle] || 20;
  const estimatedPickupMinutes = Math.ceil((recommended.distanceToStoreKm / avgSpeed) * 60);

  return {
    eligible: scoredDrivers,
    recommended,
    reason: 'Entregador recomendado com base em proximidade e performance',
    estimatedPickupMinutes
  };
};
