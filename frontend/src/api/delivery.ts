import { api } from './api';
import type { Delivery } from '../types/delivery';

export const getDeliveriesByClaim = async (
    claimId: number
): Promise<Delivery[]> =>
    (await api.get<Delivery[]>(`/api/delivery/claim/${claimId}`)).data;
