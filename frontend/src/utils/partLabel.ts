//utils/partLabel.ts

import type { PartUnitType } from '../types/part/partUnitType';

export const PART_UNIT_TYPE_OPTIONS: PartUnitType[] = [
    'PIECE',
    'FRACTIONAL',
];

export const PART_UNIT_TYPE_LABELS: Record<PartUnitType, string> = {
    PIECE: 'Штучна',
    FRACTIONAL: 'Дробова',
};

export const PART_UNIT_TYPE_COLORS: Record<PartUnitType, string> = {
    PIECE: 'bg-sky-100 text-sky-800',
    FRACTIONAL: 'bg-emerald-100 text-emerald-800',
};

export function getPartUnitTypeLabel(type?: PartUnitType | null) {
    if (!type) return '-';
    return PART_UNIT_TYPE_LABELS[type] ?? type;
}
