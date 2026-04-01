export type DriverStatus = 'online' | 'offline' | 'busy';

export type VehicleType = 'moto' | 'bicicleta' | 'carro' | 'a_pe';

export type DeliveryStatus =
  | 'available'
  | 'collecting'
  | 'collected'
  | 'in_transit'
  | 'delivered'
  | 'failed';

export interface Driver {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  email: string;
  vehicle: VehicleType;
  vehicleType: VehicleType; // Alias
  radiusKm: number;
  avatarUrl?: string;
  profilePhoto?: string; // Alias
  rating: number;
  totalDeliveries: number;
  acceptanceRate: number;
  status: DriverStatus;
  isOnline: boolean; // Convenience
  avgDeliveryTime: number; // Added
  verifiedAt?: string;
  createdAt: string;
}

export interface Delivery {
  id: string;
  storeId: string;
  storeName: string;
  storeAddress: string;
  store: {
    name: string;
    address: string;
  };
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  distanceKm: number;
  estimatedMinutes: number;
  estimatedTimeMin: number; // Alias
  value: number;
  status: DeliveryStatus;
  acceptedAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface EarningsEntry {
  id: string;
  deliveryId: string;
  amount: number;
  date: string;
  storeName: string;
}

export interface WalletState {
  available: number;
  pending: number;
  totalLifetime: number;
  entries: EarningsEntry[];
}
