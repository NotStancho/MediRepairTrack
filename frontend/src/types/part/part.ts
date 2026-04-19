// types/part/part.ts

import type { PartUnitType } from './partUnitType';

export interface Part {
    id: number;

    supplierName: string;
    partCode: string;
    partName: string;

    stockQuantity: number;
    price: number;

    unitName: string;
    unitType: PartUnitType;

    description: string | null;

    createdAt: string;
    updatedAt?: string | null;
}
