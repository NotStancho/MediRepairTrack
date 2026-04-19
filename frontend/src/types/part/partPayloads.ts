// types/part/partPayloads.ts

import type { PartUnitType } from './partUnitType';

export interface CreatePartPayload {
    supplierName: string;
    partCode: string;
    partName: string;
    stockQuantity: number;
    price: number;
    unitName: string;
    unitType: PartUnitType;
    description?: string | null;
}

export interface UpdatePartPayload {
    supplierName: string;
    partName: string;
    price: number;
    unitName: string;
    unitType: PartUnitType;
    description?: string | null;
}

export interface AddPartStockPayload {
    quantity: number;
}
