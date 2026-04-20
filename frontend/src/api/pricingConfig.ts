// api/pricingConfig.ts

import { api } from './api';

import type {
    PricingConfig,
    UpdatePricingConfigPayload,
} from '../types/pricingConfig';
import type { RepairType } from '../types/claim/claim';

export const getAllPricingConfigs = async (): Promise<PricingConfig[]> =>
    (await api.get<PricingConfig[]>('/api/pricing')).data;

export const updatePricingConfig = async (
    repairType: RepairType,
    payload: UpdatePricingConfigPayload
): Promise<PricingConfig> =>
    (await api.put<PricingConfig>(`/api/pricing/${repairType}`, payload)).data;
