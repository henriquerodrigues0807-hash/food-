import { Delivery, DeliveryStatus } from '../types';

// Mock Data
const mockDeliveries: Delivery[] = [
  {
    id: 'del-1',
    storeId: 'st-1',
    storeName: 'Burger King',
    storeAddress: 'Av. Paulista, 1000',
    store: {
      name: 'Burger King',
      address: 'Av. Paulista, 1000',
    },
    customerName: 'João Silva',
    customerPhone: '(11) 99999-8888',
    customerAddress: 'Rua Augusta, 500, Ap 42',
    customer: {
      name: 'João Silva',
      address: 'Rua Augusta, 500, Ap 42',
      phone: '(11) 99999-8888',
    },
    distanceKm: 3.2,
    estimatedMinutes: 15,
    estimatedTimeMin: 15,
    value: 12.50,
    status: 'available',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'del-2',
    storeId: 'st-2',
    storeName: 'Sushi House',
    storeAddress: 'Rua Oscar Freire, 200',
    store: {
      name: 'Sushi House',
      address: 'Rua Oscar Freire, 200',
    },
    customerName: 'Maria Souza',
    customerPhone: '(11) 97777-6666',
    customerAddress: 'Al. Santos, 1200',
    customer: {
      name: 'Maria Souza',
      address: 'Al. Santos, 1200',
      phone: '(11) 97777-6666',
    },
    distanceKm: 1.8,
    estimatedMinutes: 10,
    estimatedTimeMin: 10,
    value: 8.90,
    status: 'available',
    createdAt: new Date().toISOString(),
  },
];

export const deliveryService = {
  getAvailable: async (driverId: string): Promise<Delivery[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockDeliveries;
  },
  accept: async (deliveryId: string, driverId: string): Promise<Delivery> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const delivery = mockDeliveries.find(d => d.id === deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    return { ...delivery, status: 'collecting', acceptedAt: new Date().toISOString() };
  },
  updateStatus: async (deliveryId: string, status: DeliveryStatus): Promise<Delivery> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const delivery = mockDeliveries.find(d => d.id === deliveryId);
    if (!delivery) throw new Error('Delivery not found');
    return { ...delivery, status, deliveredAt: status === 'delivered' ? new Date().toISOString() : undefined };
  },
  getActive: async (driverId: string): Promise<Delivery | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // For mock purposes, return null (no active delivery)
    return null;
  },
  getHistory: async (driverId: string, period: 'day' | 'week' | 'month' = 'day'): Promise<Delivery[]> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return mockDeliveries.map(d => ({ ...d, status: 'delivered', deliveredAt: new Date().toISOString() }));
  },
};
