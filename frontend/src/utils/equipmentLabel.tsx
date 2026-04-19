// utils/equipmentLabels.ts

import type { EquipmentType } from '../types/equipmentModel/equipmentType';

export const EQUIPMENT_TYPE_OPTIONS: EquipmentType[] = [
    'HEMOGLOBINOMETER',
    'MICROSCOPE',
    'ANALYZER',
    'CENTRIFUGE',
    'ELECTROCARDIOGRAPH',
    'ULTRASOUND',
    'XRAY',
];

export const EQUIPMENT_TYPE_LABELS: Record<EquipmentType, string> = {
    HEMOGLOBINOMETER: 'Гемоглобінометр',
    MICROSCOPE: 'Мікроскоп',
    ANALYZER: 'Аналізатор',
    CENTRIFUGE: 'Центрифуга',
    ELECTROCARDIOGRAPH: 'Електрокардіограф',
    ULTRASOUND: 'УЗД апарат',
    XRAY: 'Рентген апарат',
};

export const EQUIPMENT_TYPE_COLORS: Record<EquipmentType, string> = {
    HEMOGLOBINOMETER: 'bg-blue-100 text-blue-800',
    MICROSCOPE: 'bg-purple-100 text-purple-800',
    ANALYZER: 'bg-green-100 text-green-800',
    CENTRIFUGE: 'bg-yellow-100 text-yellow-800',
    ELECTROCARDIOGRAPH: 'bg-red-100 text-red-800',
    ULTRASOUND: 'bg-indigo-100 text-indigo-800',
    XRAY: 'bg-gray-100 text-gray-800',
};

export function getEquipmentTypeLabel(type?: EquipmentType | null) {
    if (!type) return '-';
    return EQUIPMENT_TYPE_LABELS[type] ?? type;
}