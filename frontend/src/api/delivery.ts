// api/delivery.ts

import { api } from './api';
import type { Delivery, DeliveryView } from '../types/delivery';

export const getAllDeliveries = async (): Promise<DeliveryView[]> =>
    (await api.get<DeliveryView[]>('/api/delivery')).data;

export const getDeliveriesByClient = async (
    clientId: number
): Promise<DeliveryView[]> =>
    (await api.get<DeliveryView[]>(`/api/delivery/client/${clientId}`)).data;

export const getDeliveryById = async (
    deliveryId: number
): Promise<DeliveryView> =>
    (await api.get<DeliveryView>(`/api/delivery/${deliveryId}`)).data;

export const getDeliveriesByClaim = async (
    claimId: number
): Promise<Delivery[]> =>
    (await api.get<Delivery[]>(`/api/delivery/claim/${claimId}`)).data;
