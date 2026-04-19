// types/equipmentModel/equipmentModel
import type { EquipmentType } from './equipmentType';

export interface EquipmentModel {
    id: number;
    modelName: string;
    manufacturer: string;
    type: EquipmentType;
    releaseDate: string;
    description: string | null;
    createdAt: string;
    updatedAt?: string | null;
}