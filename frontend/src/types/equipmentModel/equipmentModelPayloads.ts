// types/equipmentModel/equipmentModelPayloads

import type { EquipmentType } from './equipmentType';

export interface CreateEquipmentModelPayload {
    modelName: string;
    manufacturer: string;
    type: EquipmentType;
    releaseDate: string;
    description?: string | null;
}

export interface UpdateEquipmentModelPayload {
    modelName: string;
    manufacturer: string;
    type: EquipmentType;
    releaseDate: string;
    description?: string | null;
}