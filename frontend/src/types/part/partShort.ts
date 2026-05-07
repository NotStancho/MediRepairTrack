// types/part/partShort.ts

import type { PartUnitType } from './partUnitType';

export interface PartShort {
    id: number;

    partCode: string;
    partName: string;

    stockQuantity: number;
    price: number;

    unitName: string;
    unitType: PartUnitType;
}
