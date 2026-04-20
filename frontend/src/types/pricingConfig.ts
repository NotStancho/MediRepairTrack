// types/pricingConfig

import type { RepairType } from './claim/claim';

export interface PricingConfig {
    repairType: RepairType;
    laborPricePerHour: number;
    laborMinHours: number | null;
    partsCoefficient: number;
    deliveryCoefficient: number;
    description: string | null;
    createdAt: string;
    updatedAt?: string | null;
}

export interface UpdatePricingConfigPayload {
    laborPricePerHour: number;
    laborMinHours: number | null;
    partsCoefficient: number;
    deliveryCoefficient: number;
    description: string | null;
}
